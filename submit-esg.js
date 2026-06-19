/* ================= PUBLIC ESG SUBMISSION FORM ================= */
const ESG_CONFIG = {
  DB_KEY: 'esg_platform_state',
  DRAFT_PREFIX: 'esg_request_draft_'
};

let currentRequestId = null;
let currentRequest = null;
let appStateData = null;

function parseRequestIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('req');
  if (fromQuery) return fromQuery;

  const hash = window.location.hash.replace('#', '');
  if (hash && hash.startsWith('REQ-')) return hash;

  const pathMatch = window.location.pathname.match(/submit-esg\/(REQ-[\w-]+)/i);
  if (pathMatch) return pathMatch[1];

  return null;
}

function loadPlatformState() {
  const raw = localStorage.getItem(ESG_CONFIG.DB_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse platform state', e);
    return null;
  }
}

function savePlatformState(state) {
  localStorage.setItem(ESG_CONFIG.DB_KEY, JSON.stringify(state));
}

function generateNextRecordId(records) {
  const maxNum = (records || []).reduce((max, r) => {
    const n = parseInt(String(r.id).replace('REC-', ''), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return 'REC-' + String(maxNum + 1).padStart(3, '0');
}

function showToast(message, type) {
  const existing = document.getElementById('public-toast');
  if (existing) existing.remove();

  const colorMap = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.id = 'public-toast';
  toast.style.cssText = `
    position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
    background:#fff;border:1px solid #e2e8f0;border-left:4px solid ${colorMap[type] || colorMap.success};
    border-radius:10px;padding:1rem 1.25rem;box-shadow:0 8px 32px rgba(0,0,0,0.12);
    font-family:Inter,sans-serif;font-size:0.875rem;color:#334155;max-width:380px;
    animation:fadeSlideUp 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function markFormOpened(request) {
  if (!request) return;
  if (request.status === 'Request Sent') {
    request.status = 'Form Opened';
    savePlatformState(appStateData);
  }
}

function renderRequestMeta(request) {
  const chips = document.getElementById('request-meta-chips');
  if (!chips) return;

  const deadline = request.deadline
    ? new Date(request.deadline + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  chips.innerHTML = `
    <span class="public-meta-chip"><i data-lucide="building-2"></i> ${request.department}</span>
    <span class="public-meta-chip"><i data-lucide="calendar"></i> ${request.period}</span>
    <span class="public-meta-chip"><i data-lucide="clock"></i> Due ${deadline}</span>
    <span class="public-meta-chip"><i data-lucide="hash"></i> ${request.id}</span>
  `;
  chips.classList.remove('hidden');

  const heading = document.getElementById('page-heading');
  const sub = document.getElementById('page-subheading');
  if (heading) heading.textContent = `ESG Data Submission — ${request.department}`;
  if (sub) sub.textContent = `Hello ${request.recipientName}, please submit your ESG metrics below.`;
}

function loadDraft(requestId) {
  const draftRaw = localStorage.getItem(ESG_CONFIG.DRAFT_PREFIX + requestId);
  if (!draftRaw) return;
  try {
    const draft = JSON.parse(draftRaw);
    if (draft.carbon != null) document.getElementById('ext-carbon').value = draft.carbon;
    if (draft.energy != null) document.getElementById('ext-energy').value = draft.energy;
    if (draft.water != null) document.getElementById('ext-water').value = draft.water;
    if (draft.employees != null) document.getElementById('ext-employees').value = draft.employees;
    if (draft.training != null) document.getElementById('ext-training').value = draft.training;
    if (draft.incidents != null) document.getElementById('ext-incidents').value = draft.incidents;
    if (draft.meetings != null) document.getElementById('ext-meetings').value = draft.meetings;
    if (draft.compliance != null) document.getElementById('ext-compliance').value = draft.compliance;
    if (draft.audits != null) document.getElementById('ext-audits').value = draft.audits;
    if (draft.comments) document.getElementById('ext-comments').value = draft.comments;
    if (draft.attachmentName) {
      const label = document.getElementById('file-upload-label');
      const zone = document.getElementById('file-upload-zone');
      if (label) label.textContent = draft.attachmentName + ' (draft — re-attach to include)';
      if (zone) zone.classList.add('has-file');
    }
  } catch (e) {
    console.warn('Could not load draft', e);
  }
}

function handleAttachmentSelected(event) {
  const file = event.target.files[0];
  const label = document.getElementById('file-upload-label');
  const zone = document.getElementById('file-upload-zone');
  if (file && label && zone) {
    label.textContent = file.name;
    zone.classList.add('has-file');
  }
}

function saveExternalDraft() {
  if (!currentRequestId) return;

  const draft = {
    carbon: document.getElementById('ext-carbon').value,
    energy: document.getElementById('ext-energy').value,
    water: document.getElementById('ext-water').value,
    employees: document.getElementById('ext-employees').value,
    training: document.getElementById('ext-training').value,
    incidents: document.getElementById('ext-incidents').value,
    meetings: document.getElementById('ext-meetings').value,
    compliance: document.getElementById('ext-compliance').value,
    audits: document.getElementById('ext-audits').value,
    comments: document.getElementById('ext-comments').value,
    attachmentName: document.getElementById('ext-attachment').files[0]?.name || null,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem(ESG_CONFIG.DRAFT_PREFIX + currentRequestId, JSON.stringify(draft));
  showToast('Draft saved successfully.', 'success');
}

function submitExternalEsgData() {
  if (!currentRequest || !appStateData) return;

  if (['Submitted', 'Under Validation', 'Approved'].includes(currentRequest.status)) {
    showToast('This request has already been submitted.', 'warning');
    return;
  }

  const carbon = parseFloat(document.getElementById('ext-carbon').value);
  const energy = parseFloat(document.getElementById('ext-energy').value);
  const water = parseFloat(document.getElementById('ext-water').value);
  const employees = parseInt(document.getElementById('ext-employees').value, 10);
  const training = parseFloat(document.getElementById('ext-training').value);
  const incidents = parseInt(document.getElementById('ext-incidents').value, 10);
  const meetings = parseInt(document.getElementById('ext-meetings').value, 10);
  const compliance = parseFloat(document.getElementById('ext-compliance').value);
  const audits = parseInt(document.getElementById('ext-audits').value, 10);
  const comments = document.getElementById('ext-comments').value.trim();
  const attachmentFile = document.getElementById('ext-attachment').files[0];

  const issues = [];
  if (carbon < 0) issues.push('Invalid carbon value (cannot be negative)');
  if (compliance < 0 || compliance > 100) issues.push('Compliance score must be between 0% and 100%');
  if (employees <= 0) issues.push('Employee count must be greater than zero');

  const today = new Date().toISOString().split('T')[0];
  const recordId = generateNextRecordId(appStateData.records);

  let attachmentNote = '';
  if (attachmentFile) {
    attachmentNote = ` Attachment: ${attachmentFile.name}`;
  }

  const newRecord = {
    id: recordId,
    requestId: currentRequest.id,
    department: currentRequest.department,
    period: currentRequest.period,
    submittedOn: today,
    status: 'Pending',
    env: { carbon, energy, water },
    soc: { employees, training, incidents },
    gov: { meetings, compliance, audits },
    comments: (comments || 'External stakeholder submission via ESG Request Workflow.') + attachmentNote,
    issues: issues,
    source: 'external_request'
  };

  if (!Array.isArray(appStateData.records)) appStateData.records = [];
  appStateData.records.push(newRecord);

  currentRequest.status = 'Submitted';
  currentRequest.recordId = recordId;

  if (!Array.isArray(appStateData.recentActivities)) appStateData.recentActivities = [];
  appStateData.recentActivities.unshift({
    id: recordId,
    action: 'External data submitted',
    dept: currentRequest.department,
    time: 'Just now',
    status: 'Pending'
  });

  savePlatformState(appStateData);
  localStorage.removeItem(ESG_CONFIG.DRAFT_PREFIX + currentRequestId);

  document.getElementById('submission-form-container').classList.add('hidden');
  document.getElementById('form-success-state').classList.remove('hidden');
  document.getElementById('success-record-id').textContent = recordId;
  lucide.createIcons();
}

function initPublicForm() {
  currentRequestId = parseRequestIdFromUrl();
  appStateData = loadPlatformState();

  if (!currentRequestId || !appStateData) {
    document.getElementById('form-error-state').classList.remove('hidden');
    lucide.createIcons();
    return;
  }

  if (!Array.isArray(appStateData.esgRequests)) appStateData.esgRequests = [];
  currentRequest = appStateData.esgRequests.find(r => r.id === currentRequestId);

  if (!currentRequest) {
    document.getElementById('form-error-state').classList.remove('hidden');
    lucide.createIcons();
    return;
  }

  markFormOpened(currentRequest);
  renderRequestMeta(currentRequest);

  if (['Submitted', 'Under Validation', 'Approved', 'Rejected'].includes(currentRequest.status) && currentRequest.recordId) {
    document.getElementById('form-success-state').classList.remove('hidden');
    document.getElementById('success-record-id').textContent = currentRequest.recordId;
    lucide.createIcons();
    return;
  }

  document.getElementById('submission-form-container').classList.remove('hidden');
  loadDraft(currentRequestId);
  lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', initPublicForm);
