/* ================= STATE MANAGEMENT & INITIAL SEED DATA ================= */
const CONFIG = {
  DB_KEY: 'esg_platform_state',
  DARK_MODE_KEY: 'esg_dark_mode'
};

// Default State if localStorage is empty
const DEFAULT_STATE = {
  currentUser: {
    fullname: "Tara Alston",
    email: "tara.alston@esgplatform.com",
    role: "ESG Analyst",
    initials: "TA"
  },
  notifications: [
    { id: 1, type: "error", title: "Validation Error", text: "REC-002 carbon value invalid.", time: "10 mins ago", unread: true },
    { id: 2, type: "warning", title: "Missing Data", text: "REC-004 IT social data missing.", time: "1 hour ago", unread: true },
    { id: 3, type: "success", title: "Approved", text: "REC-003 Finance data approved.", time: "Yesterday", unread: false }
  ],
  tasks: [
    { id: 1, text: "Validate 18 pending records", date: "Jun 2, 2026", completed: true },
    { id: 2, text: "Review carbon data anomalies", date: "Jun 3, 2026", completed: false },
    { id: 3, text: "Generate Q1 2026 ESG Summary Report", date: "Jun 5, 2026", completed: false }
  ],
  recentActivities: [
    { id: "REC-001", action: "Data submitted", dept: "Operations", time: "2 hrs ago", status: "Pending" },
    { id: "REC-002", action: "Report generated", dept: "HR", time: "4 hrs ago", status: "Done" },
    { id: "REC-003", action: "Data approved", dept: "Finance", time: "Yesterday", status: "Approved" },
    { id: "REC-004", action: "Data rejected", dept: "IT", time: "Yesterday", status: "Rejected" },
    { id: "REC-005", action: "Excel imported", dept: "Procurement", time: "2 days ago", status: "Pending" }
  ],
  reportArchives: [
    {
      id: "REP-20260115-001",
      name: "ESG_Summary_Q4_2025",
      dateGenerated: "2026-01-15",
      reportType: "Standard Comprehensive",
      format: "PDF",
      size: "2.4 MB",
      approvedCount: 97,
      downloadContent: "ESG Summary Q4 2025\nType: Standard Comprehensive\nFormat: PDF\nApproved ESG Records: 97\nGenerated: 2026-01-15"
    },
    {
      id: "REP-20251210-001",
      name: "Carbon_Risk_Disclosures_2025",
      dateGenerated: "2025-12-10",
      reportType: "TCFD Carbon",
      format: "PDF",
      size: "1.8 MB",
      approvedCount: 97,
      downloadContent: "Carbon Risk Disclosures 2025\nType: TCFD Carbon\nFormat: PDF\nApproved ESG Records: 97\nGenerated: 2025-12-10"
    }
  ],
  records: [] // Will be populated dynamically on first load
};

let appState = {};

// Helper: Seed initial database with exactly 124 records matching wireframe counts:
// 97 Approved, 18 Pending (4 have issues), 9 Rejected = 124 Total
function seedDatabase() {
  const departments = ["Operations", "HR", "Finance", "IT", "Procurement", "Facilities"];
  const periods = ["Q1 2026", "Q4 2025", "Q3 2025", "Q2 2025"];
  const records = [];
  
  // Helper to generate reasonable values
  const randRange = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(1));
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  let idCounter = 1;
  const generateId = () => "REC-" + String(idCounter++).padStart(3, '0');

  // 1. Generate 18 Pending records (4 have issues)
  // Let's create specific ones matching the wireframe table first:
  // REC-001: Operations, Pending
  // REC-002: HR, Errors Found
  // REC-003: Finance, Approved (will go in approved bucket)
  // REC-004: IT, Missing Data
  // REC-005: Procurement, Pending
  // REC-006: Facilities, Pending
  
  // Pending REC-001 (Operations)
  records.push({
    id: "REC-001",
    department: "Operations",
    period: "Q1 2026",
    submittedOn: "2026-06-01",
    status: "Pending",
    env: { carbon: 154.2, energy: 18450, water: 310.5 },
    soc: { employees: 210, training: 640, incidents: 0 },
    gov: { meetings: 5, compliance: 100, audits: 1 },
    comments: "Operations routine data.",
    issues: []
  });
  idCounter++; // Set to 2

  // Pending REC-002 (HR - with errors)
  records.push({
    id: "REC-002",
    department: "HR",
    period: "Q1 2026",
    submittedOn: "2026-06-02",
    status: "Pending",
    env: { carbon: -12.5, energy: 9400, water: 85.0 }, // negative carbon is error
    soc: { employees: 85, training: 120, incidents: 2 },
    gov: { meetings: 3, compliance: 100, audits: 0 },
    comments: "HR data. Date check required.",
    issues: ["Invalid carbon value (cannot be negative)", "Date out of range (historical bounds)"]
  });
  idCounter++; // Set to 3
  
  // Approved REC-003 (Finance)
  records.push({
    id: "REC-003",
    department: "Finance",
    period: "Q1 2026",
    submittedOn: "2026-06-03",
    status: "Approved",
    approvedDate: "2026-06-04",
    env: { carbon: 4.8, energy: 3100, water: 12.0 },
    soc: { employees: 42, training: 88, incidents: 0 },
    gov: { meetings: 4, compliance: 99.5, audits: 2 },
    comments: "Finance corporate office parameters verified.",
    issues: []
  });
  idCounter++; // Set to 4

  // Pending REC-004 (IT - with missing data)
  records.push({
    id: "REC-004",
    department: "IT",
    period: "Q1 2026",
    submittedOn: "2026-06-04",
    status: "Pending",
    env: { carbon: 89.4, energy: 35000, water: 110.0 },
    soc: { employees: 154, training: 0, incidents: 0 }, // training 0 = warning
    gov: { meetings: 4, compliance: 98.0, audits: 1 },
    comments: "Server room energy details. Social metrics pending HR confirmation.",
    issues: ["Social data missing (Training Hours cannot be 0)"]
  });
  idCounter++; // Set to 5

  // Pending REC-005 (Procurement - with incomplete governance)
  records.push({
    id: "REC-005",
    department: "Procurement",
    period: "Q1 2026",
    submittedOn: "2026-06-05",
    status: "Pending",
    env: { carbon: 35.1, energy: 12400, water: 45.2 },
    soc: { employees: 60, training: 140, incidents: 0 },
    gov: { meetings: 0, compliance: 0, audits: 0 }, // incomplete governance
    comments: "Procurement records for supply chain.",
    issues: ["Governance incomplete (Compliance and meetings require values)"]
  });
  idCounter++; // Set to 6

  // Pending REC-006 (Facilities)
  records.push({
    id: "REC-006",
    department: "Facilities",
    period: "Q1 2026",
    submittedOn: "2026-06-05",
    status: "Pending",
    env: { carbon: 215.3, energy: 48900, water: 620.0 },
    soc: { employees: 95, training: 220, incidents: 1 },
    gov: { meetings: 3, compliance: 95.0, audits: 1 },
    comments: "Facilities utility totals.",
    issues: []
  });
  idCounter++; // Set to 7

  // Add remaining 13 pending records to make 18 total pending records
  while (records.filter(r => r.status === "Pending").length < 18) {
    const dept = departments[randInt(0, departments.length - 1)];
    const per = periods[randInt(0, periods.length - 1)];
    records.push({
      id: generateId(),
      department: dept,
      period: per,
      submittedOn: `2026-06-${String(randInt(1, 12)).padStart(2, '0')}`,
      status: "Pending",
      env: { carbon: randRange(10, 250), energy: randInt(2000, 50000), water: randRange(10, 800) },
      soc: { employees: randInt(10, 300), training: randInt(50, 800), incidents: randInt(0, 3) },
      gov: { meetings: randInt(2, 8), compliance: randRange(85, 100), audits: randInt(0, 3) },
      comments: "Auto-generated pending data entry.",
      issues: []
    });
  }

  // 2. Generate remaining approved records to reach exactly 97 approved records
  while (records.filter(r => r.status === "Approved").length < 97) {
    const dept = departments[randInt(0, departments.length - 1)];
    const per = periods[randInt(0, periods.length - 1)];
    const subDay = randInt(1, 10);
    records.push({
      id: generateId(),
      department: dept,
      period: per,
      submittedOn: `2026-05-${String(subDay).padStart(2, '0')}`,
      status: "Approved",
      approvedDate: `2026-05-${String(subDay + randInt(1, 4)).padStart(2, '0')}`,
      env: { carbon: randRange(10, 250), energy: randInt(2000, 50000), water: randRange(10, 800) },
      soc: { employees: randInt(10, 300), training: randInt(50, 800), incidents: randInt(0, 2) },
      gov: { meetings: randInt(2, 8), compliance: randRange(95, 100), audits: randInt(1, 4) },
      comments: "Verified approved compliance parameters.",
      issues: []
    });
  }

  // 3. Generate 9 rejected records to reach exactly 9 rejected
  while (records.filter(r => r.status === "Rejected").length < 9) {
    const dept = departments[randInt(0, departments.length - 1)];
    const per = periods[randInt(0, periods.length - 1)];
    records.push({
      id: generateId(),
      department: dept,
      period: per,
      submittedOn: `2026-05-${String(randInt(10, 25)).padStart(2, '0')}`,
      status: "Rejected",
      env: { carbon: randRange(150, 600), energy: randInt(40000, 95000), water: randRange(500, 2000) }, // unusually high values
      soc: { employees: randInt(50, 300), training: randInt(10, 50), incidents: randInt(3, 8) },
      gov: { meetings: randInt(0, 2), compliance: randRange(60, 85), audits: 0 },
      comments: "Rejected due to anomalous utility metrics and compliance concerns.",
      issues: ["Utility limits exceeded", "Compliance rate below threshold limit"]
    });
  }

  // Sort records by ID ascending initially so it matches table views logically
  records.sort((a, b) => {
    return parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]);
  });

  return records;
}

// Load State from localStorage or init default
function loadAppState() {
  const localData = localStorage.getItem(CONFIG.DB_KEY);
  if (localData) {
    try {
      appState = JSON.parse(localData);
    } catch (e) {
      console.error("Error parsing local state, using defaults.", e);
      appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
      appState.records = seedDatabase();
      saveAppState();
    }
  } else {
    appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    appState.records = seedDatabase();
    saveAppState();
  }
  
  let stateMutated = false;
  if (!Array.isArray(appState.records) || appState.records.length === 0) {
    appState.records = seedDatabase();
    stateMutated = true;
  }
  if (!Array.isArray(appState.reportArchives) || appState.reportArchives.length === 0) {
    appState.reportArchives = JSON.parse(JSON.stringify(DEFAULT_STATE.reportArchives));
    stateMutated = true;
  }
  if (!Array.isArray(appState.notifications)) {
    appState.notifications = JSON.parse(JSON.stringify(DEFAULT_STATE.notifications));
    stateMutated = true;
  }
  if (!Array.isArray(appState.recentActivities)) {
    appState.recentActivities = JSON.parse(JSON.stringify(DEFAULT_STATE.recentActivities));
    stateMutated = true;
  }
  if (stateMutated) {
    saveAppState();
  }
  
  // Theme check
  const darkMode = localStorage.getItem(CONFIG.DARK_MODE_KEY) === 'true';
  toggleDarkMode(darkMode);
  const darkModeCheckbox = document.getElementById('set-dark-mode');
  if (darkModeCheckbox) darkModeCheckbox.checked = darkMode;
}

// Save state to localStorage
function saveAppState() {
  localStorage.setItem(CONFIG.DB_KEY, JSON.stringify(appState));
}


/* ================= INITIALIZATION & SETUP ================= */
let barChartInstance = null;
let donutChartInstance = null;
let activeValidationTab = "Pending";
let validationSearchQuery = "";
let approvedFilterDept = "all";
let currentRecordPaginationPage = 1;
const recordsPerPage = 6;
let selectedFile = null;
let selectedImportOption = 'standard';
let tempFormDraft = null;
let selectedRecordForModal = null;
let selectedRecordForValidation = null;
let editingRecordId = null;
let pendingValidationDecision = null;

document.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  lucide.createIcons();
  
  // Populate UI bindings
  updateProfileDetailsUI();
  updateDashboardKPIs();
  initDashboardCharts();
  renderRecentActivities();
  renderReportArchives();
  renderTasksList();
  
  // Set default form date/period to current option
  const periodSelect = document.getElementById('form-period');
  if (periodSelect) periodSelect.selectedIndex = 1; // Q1 2026

  // Setup click listener outside dropdowns to close them
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-wrapper')) {
      document.getElementById('notification-dropdown').classList.add('hidden');
    }
    if (!e.target.closest('.user-profile-wrapper')) {
      document.getElementById('profile-dropdown').classList.add('hidden');
    }
  });

  // Setup Drag & Drop listeners
  setupDragAndDrop();
  
  // Initialize Reports tab dynamic period dropdown
  handleReportScopeChange();
});

// Update Profile visual strings in shell
function updateProfileDetailsUI() {
  const profileNameSpans = document.querySelectorAll('.user-name');
  const profileRoleSpans = document.querySelectorAll('.user-role');
  const avatarDivs = document.querySelectorAll('.avatar');
  const userFullname = document.querySelector('.user-fullname');
  const userEmail = document.querySelector('.user-email');

  profileNameSpans.forEach(s => s.textContent = appState.currentUser.fullname.split(' ')[0]);
  profileRoleSpans.forEach(s => s.textContent = appState.currentUser.role);
  avatarDivs.forEach(a => a.textContent = appState.currentUser.initials);
  
  if (userFullname) userFullname.textContent = appState.currentUser.fullname;
  if (userEmail) userEmail.textContent = appState.currentUser.email;

  // Settings form pre-population
  const setFullname = document.getElementById('set-fullname');
  const setEmail = document.getElementById('set-email');
  if (setFullname) setFullname.value = appState.currentUser.fullname;
  if (setEmail) setEmail.value = appState.currentUser.email;
}


/* ================= VIEW ROUTING SYSTEM ================= */
function switchTab(tabId, subOption = null) {
  if (tabId === 'data-collection') {
    openEsgDataCollectionModal(subOption);
    return;
  }

  // Hide all screens
  const panels = document.querySelectorAll('.view-panel');
  panels.forEach(p => p.classList.remove('active'));
  
  // Show target
  const targetPanel = document.getElementById(tabId + '-view');
  if (targetPanel) targetPanel.classList.add('active');
  
  // Update sidebar active link
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  const activeNav = document.getElementById('nav-' + tabId);
  if (activeNav) activeNav.classList.add('active');
  
  // Update Title
  const titleMap = {
    'dashboard': 'Dashboard',
    'my-esg-data': 'My ESG Data',
    'data-validation': 'Data Validation',
    'reports': 'Reports',
    'settings': 'Settings',
    'help': 'Help & Support'
  };
  document.getElementById('page-title').textContent = titleMap[tabId] || 'ESG Platform';
  
  // View specific setups
  if (tabId === 'dashboard') {
    updateDashboardKPIs();
    updateDashboardCharts();
    renderRecentActivities();
  } else if (tabId === 'data-validation') {
    if (subOption) {
      activeValidationTab = subOption;
    }
    currentRecordPaginationPage = 1;
    renderValidationworkbench();
  } else if (tabId === 'my-esg-data') {
    if (subOption) {
      approvedFilterDept = "all";
      const filterSelect = document.getElementById('esg-filter-dept');
      if (filterSelect) filterSelect.value = "all";
    }
    renderApprovedRecordsTable();
  } else if (tabId === 'reports') {
    renderReportArchives();
  }
  
  // Close sidebar drawer if open on mobile devices
  toggleSidebar(false);
  
  // Smooth scroll main container back to top
  document.querySelector('.app-main').scrollTop = 0;
  
  // Refresh icons
  lucide.createIcons();
}

function switchCollectionTab(type) {
  const btnImport = document.getElementById('btn-toggle-import');
  const btnManual = document.getElementById('btn-toggle-manual');
  const panelImport = document.getElementById('import-excel-panel');
  const panelManual = document.getElementById('manual-entry-panel');
  if (type === 'import') {
    btnImport.classList.add('active'); btnManual.classList.remove('active');
    panelImport.classList.add('active'); panelManual.classList.remove('active');
  } else {
    btnImport.classList.remove('active'); btnManual.classList.add('active');
    panelImport.classList.remove('active'); panelManual.classList.add('active');
  }
}

/* ================= MODAL CONTROLS ================= */
function openEsgDataCollectionModal(subOption = null) {
  const modal = document.getElementById('data-collection-modal');
  if (modal) {
    modal.classList.remove('hidden');
    if (subOption === 'manual') {
      switchCollectionTab('manual');
    } else {
      switchCollectionTab('import');
    }
    lucide.createIcons();
  }
}

function closeEsgDataCollectionModal(event = null) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('data-collection-modal');
  if (modal) {
    modal.classList.add('hidden');
    clearManualEditingState();
  }
}

function openReportGeneratorModal() {
  const modal = document.getElementById('report-generator-modal');
  if (modal) {
    modal.classList.remove('hidden');
    // Pre-populate period options
    handleReportScopeChange();
    lucide.createIcons();
  }
}

function closeReportGeneratorModal(event = null) {
  if (event && event.target !== event.currentTarget) return;
  const modal = document.getElementById('report-generator-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function toggleSidebar(open) {
  const sidebar = document.querySelector('.sidebar');
  if (open) {
    sidebar.classList.add('open');
  } else {
    sidebar.classList.remove('open');
  }
}


/* ================= HEADER DROPDOWNS & AUTHENTICATION ================= */
function toggleNotifications() {
  const nd = document.getElementById('notification-dropdown');
  const pd = document.getElementById('profile-dropdown');
  pd.classList.add('hidden');
  nd.classList.toggle('hidden');
}

function toggleProfileMenu() {
  const nd = document.getElementById('notification-dropdown');
  const pd = document.getElementById('profile-dropdown');
  nd.classList.add('hidden');
  pd.classList.toggle('hidden');
}

function clearNotifications() {
  appState.notifications = [];
  saveAppState();
  renderNotificationsList();
  updateNotificationBadge();
}

function renderNotificationsList() {
  const list = document.getElementById('notification-list');
  if (!list) return;
  
  if (appState.notifications.length === 0) {
    list.innerHTML = `<li class="empty-state">No new notifications</li>`;
    return;
  }
  
  list.innerHTML = appState.notifications.map(n => {
    const iconMap = {
      error: "alert-triangle",
      warning: "alert-circle",
      success: "check-circle-2"
    };
    const colorClass = {
      error: "text-error",
      warning: "text-warning",
      success: "text-success"
    }[n.type];
    
    return `
      <li class="${n.unread ? 'unread' : ''}" onclick="markNotificationRead(${n.id})">
        <i data-lucide="${iconMap[n.type] || 'info'}" class="${colorClass}"></i>
        <div class="notification-body">
          <p>${n.text}</p>
          <span>${n.time}</span>
        </div>
      </li>
    `;
  }).join('');
  lucide.createIcons();
}

function updateNotificationBadge() {
  const unreadCount = appState.notifications.filter(n => n.unread).length;
  const badges = document.querySelectorAll('.notification-badge');
  badges.forEach(b => {
    if (unreadCount === 0) {
      b.classList.add('hidden');
    } else {
      b.classList.remove('hidden');
      b.textContent = unreadCount;
    }
  });
}

function markNotificationRead(id) {
  const n = appState.notifications.find(notif => notif.id === id);
  if (n) {
    n.unread = false;
    saveAppState();
    updateNotificationBadge();
    renderNotificationsList();
  }
}

// Password Visibility Toggle
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.getElementById('password-toggle-icon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.setAttribute('data-lucide', 'eye-off');
  } else {
    passwordInput.type = 'password';
    toggleIcon.setAttribute('data-lucide', 'eye');
  }
  lucide.createIcons();
}

// Login triggers
function handleLogin() {
  const username = document.getElementById('username').value.trim();
  if (!username) return;
  
  // Set current user details based on inputs
  appState.currentUser.fullname = username.includes('.') ? 
    username.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
    "Tara Alston";
  
  appState.currentUser.initials = appState.currentUser.fullname.split(' ').map(n => n[0]).join('').toUpperCase();
  appState.currentUser.email = `${username.toLowerCase()}@esgplatform.com`;
  
  saveAppState();
  updateProfileDetailsUI();
  
  // Show Main shell
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  
  // Load initial configurations
  switchTab('dashboard');
}

function handleSSOLogin() {
  document.getElementById('username').value = "tara.alston";
  document.getElementById('password').value = "sso_auth_token_secret";
  handleLogin();
}

function handleLogout() {
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  
  // Clear fields
  document.getElementById('username').value = "";
  document.getElementById('password').value = "";
}


/* ================= DASHBOARD KPIs & LISTS ================= */
function updateDashboardKPIs() {
  const records = appState.records;
  const totalCount = records.length;
  const pendingCount = records.filter(r => r.status === 'Pending').length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;
  const reportCount = Array.isArray(appState.reportArchives) ? appState.reportArchives.length : 0;
  const issuesCount = records.filter(r => r.status === 'Pending' && r.issues && r.issues.length > 0).length;
  document.getElementById('kpi-total-records').textContent = totalCount;
  document.getElementById('kpi-pending-validation').textContent = pendingCount;
  document.getElementById('kpi-approved-data').textContent = approvedCount;
  document.getElementById('kpi-data-issues').textContent = issuesCount;
  const reportKPI = document.getElementById('kpi-reports');
  if (reportKPI) {
    reportKPI.textContent = reportCount;
  }
  
  // Validation badging in menu
  const validationBadge = document.getElementById('validation-badge');
  if (validationBadge) {
    if (pendingCount === 0) {
      validationBadge.classList.add('hidden');
    } else {
      validationBadge.classList.remove('hidden');
      validationBadge.textContent = pendingCount;
    }
  }

  // Data Quality Metrics
  const errorsCount = records.filter(r => r.issues && r.issues.some(i => i.toLowerCase().includes('error') || i.toLowerCase().includes('invalid'))).length;
  const missingCount = records.filter(r => r.issues && r.issues.some(i => i.toLowerCase().includes('missing') || i.toLowerCase().includes('incomplete'))).length;
  
  const completeCount = approvedCount;
  const duplicateCount = 4; // Mock duplication constant

  const completePct = ((completeCount / records.length) * 100).toFixed(1);
  const missingPct = ((missingCount / records.length) * 100).toFixed(1);
  const errorsPct = ((errorsCount / records.length) * 100).toFixed(1);
  const duplicatesPct = ((duplicateCount / records.length) * 100).toFixed(1);

  document.getElementById('quality-complete-pct').textContent = completePct + "%";
  document.getElementById('quality-complete-bar').style.width = completePct + "%";
  document.getElementById('quality-complete-count').textContent = `${completeCount} Records`;

  document.getElementById('quality-missing-pct').textContent = missingPct + "%";
  document.getElementById('quality-missing-bar').style.width = missingPct + "%";
  document.getElementById('quality-missing-count').textContent = `${missingCount} Records`;

  document.getElementById('quality-errors-pct').textContent = errorsPct + "%";
  document.getElementById('quality-errors-bar').style.width = errorsPct + "%";
  document.getElementById('quality-errors-count').textContent = `${errorsCount} Records`;

  document.getElementById('quality-duplicates-pct').textContent = duplicatesPct + "%";
  document.getElementById('quality-duplicates-bar').style.width = duplicatesPct + "%";
  document.getElementById('quality-duplicates-count').textContent = `${duplicateCount} Records`;
}
function renderRecentActivities() {
  const tbody = document.getElementById('recent-activities-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = appState.recentActivities.slice(0, 5).map(act => {
    let statusClass = "badge-pending";
    if (act.status === 'Approved' || act.status === 'Done') statusClass = "badge-approved";
    if (act.status === 'Rejected') statusClass = "badge-rejected";
    
    return `
      <tr>
        <td class="font-mono">${act.id}</td>
        <td>${act.action}</td>
        <td>${act.dept}</td>
        <td>${act.time}</td>
        <td><span class="badge ${statusClass}">${act.status}</span></td>
      </tr>
    `;
  }).join('');
}

function logActivity(recordId, action, dept, status) {
  appState.recentActivities.unshift({
    id: recordId,
    action: action,
    dept: dept,
    time: "Just now",
    status: status
  });
  saveAppState();
}


/* ================= TASKS SYSTEM ================= */
function renderTasksList() {
  const list = document.getElementById('upcoming-tasks-list');
  if (!list) return;
  
  list.innerHTML = appState.tasks.map(t => {
    return `
      <li>
        <label class="checkbox-container ${t.completed ? 'strikethrough' : ''}">
          <input type="checkbox" onchange="toggleTaskState(${t.id}, this)" ${t.completed ? 'checked' : ''}>
          <span class="checkmark"></span>
          ${t.text}
        </label>
        <span class="task-date"><i data-lucide="calendar"></i> ${t.date}</span>
      </li>
    `;
  }).join('');
  lucide.createIcons();
}

function toggleTaskState(id, checkbox) {
  const task = appState.tasks.find(t => t.id === id);
  if (task) {
    task.completed = checkbox.checked;
    saveAppState();
    
    // Add checklist strikethrough classes
    const label = checkbox.closest('label');
    if (checkbox.checked) {
      label.classList.add('strikethrough');
    } else {
      label.classList.remove('strikethrough');
    }
  }
}

function addNewTask() {
  const text = prompt("Enter the new task description:");
  if (!text || text.trim() === "") return;
  
  const today = new Date();
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString("en-US", options);
  
  const newId = appState.tasks.length > 0 ? Math.max(...appState.tasks.map(t => t.id)) + 1 : 1;
  appState.tasks.push({
    id: newId,
    text: text.trim(),
    date: formattedDate,
    completed: false
  });
  
  saveAppState();
  renderTasksList();
}


/* ================= CHARTS WITH CHART.JS ================= */
function initDashboardCharts() {
  const ctxBar = document.getElementById('esgOverviewBarChart');
  const ctxDonut = document.getElementById('esgOverviewDonutChart');
  
  if (!ctxBar || !ctxDonut) return;
  
  // 1. Grouped Bar Chart Setup
  barChartInstance = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['Environmental', 'Social', 'Governance'],
      datasets: [
        {
          label: 'Operations',
          data: [65, 45, 20],
          backgroundColor: '#5c3fe6', // Vibrant Violet
          borderRadius: 4
        },
        {
          label: 'HR',
          data: [10, 80, 15],
          backgroundColor: '#8b5cf6', // Vibrant Violet Light
          borderRadius: 4
        },
        {
          label: 'Finance',
          data: [15, 12, 60],
          backgroundColor: '#f59e0b', // Vibrant Amber
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { size: 10, family: 'Inter' }
          }
        },
        tooltip: {
          titleFont: { family: 'Outfit', size: 12 },
          bodyFont: { family: 'Inter', size: 11 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { drawBorder: false, color: '#f1f5f9' },
          ticks: { font: { size: 10 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });

  // 2. Donut Chart Setup
  donutChartInstance = new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
      labels: ['Environmental', 'Social', 'Governance'],
      datasets: [{
        data: [80, 60, 40],
        backgroundColor: [
          '#10b981', // Environmental Teal
          '#8b5cf6', // Social Violet
          '#f59e0b'  // Governance Amber
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const val = context.raw;
              const pct = ((val / total) * 100).toFixed(1);
              return ` ${context.label}: ${val} (${pct}%)`;
            }
          }
        }
      }
    }
  });
  
  updateDashboardCharts();
}

function updateDashboardCharts() {
  if (!barChartInstance || !donutChartInstance) return;
  
  const records = appState.records;
  const approvedRecords = records.filter(r => r.status === 'Approved');
  
  const categoryFilter = document.getElementById('chart-filter-category').value;
  const periodFilter = document.getElementById('chart-filter-period').value;
  
  // Filter records by period
  const periodMap = {
    'q1-2026': 'Q1 2026',
    'q4-2025': 'Q4 2025',
    'full-2025': 'Full Year 2025'
  };
  
  const targetPeriod = periodMap[periodFilter] || 'Q1 2026';
  const periodRecords = approvedRecords.filter(r => r.period === targetPeriod || (periodFilter === 'full-2025' && r.period.includes('2025')));
  
  // Aggregate sums by department & categories
  const departments = ["Operations", "HR", "Finance", "IT", "Procurement", "Facilities"];
  
  const envSums = {};
  const socSums = {};
  const govSums = {};
  
  departments.forEach(d => {
    envSums[d] = 0;
    socSums[d] = 0;
    govSums[d] = 0;
  });
  
  periodRecords.forEach(r => {
    if (envSums[r.department] !== undefined) {
      // Scale variables to fit chart axes nicely
      envSums[r.department] += r.env.carbon;
      socSums[r.department] += r.soc.employees;
      govSums[r.department] += r.gov.meetings;
    }
  });
  
  // Calculate average category totals for the donut chart
  let envTotal = 0;
  let socTotal = 0;
  let govTotal = 0;
  
  records.forEach(r => {
    if (r.env) envTotal += 1;
    if (r.soc) socTotal += 1;
    if (r.gov) govTotal += 1;
  });

  // Calculate percentages based on database state
  const totalDatasetCount = records.length;
  const envPct = ((envTotal / (envTotal + socTotal + govTotal)) * 100).toFixed(1);
  const socPct = ((socTotal / (envTotal + socTotal + govTotal)) * 100).toFixed(1);
  const govPct = ((govTotal / (envTotal + socTotal + govTotal)) * 100).toFixed(1);
  
  // Update Donut center text & legends
  document.getElementById('donut-total-val').textContent = totalDatasetCount;
  
  document.getElementById('legend-env-val').textContent = `${envTotal} (${envPct}%)`;
  document.getElementById('legend-soc-val').textContent = `${socTotal} (${socPct}%)`;
  document.getElementById('legend-gov-val').textContent = `${govTotal} (${govPct}%)`;
  
  // Update donut dataset
  donutChartInstance.data.datasets[0].data = [envTotal, socTotal, govTotal];
  
  // Themes colors sync for chart border
  const isDark = document.body.classList.contains('dark');
  donutChartInstance.data.datasets[0].borderColor = isDark ? '#151d30' : '#ffffff';
  donutChartInstance.update();
  
  // Update Bar dataset
  // Let's populate the top 3 departments with data
  const datasets = [];
  const colors = isDark ? 
    ['#7a5df5', '#8b5cf6', '#10b981', '#f59e0b'] : 
    ['#5c3fe6', '#8b5cf6', '#10b981', '#f59e0b'];
    
  let idx = 0;
  
  // Focus on top departments
  const activeDepartments = ["Operations", "HR", "Finance", "IT"];
  
  activeDepartments.forEach(dept => {
    let dataVals = [
      Math.round(envSums[dept] / 10) || randBetween(15, 60), 
      Math.round(socSums[dept] / 5) || randBetween(20, 80), 
      Math.round(govSums[dept] * 10) || randBetween(10, 50)
    ];
    
    // Handle category filter masking
    if (categoryFilter === 'environmental') {
      dataVals = [dataVals[0], 0, 0];
    } else if (categoryFilter === 'social') {
      dataVals = [0, dataVals[1], 0];
    } else if (categoryFilter === 'governance') {
      dataVals = [0, 0, dataVals[2]];
    }
    
    datasets.push({
      label: dept,
      data: dataVals,
      backgroundColor: colors[idx % colors.length],
      borderRadius: 4
    });
    idx++;
  });
  
  barChartInstance.data.datasets = datasets;
  
  // Dark mode grid line adjustments
  barChartInstance.options.scales.y.grid.color = isDark ? '#242f47' : '#f1f5f9';
  barChartInstance.options.scales.y.ticks.color = isDark ? '#94a3b8' : '#6b7280';
  barChartInstance.options.scales.x.ticks.color = isDark ? '#94a3b8' : '#6b7280';
  barChartInstance.options.plugins.legend.labels.color = isDark ? '#e2e8f0' : '#374151';
  
  barChartInstance.update();
}

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* ================= EXCEL/CSV SIMULATED IMPORT FLOW ================= */
function setupDragAndDrop() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  
  if (!dropZone) return;
  
  // Prevent browser default file open actions
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
  });
  
  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  });
}

function triggerFileSelect() {
  document.getElementById('file-input').click();
}

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentField = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      row.push(currentField.trim());
      if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
        lines.push(row);
      }
      row = [];
      currentField = '';
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip newline
      }
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || row.length > 0) {
    row.push(currentField.trim());
    lines.push(row);
  }
  return lines;
}

// Auto-mapping heuristics
function getSuggestedMapping(header) {
  const h = header.toLowerCase().trim();
  if (h.includes("carbon") || h.includes("co2") || h.includes("emission") || h.includes("greenhouse")) return "env.carbon";
  if (h.includes("energy") || h.includes("kwh") || h.includes("electricity") || h.includes("power")) return "env.energy";
  if (h.includes("water") || h.includes("m3") || h.includes("usage") || h.includes("consumption")) {
    if (h.includes("energy")) return "env.energy"; // safety override for "energy consumption" vs "water consumption"
    return "env.water";
  }
  if (h.includes("dept") || h.includes("department") || h.includes("division")) return "department";
  if (h.includes("period") || h.includes("quarter") || h.includes("year") || h.includes("timeframe") || h.includes("month")) return "period";
  if (h.includes("employee") || h.includes("headcount") || h.includes("staff") || h.includes("people") || h.includes("worker")) return "soc.employees";
  if (h.includes("training") || h.includes("hour") || h.includes("education") || h.includes("learn")) return "soc.training";
  if (h.includes("incident") || h.includes("safety") || h.includes("accident") || h.includes("injury") || h.includes("hazard")) return "soc.incidents";
  if (h.includes("meeting") || h.includes("board") || h.includes("committee")) return "soc.meetings";
  if (h.includes("compliance") || h.includes("rate") || h.includes("percent") || h.includes("legal")) return "gov.compliance";
  if (h.includes("audit") || h.includes("conducted") || h.includes("verification") || h.includes("check")) return "gov.audits";
  if (h.includes("comment") || h.includes("note") || h.includes("remark") || h.includes("description") || h.includes("feedback")) return "comments";
  return "ignore";
}

let uploadedCSVHeaders = [];
let uploadedCSVRows = [];
let parsedSpreadsheetRows = [];

function handleFileSelected(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function processFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['xlsx', 'xls', 'csv'].includes(ext)) {
    alert("Unsupported file format! Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.");
    return;
  }
  
  selectedFile = file;
  
  // Hide drag-inner text and show progress bar details
  const inner = document.querySelector('.drag-drop-inner');
  const progressBox = document.getElementById('upload-progress-container');
  
  inner.classList.add('hidden');
  progressBox.classList.remove('hidden');
  
  document.getElementById('selected-file-name').textContent = file.name;
  document.getElementById('selected-file-size').textContent = (file.size / 1024).toFixed(1) + " KB";
  
  // Progress Bar Animation
  const progressBar = document.getElementById('file-upload-progress');
  progressBar.style.width = "0%";
  
  let p = 0;
  const interval = setInterval(() => {
    p += 25;
    progressBar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(interval);
      
      // If it's a CSV, read it!
      if (ext === 'csv') {
        const reader = new FileReader();
        reader.onload = function(e) {
          const text = e.target.result;
          const parsedLines = parseCSV(text);
          if (parsedLines.length > 0) {
            uploadedCSVHeaders = parsedLines[0];
            uploadedCSVRows = parsedLines.slice(1);
            console.log("Parsed CSV file successfully. Rows count:", uploadedCSVRows.length);
          } else {
            alert("The CSV file is empty!");
            cancelUploadedFile();
          }
        };
        reader.readAsText(file);
      } else {
        // Fallback or excel simulation template mapping
        alert("Note: Actual client-side parsing is done on CSV files. For Excel files (.xlsx, .xls), we will load standard corporate template columns for demonstration.");
        uploadedCSVHeaders = ["Record ID", "Department", "Period", "Carbon Emissions (tCO2e)", "Energy Consumption (kWh)", "Water Usage (m3)", "Comments"];
        uploadedCSVRows = [
          ["REC-101", "Operations", "Q1 2026", "154.2", "18450", "310.5", "Standard Operations"],
          ["REC-102", "Facilities", "Q1 2026", "-12.5", "48900", "-45.0", "Facilities Check"],
          ["REC-103", "Finance", "Q1 2026", "4.8", "3100", "12.0", "Quarterly audit"]
        ];
      }
      
      document.getElementById('btn-next-step').disabled = false;
      lucide.createIcons();
    }
  }, 100);
}

function cancelUploadedFile() {
  selectedFile = null;
  const inner = document.querySelector('.drag-drop-inner');
  const progressBox = document.getElementById('upload-progress-container');
  
  inner.classList.remove('hidden');
  progressBox.classList.add('hidden');
  
  document.getElementById('btn-next-step').disabled = true;
  document.getElementById('file-input').value = "";
}

function resetImportFlow() {
  cancelUploadedFile();
  document.getElementById('import-step-1').classList.add('active');
  document.getElementById('import-step-1').classList.remove('completed');
  document.getElementById('import-step-2').classList.remove('active', 'completed');
  document.getElementById('import-step-3').classList.remove('active', 'completed');
  document.getElementById('import-step-1').querySelector('.step-num').innerHTML = "1";
  document.getElementById('import-step-2').querySelector('.step-num').innerHTML = "2";
  document.getElementById('import-step-3').querySelector('.step-num').innerHTML = "3";
  
  const validationStepper = document.getElementById('validation-mapping-stepper');
  if (validationStepper) validationStepper.classList.add('hidden');
}

function proceedToMappingStep() {
  if (!selectedFile) return;
  
  // Update Stepper header visuals in Collection panel
  document.getElementById('import-step-1').classList.remove('active');
  document.getElementById('import-step-1').classList.add('completed');
  document.getElementById('import-step-1').querySelector('.step-num').innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px;"></i>`;
  document.getElementById('import-step-2').classList.add('active');
  
  // Hide upload UI, show mapping UI
  document.getElementById('import-upload-container').classList.add('hidden');
  document.getElementById('import-mapping-preview-container').classList.remove('hidden');
  
  // Reset preview wrapper and disable confirm button
  document.getElementById('import-preview-wrapper').classList.add('hidden');
  document.getElementById('btn-import-confirm').disabled = true;
  
  // Build mapping table dynamically
  const tbody = document.getElementById('mapping-table-tbody');
  if (!tbody) return;
  
  const targetOptions = [
    { value: 'ignore', label: '-- Ignore Column --' },
    { value: 'department', label: 'Department' },
    { value: 'period', label: 'Reporting Period' },
    { value: 'env.carbon', label: 'Carbon Emissions (tCO2e)' },
    { value: 'env.energy', label: 'Energy Consumption (kWh)' },
    { value: 'env.water', label: 'Water Usage (m3)' },
    { value: 'soc.employees', label: 'Total Employees' },
    { value: 'soc.training', label: 'Training Hours' },
    { value: 'soc.incidents', label: 'Workplace Incidents' },
    { value: 'soc.meetings', label: 'Board Meetings' },
    { value: 'gov.compliance', label: 'Compliance Rate (%)' },
    { value: 'gov.audits', label: 'Audits Conducted' },
    { value: 'comments', label: 'Comments' }
  ];
  
  tbody.innerHTML = uploadedCSVHeaders.map((header, idx) => {
    const suggested = getSuggestedMapping(header);
    
    // Estimate data type from row values
    let isNumeric = true;
    let sampleCount = 0;
    for (let r = 0; r < Math.min(5, uploadedCSVRows.length); r++) {
      const val = uploadedCSVRows[r][idx];
      if (val !== undefined && val !== '') {
        sampleCount++;
        if (isNaN(Number(val))) {
          isNumeric = false;
        }
      }
    }
    const dataType = (sampleCount > 0 && isNumeric) ? 'Numeric' : 'Text';
    
    const optionsHtml = targetOptions.map(opt => {
      const selected = (opt.value === suggested) ? 'selected' : '';
      return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
    }).join('');
    
    return `
      <tr>
        <td><strong>${header}</strong></td>
        <td>${dataType}</td>
        <td>
          <select class="map-dropdown" data-header-index="${idx}">
            ${optionsHtml}
          </select>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function runImportDataValidation() {
  const selects = document.querySelectorAll('#mapping-table-tbody .map-dropdown');
  const mapping = {};
  
  selects.forEach(sel => {
    const targetAttr = sel.value;
    const headerIdx = parseInt(sel.getAttribute('data-header-index'));
    if (targetAttr !== 'ignore') {
      mapping[targetAttr] = headerIdx;
    }
  });
  
  parsedSpreadsheetRows = uploadedCSVRows.map((csvRow, rowIdx) => {
    const rowData = {
      rowId: rowIdx + 1,
      department: "Unspecified",
      period: "Q1 2026",
      env: { carbon: 0, energy: 0, water: 0 },
      soc: { employees: 0, training: 0, incidents: 0, meetings: 0 },
      gov: { compliance: 100, audits: 0 },
      comments: "",
      issues: {},
      isValid: true
    };
    
    if (mapping['department'] !== undefined) {
      rowData.department = csvRow[mapping['department']] || "Unspecified";
    }
    if (mapping['period'] !== undefined) {
      rowData.period = csvRow[mapping['period']] || "Q1 2026";
    }
    if (mapping['comments'] !== undefined) {
      rowData.comments = csvRow[mapping['comments']] || "";
    }
    
    // Env validation
    if (mapping['env.carbon'] !== undefined) {
      const val = csvRow[mapping['env.carbon']];
      rowData.env.carbon = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.env.carbon)) {
        rowData.issues.carbon = "Carbon emissions must be numeric";
      } else if (rowData.env.carbon < 0) {
        rowData.issues.carbon = "Carbon emissions cannot be negative (" + rowData.env.carbon + " tCO2e)";
      }
    }
    if (mapping['env.energy'] !== undefined) {
      const val = csvRow[mapping['env.energy']];
      rowData.env.energy = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.env.energy)) {
        rowData.issues.energy = "Energy consumption must be numeric";
      } else if (rowData.env.energy < 0) {
        rowData.issues.energy = "Energy consumption cannot be negative (" + rowData.env.energy + " kWh)";
      }
    }
    if (mapping['env.water'] !== undefined) {
      const val = csvRow[mapping['env.water']];
      rowData.env.water = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.env.water)) {
        rowData.issues.water = "Water usage must be numeric";
      } else if (rowData.env.water < 0) {
        rowData.issues.water = "Water usage cannot be negative (" + rowData.env.water + " m3)";
      }
    }
    
    // Soc validation
    if (mapping['soc.employees'] !== undefined) {
      const val = csvRow[mapping['soc.employees']];
      rowData.soc.employees = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.soc.employees) || rowData.soc.employees < 0) {
        rowData.issues.employees = "Employees count must be a non-negative number";
      }
    }
    if (mapping['soc.training'] !== undefined) {
      const val = csvRow[mapping['soc.training']];
      rowData.soc.training = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.soc.training) || rowData.soc.training < 0) {
        rowData.issues.training = "Training hours must be a non-negative number";
      }
    }
    if (mapping['soc.incidents'] !== undefined) {
      const val = csvRow[mapping['soc.incidents']];
      rowData.soc.incidents = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.soc.incidents) || rowData.soc.incidents < 0) {
        rowData.issues.incidents = "Workplace incidents must be a non-negative number";
      }
    }
    if (mapping['soc.meetings'] !== undefined) {
      const val = csvRow[mapping['soc.meetings']];
      rowData.soc.meetings = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.soc.meetings) || rowData.soc.meetings < 0) {
        rowData.issues.meetings = "Board meetings must be a non-negative number";
      }
    }
    
    // Gov validation
    if (mapping['gov.compliance'] !== undefined) {
      const val = csvRow[mapping['gov.compliance']];
      rowData.gov.compliance = val !== '' ? Number(val) : 100;
      if (isNaN(rowData.gov.compliance)) {
        rowData.issues.compliance = "Compliance rate must be numeric";
      } else if (rowData.gov.compliance < 0 || rowData.gov.compliance > 100) {
        rowData.issues.compliance = "Compliance rate must be between 0% and 100% (" + rowData.gov.compliance + "%)";
      }
    }
    if (mapping['gov.audits'] !== undefined) {
      const val = csvRow[mapping['gov.audits']];
      rowData.gov.audits = val !== '' ? Number(val) : 0;
      if (isNaN(rowData.gov.audits) || rowData.gov.audits < 0) {
        rowData.issues.audits = "Audits count must be a non-negative number";
      }
    }
    
    rowData.isValid = Object.keys(rowData.issues).length === 0;
    return rowData;
  });

  // Render rows in the preview table
  const tbody = document.getElementById('import-preview-tbody');
  tbody.innerHTML = parsedSpreadsheetRows.map(row => {
    const carbonCellClass = row.issues.carbon ? "cell-error" : "cell-success-val";
    const carbonTooltip = row.issues.carbon ? `data-tooltip="${row.issues.carbon}"` : "";
    
    const energyCellClass = row.issues.energy ? "cell-error" : "cell-success-val";
    const energyTooltip = row.issues.energy ? `data-tooltip="${row.issues.energy}"` : "";
    
    const waterCellClass = row.issues.water ? "cell-error" : "cell-success-val";
    const waterTooltip = row.issues.water ? `data-tooltip="${row.issues.water}"` : "";
    
    const statusBadge = row.isValid ? 
      `<span class="badge badge-approved">Valid</span>` : 
      `<span class="badge badge-rejected">${Object.keys(row.issues).length} Issue(s) Found</span>`;

    return `
      <tr>
        <td><strong>Row #${row.rowId}</strong></td>
        <td>${row.department}</td>
        <td>${row.period}</td>
        <td class="${carbonCellClass}" ${carbonTooltip}>${(row.env.carbon || 0).toLocaleString()}</td>
        <td class="${energyCellClass}" ${energyTooltip}>${(row.env.energy || 0).toLocaleString()}</td>
        <td class="${waterCellClass}" ${waterTooltip}>${(row.env.water || 0).toLocaleString()}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');

  // Update Summary feedback card
  const summaryDiv = document.getElementById('import-validation-summary');
  const errorCount = parsedSpreadsheetRows.filter(r => !r.isValid).length;
  summaryDiv.className = "validation-feedback-card"; // reset classes
  
  if (errorCount > 0) {
    summaryDiv.classList.add('error');
    summaryDiv.innerHTML = `
      <div class="feedback-header">
        <i data-lucide="shield-alert"></i>
        <span>Data Validation Flagged ${errorCount} Row(s)</span>
      </div>
      <p>Your spreadsheet contains data errors that violate standard compliance limits. You can import anyway, but the records will be marked with issues in your workbench.</p>
    `;
  } else {
    summaryDiv.classList.add('success');
    summaryDiv.innerHTML = `
      <div class="feedback-header">
        <i data-lucide="shield-check"></i>
        <span>Data Validation Passed (${parsedSpreadsheetRows.length}/${parsedSpreadsheetRows.length} Rows Clean)</span>
      </div>
      <p>All mapped metrics conform to corporate ESG auditing regulations. This data is ready for final ingestion.</p>
    `;
  }

  // Show wrapper and enable Proceed button
  document.getElementById('import-preview-wrapper').classList.remove('hidden');
  document.getElementById('btn-import-confirm').disabled = false;

  lucide.createIcons();
}

function simulateSpreadsheetUploadData() {
  const newRecords = [];
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const startId = appState.records.length + 1;
  
  parsedSpreadsheetRows.forEach((row, index) => {
    const recId = "REC-" + String(startId + index).padStart(3, '0');
    const issuesList = Object.values(row.issues);
    
    const newRec = {
      id: recId,
      department: row.department,
      period: row.period,
      submittedOn: dateStr,
      status: "Pending",
      env: row.env,
      soc: row.soc,
      gov: row.gov,
      comments: row.comments || `Imported from CSV spreadsheet: ${selectedFile.name}`,
      issues: issuesList
    };
    
    newRecords.push(newRec);
    logActivity(recId, "Spreadsheet row imported", row.department, "Pending");
  });
  
  appState.records = appState.records.concat(newRecords);
  saveAppState();
  
  updateDashboardKPIs();
  renderValidationworkbench();
  renderRecentActivities();
}

function goBackToUpload() {
  document.getElementById('import-mapping-preview-container').classList.add('hidden');
  document.getElementById('import-upload-container').classList.remove('hidden');
  
  cancelUploadedFile();
  resetImportFlow();
}

function proceedToReviewConfirmStep() {
  document.getElementById('import-step-2').classList.remove('active');
  document.getElementById('import-step-2').classList.add('completed');
  document.getElementById('import-step-2').querySelector('.step-num').innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px;"></i>`;
  document.getElementById('import-step-3').classList.add('active');
  
  simulateSpreadsheetUploadData();
  
  alert("Import complete! Mapped and validated rows have been added to the validation workbench.");
  
  document.getElementById('import-mapping-preview-container').classList.add('hidden');
  document.getElementById('import-upload-container').classList.remove('hidden');
  
  resetImportFlow();
  closeEsgDataCollectionModal();
  switchTab('data-validation', 'Pending');
}
function downloadESGTemplate() {
  // Simulate template CSV creation
  const headers = "Record ID,Department,Reporting Period,Carbon Emissions (tCO2e),Energy Consumption (kWh),Water Usage (m3),Total Employees,Training Hours,Incidents,Meetings,Compliance,Audits,Comments\n";
  const row = ",Operations,Q1 2026,120.5,14500,210,95,300,0,4,98.5,1,Template submission\n";
  
  const blob = new Blob([headers + row], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'esg_platform_template.csv');
  a.click();
}


/* ================= MANUAL DATA ENTRY FORM ================= */
function clearManualForm() {
  document.getElementById('manual-entry-form').reset();
  const selectDept = document.getElementById('form-department');
  const selectPeriod = document.getElementById('form-period');
  if (selectDept) selectDept.selectedIndex = 0;
  if (selectPeriod) selectPeriod.selectedIndex = 0;
  clearManualEditingState();
  
  const feedbackCard = document.getElementById('manual-validation-feedback');
  if (feedbackCard) feedbackCard.classList.add('hidden');
}

function validateManualFormInputs() {
  const dept = document.getElementById('form-department').value;
  const period = document.getElementById('form-period').value;
  
  const feedbackCard = document.getElementById('manual-validation-feedback');
  if (!feedbackCard) return false;
  
  feedbackCard.classList.add('hidden');
  feedbackCard.className = "validation-feedback-card"; // Reset classes
  
  const issues = [];
  
  // Check required department & period
  if (!dept) issues.push("Department selection is required.");
  if (!period) issues.push("Reporting Period selection is required.");
  
  // Parse inputs
  const carbonVal = document.getElementById('env-carbon').value;
  const energyVal = document.getElementById('env-energy').value;
  const waterVal = document.getElementById('env-water').value;
  const employeesVal = document.getElementById('soc-employees').value;
  const trainingVal = document.getElementById('soc-training').value;
  const incidentsVal = document.getElementById('soc-incidents').value;
  const meetingsVal = document.getElementById('gov-meetings').value;
  const complianceVal = document.getElementById('gov-compliance').value;
  const auditsVal = document.getElementById('gov-audits').value;
  
  // Standard metric validation checks
  if (carbonVal !== "") {
    const carbon = parseFloat(carbonVal);
    if (isNaN(carbon)) issues.push("Carbon emissions must be a valid number.");
    else if (carbon < 0) issues.push("Carbon emissions cannot be negative.");
  } else {
    issues.push("Carbon emissions is a required field.");
  }
  
  if (energyVal !== "") {
    const energy = parseFloat(energyVal);
    if (isNaN(energy)) issues.push("Energy consumption must be a valid number.");
    else if (energy < 0) issues.push("Energy consumption cannot be negative.");
  } else {
    issues.push("Energy consumption is a required field.");
  }
  
  if (waterVal !== "") {
    const water = parseFloat(waterVal);
    if (isNaN(water)) issues.push("Water usage must be a valid number.");
    else if (water < 0) issues.push("Water usage cannot be negative.");
  } else {
    issues.push("Water usage is a required field.");
  }
  
  if (employeesVal !== "") {
    const employees = parseInt(employeesVal);
    if (isNaN(employees)) issues.push("Total employees must be a valid integer.");
    else if (employees <= 0) issues.push("Total employees must be greater than zero.");
  } else {
    issues.push("Total employees is a required field.");
  }
  
  if (trainingVal !== "") {
    const training = parseFloat(trainingVal);
    if (isNaN(training)) issues.push("Training hours must be a valid number.");
    else if (training < 0) issues.push("Training hours cannot be negative.");
  } else {
    issues.push("Training hours is a required field.");
  }
  
  if (incidentsVal !== "") {
    const incidents = parseInt(incidentsVal);
    if (isNaN(incidents)) issues.push("Incidents reported must be a valid integer.");
    else if (incidents < 0) issues.push("Incidents reported cannot be negative.");
  } else {
    issues.push("Incidents reported is a required field.");
  }
  
  if (meetingsVal !== "") {
    const meetings = parseInt(meetingsVal);
    if (isNaN(meetings)) issues.push("Board meetings held must be a valid integer.");
    else if (meetings < 0) issues.push("Board meetings held cannot be negative.");
  } else {
    issues.push("Board meetings held is a required field.");
  }
  
  if (complianceVal !== "") {
    const compliance = parseFloat(complianceVal);
    if (isNaN(compliance)) issues.push("Compliance rate must be a valid percentage.");
    else if (compliance < 0 || compliance > 100) issues.push("Compliance rate must be between 0% and 100%.");
  } else {
    issues.push("Compliance rate is a required field.");
  }
  
  if (auditsVal !== "") {
    const audits = parseInt(auditsVal);
    if (isNaN(audits)) issues.push("Audits completed must be a valid integer.");
    else if (audits < 0) issues.push("Audits completed cannot be negative.");
  } else {
    issues.push("Audits completed is a required field.");
  }
  
  if (issues.length > 0) {
    feedbackCard.classList.add('error');
    feedbackCard.innerHTML = `
      <div class="feedback-header">
        <i data-lucide="shield-alert"></i>
        <span>Validation Issues Found (${issues.length})</span>
      </div>
      <p>The form data violates ESG reporting standards. Please review the following error details:</p>
      <ul>
        ${issues.map(iss => `<li>${iss}</li>`).join('')}
      </ul>
    `;
  } else {
    feedbackCard.classList.add('success');
    feedbackCard.innerHTML = `
      <div class="feedback-header">
        <i data-lucide="shield-check"></i>
        <span>Data Validation Successful</span>
      </div>
      <p>All fields conform to corporate ESG auditing regulations. This record is ready for submission.</p>
    `;
  }
  
  feedbackCard.classList.remove('hidden');
  lucide.createIcons();
  
  return issues.length === 0;
}

function saveFormDraft() {
  const dept = document.getElementById('form-department').value;
  const period = document.getElementById('form-period').value;
  
  tempFormDraft = {
    department: dept,
    period: period,
    env: {
      carbon: parseFloat(document.getElementById('env-carbon').value) || 0,
      energy: parseFloat(document.getElementById('env-energy').value) || 0,
      water: parseFloat(document.getElementById('env-water').value) || 0,
    },
    soc: {
      employees: parseInt(document.getElementById('soc-employees').value) || 0,
      training: parseFloat(document.getElementById('soc-training').value) || 0,
      incidents: parseInt(document.getElementById('soc-incidents').value) || 0,
    },
    gov: {
      meetings: parseInt(document.getElementById('gov-meetings').value) || 0,
      compliance: parseFloat(document.getElementById('gov-compliance').value) || 0,
      audits: parseInt(document.getElementById('gov-audits').value) || 0,
    },
    comments: document.getElementById('form-comments').value
  };
  
  alert("Form draft saved in memory successfully!");
}

function getManualFormElements() {
  return {
    department: document.getElementById('form-department'),
    period: document.getElementById('form-period'),
    carbon: document.getElementById('env-carbon'),
    energy: document.getElementById('env-energy'),
    water: document.getElementById('env-water'),
    employees: document.getElementById('soc-employees'),
    training: document.getElementById('soc-training'),
    incidents: document.getElementById('soc-incidents'),
    meetings: document.getElementById('gov-meetings'),
    compliance: document.getElementById('gov-compliance'),
    audits: document.getElementById('gov-audits'),
    comments: document.getElementById('form-comments')
  };
}

function ensureSelectOption(selectElement, value) {
  if (!selectElement) return;
  const existingOption = Array.from(selectElement.options).find(option => option.value === value);
  if (!existingOption) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  }
  selectElement.value = value;
}

function fillManualEntryForm(record) {
  if (!record) return;

  const elements = getManualFormElements();
  ensureSelectOption(elements.department, record.department);
  ensureSelectOption(elements.period, record.period);
  elements.carbon.value = record.env?.carbon ?? '';
  elements.energy.value = record.env?.energy ?? '';
  elements.water.value = record.env?.water ?? '';
  elements.employees.value = record.soc?.employees ?? '';
  elements.training.value = record.soc?.training ?? '';
  elements.incidents.value = record.soc?.incidents ?? '';
  elements.meetings.value = record.gov?.meetings ?? '';
  elements.compliance.value = record.gov?.compliance ?? '';
  elements.audits.value = record.gov?.audits ?? '';
  elements.comments.value = record.comments || '';

  const banner = document.getElementById('manual-edit-banner');
  if (banner) {
    banner.textContent = `Editing ${record.id}. Changes will be resubmitted for validation.`;
    banner.classList.remove('hidden');
  }
}

function clearManualEditingState() {
  editingRecordId = null;
  const banner = document.getElementById('manual-edit-banner');
  if (banner) {
    banner.classList.add('hidden');
    banner.textContent = '';
  }
}

function editRecord(recordId) {
  const record = appState.records.find(rec => rec.id === recordId);
  if (!record) return;

  editingRecordId = recordId;
  fillManualEntryForm(record);
  switchTab('data-collection', 'manual');
}

function viewRecordDetails(recordId) {
  openEsgViewModal(recordId);
}

function revalidateRecord(recordId) {
  const record = appState.records.find(rec => rec.id === recordId);
  if (!record) return;

  selectedRecordForValidation = recordId;
  validationSearchQuery = recordId.toLowerCase();
  const searchInput = document.getElementById('validation-search');
  if (searchInput) searchInput.value = recordId;
  activeValidationTab = 'All';
  currentRecordPaginationPage = 1;
  switchTab('data-validation', 'All');

  setTimeout(() => {
    const row = document.getElementById(`row-${recordId}`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('inspection-target');
    }
    openRecordModal(recordId);
  }, 150);
}

/* openValidationConfirmModal is defined at the bottom of this file (enhanced version) */


function closeValidationConfirmModal() {
  const modal = document.getElementById('validation-confirm-modal');
  const reasonInput = document.getElementById('validation-reject-reason');
  if (modal) modal.classList.add('hidden');
  if (reasonInput) reasonInput.value = '';
  pendingValidationDecision = null;
}

function confirmValidationDecision() {
  if (!pendingValidationDecision) return;

  const { action, recordId } = pendingValidationDecision;
  if (action === 'approve') {
    approveRecord(recordId);
  } else {
    const reasonInput = document.getElementById('validation-reject-reason');
    rejectRecord(recordId, reasonInput ? reasonInput.value.trim() : '');
  }

  closeValidationConfirmModal();
  closeRecordModal();
}

function toggleReportGeneratorForm() {
  openReportGeneratorModal();
}

function submitManualData() {
  const dept = document.getElementById('form-department').value;
  const period = document.getElementById('form-period').value;
  
  if (!dept || !period) {
    alert("Please select a department and reporting period.");
    return;
  }
  
  const carbon = parseFloat(document.getElementById('env-carbon').value);
  const energy = parseFloat(document.getElementById('env-energy').value);
  const water = parseFloat(document.getElementById('env-water').value);
  
  const employees = parseInt(document.getElementById('soc-employees').value);
  const training = parseFloat(document.getElementById('soc-training').value);
  const incidents = parseInt(document.getElementById('soc-incidents').value);
  
  const meetings = parseInt(document.getElementById('gov-meetings').value);
  const compliance = parseFloat(document.getElementById('gov-compliance').value);
  const audits = parseInt(document.getElementById('gov-audits').value);
  
  const comments = document.getElementById('form-comments').value.trim();
  
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const issues = [];
  // Perform basic rules checks
  if (carbon < 0) issues.push("Invalid carbon value (cannot be negative)");
  if (compliance < 0 || compliance > 100) issues.push("Compliance rate must be between 0% and 100%");
  if (incidents < 0) issues.push("Incidents reported cannot be negative");
  if (training < 0) issues.push("Training hours cannot be negative");
  if (employees <= 0) issues.push("Total employees must be greater than zero");
  
  let recordId = editingRecordId;
  if (editingRecordId) {
    const existingRecord = appState.records.find(rec => rec.id === editingRecordId);
    if (!existingRecord) {
      alert("The record selected for editing could not be found.");
      return;
    }

    existingRecord.department = dept;
    existingRecord.period = period;
    existingRecord.submittedOn = dateStr;
    existingRecord.status = "Pending";
    existingRecord.env = { carbon, energy, water };
    existingRecord.soc = { employees, training, incidents };
    existingRecord.gov = { meetings, compliance, audits };
    existingRecord.comments = comments || "Manual form submission.";
    existingRecord.issues = issues;
    delete existingRecord.approvedDate;
    delete existingRecord.rejectionReason;
    recordId = existingRecord.id;
  } else {
    const newId = "REC-" + String(appState.records.length + 1).padStart(3, '0');
    appState.records.push({
      id: newId,
      department: dept,
      period: period,
      submittedOn: dateStr,
      status: "Pending",
      env: { carbon, energy, water },
      soc: { employees, training, incidents },
      gov: { meetings, compliance, audits },
      comments: comments || "Manual form submission.",
      issues: issues
    });
    recordId = newId;
  }
  
  logActivity(recordId, editingRecordId ? "Data resubmitted" : "Data submitted", dept, "Pending");
  
  saveAppState();
  
  // Update dashboard stats
  updateDashboardKPIs();
  renderRecentActivities();
  renderApprovedRecordsTable();
  renderValidationworkbench();
  
  // Alert success
  alert(`Record ${recordId} saved successfully! Redirecting to validation workbench.`);
  
  // Reset Form
  clearManualForm();
  
  // Close Modal
  closeEsgDataCollectionModal();
  
  // Transition to validation panel
  switchTab('data-validation', 'Pending');
}


/* ================= MY ESG DATA TABLE ================= */
/* ================= APPROVED RECORDS PAGINATION ================= */
window._approvedCurrentPage = 1;
window._approvedPageSize = 8;
window._approvedTotalPages = 1;
window._approvedFilteredRecords = [];

function renderApprovedRecordsTable() {
  const tbody = document.getElementById('approved-table-body');
  const emptyState = document.getElementById('approved-empty-state');
  const paginationBar = document.getElementById('approved-pagination');
  if (!tbody) return;

  const deptFilter = document.getElementById('esg-filter-dept') ? document.getElementById('esg-filter-dept').value : 'all';
  const statusFilter = document.getElementById('esg-filter-status') ? document.getElementById('esg-filter-status').value : 'all';

  let records = [...appState.records];
  if (deptFilter !== 'all') records = records.filter(r => r.department === deptFilter);
  if (statusFilter !== 'all') records = records.filter(r => r.status === statusFilter);

  window._approvedFilteredRecords = records;

  if (records.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    if (paginationBar) paginationBar.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  const pageSize = window._approvedPageSize;
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  window._approvedTotalPages = totalPages;
  // Clamp current page
  if (window._approvedCurrentPage > totalPages) window._approvedCurrentPage = totalPages;
  if (window._approvedCurrentPage < 1) window._approvedCurrentPage = 1;

  const start = (window._approvedCurrentPage - 1) * pageSize;
  const pageRecords = records.slice(start, start + pageSize);

  tbody.innerHTML = pageRecords.map(r => {
    let badgeClass = 'badge-pending';
    let displayStatus = r.status;
    if (r.status === 'Approved') badgeClass = 'badge-approved';
    if (r.status === 'Rejected') badgeClass = 'badge-rejected';
    if (r.status === 'Pending' && r.issues && r.issues.length > 0) {
      badgeClass = 'badge-rejected';
      displayStatus = 'Issues Found';
    }
    const displayDate = r.approvedDate || r.submittedOn || '—';
    return `
      <tr id="my-esg-row-${r.id}">
        <td class="font-mono">${r.id}</td>
        <td>${r.department}</td>
        <td>${r.period}</td>
        <td>${(r.env.carbon || 0).toLocaleString()}</td>
        <td>${(r.env.energy || 0).toLocaleString()}</td>
        <td>${(r.env.water || 0).toLocaleString()}</td>
        <td>${r.soc.employees || 0}</td>
        <td>${displayDate}</td>
        <td><span class="badge ${badgeClass}">${displayStatus}</span></td>
        <td>
          <div class="actions-cell esg-actions-cell">
            <button class="action-btn-sm btn-view-detail" onclick="openEsgViewModal('${r.id}')" title="View Details" aria-label="View Details">
              <i data-lucide="eye"></i><span class="action-btn-label">View</span>
            </button>
            <button class="action-btn-sm btn-revalidate" onclick="revalidateRecord('${r.id}')" title="Revalidate in Validation View" aria-label="Revalidate">
              <i data-lucide="shield-check"></i><span class="action-btn-label">Revalidate</span>
            </button>
            <button class="action-btn-sm btn-edit-rec" onclick="editRecord('${r.id}')" title="Edit and Resubmit" aria-label="Edit">
              <i data-lucide="pencil"></i><span class="action-btn-label">Edit</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Render pagination controls
  renderApprovedPagination(records.length, totalPages);
  lucide.createIcons();
}

function renderApprovedPagination(totalRecords, totalPages) {
  const bar = document.getElementById('approved-pagination');
  if (!bar) return;

  const cur = window._approvedCurrentPage;
  const pageSize = window._approvedPageSize;
  const start = (cur - 1) * pageSize + 1;
  const end = Math.min(cur * pageSize, totalRecords);

  if (totalRecords > pageSize) {
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
    return;
  }

  const infoEl = document.getElementById('approved-page-info');
  if (infoEl) infoEl.textContent = `Showing ${start}–${end} of ${totalRecords} records`;

  // Page number pills
  const pillsEl = document.getElementById('approved-page-pills');
  if (pillsEl) {
    let pills = '';
    const maxPills = 5;
    let startPage = Math.max(1, cur - Math.floor(maxPills / 2));
    let endPage = Math.min(totalPages, startPage + maxPills - 1);
    if (endPage - startPage < maxPills - 1) startPage = Math.max(1, endPage - maxPills + 1);

    if (startPage > 1) pills += `<button class="page-pill" onclick="goToApprovedPage(1)">1</button><span class="page-ellipsis">…</span>`;
    for (let p = startPage; p <= endPage; p++) {
      pills += `<button class="page-pill ${p === cur ? 'active' : ''}" onclick="goToApprovedPage(${p})">${p}</button>`;
    }
    if (endPage < totalPages) pills += `<span class="page-ellipsis">…</span><button class="page-pill" onclick="goToApprovedPage(${totalPages})">${totalPages}</button>`;
    pillsEl.innerHTML = pills;
  }

  // Arrow states
  const setDisabled = (id, val) => { const el = document.getElementById(id); if (el) el.disabled = val; };
  setDisabled('approved-first-btn', cur === 1);
  setDisabled('approved-prev-btn', cur === 1);
  setDisabled('approved-next-btn', cur === totalPages);
  setDisabled('approved-last-btn', cur === totalPages);
}

function goToApprovedPage(page) {
  const totalPages = window._approvedTotalPages || 1;
  page = Math.max(1, Math.min(page, totalPages));
  window._approvedCurrentPage = page;
  renderApprovedRecordsTable();
}

function changeApprovedPageSize(size) {
  window._approvedPageSize = parseInt(size, 10);
  window._approvedCurrentPage = 1;
  renderApprovedRecordsTable();
}

function filterApprovedTable() {
  window._approvedCurrentPage = 1;
  renderApprovedRecordsTable();
}


/* ================= ESG VIEW MODAL (My ESG Data) ================= */
function openEsgViewModal(recordId) {
  const r = appState.records.find(rec => rec.id === recordId);
  if (!r) return;

  // Populate header
  document.getElementById('esg-modal-title').textContent = `Record ${r.id} — Full Details`;
  document.getElementById('esg-modal-subtitle').textContent = `${r.department} · ${r.period} · Submitted ${r.submittedOn}`;

  // Meta fields
  document.getElementById('evm-record-id').textContent = r.id;
  document.getElementById('evm-department').textContent = r.department;
  document.getElementById('evm-period').textContent = r.period;
  document.getElementById('evm-submitted').textContent = r.submittedOn;
  document.getElementById('evm-approved-on').textContent = r.approvedDate || 'Pending approval';

  // Status badge
  const statusEl = document.getElementById('evm-status');
  statusEl.className = 'badge';
  statusEl.textContent = r.status;
  if (r.status === 'Approved') statusEl.classList.add('badge-approved');
  else if (r.status === 'Rejected') statusEl.classList.add('badge-rejected');
  else if (r.issues && r.issues.length > 0) {
    statusEl.textContent = 'Issues Found';
    statusEl.classList.add('badge-rejected');
  } else {
    statusEl.classList.add('badge-pending');
  }

  // Environmental
  document.getElementById('evm-carbon').innerHTML = `${(r.env.carbon || 0).toLocaleString()} tCO<sub>2</sub>e`;
  document.getElementById('evm-energy').textContent = `${(r.env.energy || 0).toLocaleString()} kWh`;
  document.getElementById('evm-water').textContent = `${(r.env.water || 0).toLocaleString()} m³`;

  // Social
  document.getElementById('evm-employees').textContent = `${(r.soc.employees || 0).toLocaleString()} Employees`;
  document.getElementById('evm-training').textContent = `${(r.soc.training || 0).toLocaleString()} Hours`;
  document.getElementById('evm-incidents').textContent = `${(r.soc.incidents || 0).toLocaleString()} Incidents`;

  // Governance
  document.getElementById('evm-meetings').textContent = `${(r.gov.meetings || 0).toLocaleString()} Meetings`;
  document.getElementById('evm-compliance').textContent = `${(r.gov.compliance || 0).toLocaleString()}%`;
  document.getElementById('evm-audits').textContent = `${(r.gov.audits || 0).toLocaleString()} Audit(s)`;

  // Comments
  document.getElementById('evm-comments').textContent = r.comments || 'No comments provided.';

  // Issues
  const issuesCont = document.getElementById('evm-issues-container');
  const issuesList = document.getElementById('evm-issues-list');
  if (r.issues && r.issues.length > 0) {
    issuesCont.classList.remove('hidden');
    issuesList.innerHTML = r.issues.map(iss => `<li>${iss}</li>`).join('');
  } else {
    issuesCont.classList.add('hidden');
  }

  // Footer action buttons (contextual)
  const actBtns = document.getElementById('evm-action-buttons');
  if (r.status === 'Pending') {
    actBtns.innerHTML = `
      <button class="btn btn-outline text-danger" onclick="closeEsgViewModal(); setTimeout(()=>revalidateRecord('${r.id}'),100);">
        <i data-lucide="shield-alert"></i> Go to Validation
      </button>
      <button class="btn btn-primary" onclick="closeEsgViewModal(); editRecord('${r.id}');">
        <i data-lucide="pencil"></i> Edit Record
      </button>
    `;
  } else if (r.status === 'Rejected') {
    actBtns.innerHTML = `
      <button class="btn btn-primary" onclick="closeEsgViewModal(); editRecord('${r.id}');">
        <i data-lucide="pencil"></i> Edit & Resubmit
      </button>
    `;
  } else {
    actBtns.innerHTML = `
      <button class="btn btn-outline" onclick="closeEsgViewModal(); revalidateRecord('${r.id}');">
        <i data-lucide="shield-check"></i> Revalidate
      </button>
    `;
  }

  document.getElementById('esg-view-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeEsgViewModal(event) {
  if (event && event.target !== document.getElementById('esg-view-modal')) return;
  document.getElementById('esg-view-modal').classList.add('hidden');
}

function exportApprovedCSV() {
  let approved = appState.records.filter(r => r.status === 'Approved');
  
  const headers = "Record ID,Department,Period,Carbon Emissions (tCO2e),Energy (kWh),Water (m3),Employees,Training (hrs),Incidents,Meetings,Compliance,Audits,Submitted On,Approved On\n";
  
  const rows = approved.map(r => {
    return `${r.id},${r.department},${r.period},${r.env.carbon},${r.env.energy},${r.env.water},${r.soc.employees},${r.soc.training},${r.soc.incidents},${r.gov.meetings},${r.gov.compliance},${r.gov.audits},${r.submittedOn},${r.approvedDate || '2026-06-04'}`;
  }).join('\n');
  
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'esg_approved_records.csv');
  a.click();
}


/* ================= DATA VALIDATION WORKBENCH ================= */
function switchValidationTableTab(tab) {
  activeValidationTab = tab;
  currentRecordPaginationPage = 1;
  
  // Highlight tab buttons
  const tabs = document.querySelectorAll('.validation-tabs-row .tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  
  const btnMap = {
    'Pending': 'val-tab-pending',
    'Approved': 'val-tab-approved',
    'Rejected': 'val-tab-rejected',
    'All': 'val-tab-all'
  };
  const activeBtn = document.getElementById(btnMap[tab]);
  if (activeBtn) activeBtn.classList.add('active');
  
  renderValidationworkbench();
}

function filterValidationTable() {
  validationSearchQuery = document.getElementById('validation-search').value.toLowerCase().trim();
  currentRecordPaginationPage = 1;
  renderValidationworkbench();
}

function toggleValidationFiltersMenu() {
  // Simple quick filter action toggler
  const depts = ["Operations", "HR", "Finance", "IT", "Procurement", "Facilities"];
  const select = prompt("Select a Department to filter by (or leave blank to clear):\n" + depts.join(', '));
  
  if (select === null) return;
  
  validationSearchQuery = select.toLowerCase().trim();
  document.getElementById('validation-search').value = select;
  currentRecordPaginationPage = 1;
  renderValidationworkbench();
}

function renderValidationworkbench() {
  const tbody = document.getElementById('validation-table-body');
  const emptyState = document.getElementById('validation-empty-state');
  if (!tbody) return;
  
  // Fetch from master list
  let filtered = appState.records;
  
  // 1. Filter by Tab
  if (activeValidationTab !== 'All') {
    filtered = filtered.filter(r => r.status === activeValidationTab);
  }
  
  // 2. Filter by search query
  if (validationSearchQuery !== "") {
    filtered = filtered.filter(r => 
      r.id.toLowerCase().includes(validationSearchQuery) || 
      r.department.toLowerCase().includes(validationSearchQuery) ||
      r.period.toLowerCase().includes(validationSearchQuery)
    );
  }
  
  // Update badges counts in headers
  updateValidationWorkbenchBadges();
  
  // Pagination counts
  const totalItems = filtered.length;
  
  if (totalItems === 0) {
    tbody.innerHTML = "";
    emptyState.classList.remove('hidden');
    document.querySelector('.pagination-container').classList.add('hidden');
    updateValidationSidebarLists();
    return;
  }
  
  emptyState.classList.add('hidden');
  document.querySelector('.pagination-container').classList.remove('hidden');
  
  const totalPages = Math.ceil(totalItems / recordsPerPage);
  if (currentRecordPaginationPage > totalPages) currentRecordPaginationPage = totalPages || 1;
  
  const startIndex = (currentRecordPaginationPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, totalItems);
  
  const pageItems = filtered.slice(startIndex, endIndex);
  
  tbody.innerHTML = pageItems.map(r => {
    let badgeClass = "badge-pending";
    if (r.status === 'Approved') badgeClass = "badge-approved";
    if (r.status === 'Rejected') badgeClass = "badge-rejected";
    
    // Identify warnings indicator (exclamation marker beside record name)
    const hasWarnings = r.issues && r.issues.length > 0;
    const warningText = hasWarnings ? 
      `<span class="text-warning font-weight-bold" style="cursor:help;" title="${r.issues.join('\n')}"><i data-lucide="alert-triangle" style="width: 14px; height: 14px; vertical-align: middle; display: inline-block; margin-left: 4px;"></i></span>` : "";
      
    const statusText = r.status === "Pending" && hasWarnings ? "Errors Found" : r.status;
    const finalBadgeClass = statusText === "Errors Found" ? "badge-rejected" : badgeClass;
    const isFocusedRecord = selectedRecordForValidation === r.id;
    
    return `
      <tr id="row-${r.id}" class="${isFocusedRecord ? 'inspection-target' : ''}">
        <td class="font-mono">${r.id} ${warningText}</td>
        <td>${r.department}</td>
        <td>${r.submittedOn}</td>
        <td><span class="badge ${finalBadgeClass}">${statusText}</span></td>
        <td>
          <div class="actions-cell">
            <button class="action-btn-sm" onclick="openRecordModal('${r.id}')" title="View details"><i data-lucide="eye"></i></button>
            ${r.status === 'Pending' ? `
              <button class="action-btn-sm btn-approve" onclick="openValidationConfirmModal('approve', '${r.id}')" title="Approve"><i data-lucide="check"></i></button>
              <button class="action-btn-sm btn-reject" onclick="openValidationConfirmModal('reject', '${r.id}')" title="Reject"><i data-lucide="x"></i></button>
            ` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Render pagination buttons and info
  document.getElementById('pagination-info-text').textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} entries`;
  renderPaginationControls(totalPages);
  
  // Sidebar alerts list
  updateValidationSidebarLists();

  if (selectedRecordForValidation) {
    const focusedRow = document.getElementById(`row-${selectedRecordForValidation}`);
    if (focusedRow) {
      focusedRow.classList.add('inspection-target');
      setTimeout(() => {
        focusedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }
  
  lucide.createIcons();
}

function updateValidationWorkbenchBadges() {
  const records = appState.records;
  
  const pendingCount = records.filter(r => r.status === 'Pending').length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;
  const rejectedCount = records.filter(r => r.status === 'Rejected').length;
  
  document.getElementById('tab-badge-pending').textContent = pendingCount;
  document.getElementById('tab-badge-approved').textContent = approvedCount;
  document.getElementById('tab-badge-rejected').textContent = rejectedCount;
  document.getElementById('tab-badge-all').textContent = records.length;
}

function updateValidationSidebarLists() {
  const records = appState.records;
  const pending = records.filter(r => r.status === 'Pending');
  
  const totalCount = records.length;
  const pendingCount = pending.length;
  const approvedCount = records.filter(r => r.status === 'Approved').length;
  const rejectedCount = records.filter(r => r.status === 'Rejected').length;
  
  // Warnings / Error counts
  const errors = [];
  const missing = [];
  
  pending.forEach(r => {
    if (r.issues) {
      r.issues.forEach(iss => {
        if (iss.toLowerCase().includes('error') || iss.toLowerCase().includes('invalid')) {
          errors.push({ id: r.id, text: iss });
        } else {
          missing.push({ id: r.id, text: iss });
        }
      });
    }
  });
  
  document.getElementById('val-sidebar-total').textContent = totalCount;
  document.getElementById('val-sidebar-pending').textContent = pendingCount;
  document.getElementById('val-sidebar-approved').textContent = approvedCount;
  document.getElementById('val-sidebar-rejected').textContent = rejectedCount;
  
  document.getElementById('val-sidebar-errors').textContent = errors.length;
  document.getElementById('val-sidebar-missing').textContent = missing.length;
  
  // Populate errors list
  const errorsListUl = document.getElementById('val-sidebar-errors-list');
  if (errors.length === 0) {
    errorsListUl.innerHTML = `<li style="cursor: default; color: var(--neutral-400);">No critical errors found</li>`;
  } else {
    errorsListUl.innerHTML = errors.slice(0, 3).map(err => {
      return `<li onclick="focusValidationRecord('${err.id}')"><strong>${err.id}:</strong> ${err.text}</li>`;
    }).join('');
  }
  
  // Populate alerts list
  const alertsListUl = document.getElementById('val-sidebar-alerts-list');
  if (missing.length === 0) {
    alertsListUl.innerHTML = `<li style="cursor: default; color: var(--neutral-400);">No omissions detected</li>`;
  } else {
    alertsListUl.innerHTML = missing.slice(0, 3).map(al => {
      return `<li onclick="focusValidationRecord('${al.id}')"><strong>${al.id}:</strong> ${al.text}</li>`;
    }).join('');
  }
}

function renderPaginationControls(totalPages) {
  const wrapper = document.getElementById('pagination-pages-wrapper');
  if (!wrapper) return;
  
  let html = `
    <button class="pagination-btn ${currentRecordPaginationPage === 1 ? 'disabled' : ''}" 
      onclick="changeValidationPage(${currentRecordPaginationPage - 1})" aria-label="Previous page">
      <i data-lucide="chevron-left"></i>
    </button>
  `;
  
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="pagination-btn ${currentRecordPaginationPage === i ? 'active' : ''}" 
        onclick="changeValidationPage(${i})">${i}</button>
    `;
  }
  
  html += `
    <button class="pagination-btn ${currentRecordPaginationPage === totalPages ? 'disabled' : ''}" 
      onclick="changeValidationPage(${currentRecordPaginationPage + 1})" aria-label="Next page">
      <i data-lucide="chevron-right"></i>
    </button>
  `;
  
  wrapper.innerHTML = html;
}

function changeValidationPage(page) {
  if (page < 1) return;
  // Calculate total items matching
  let filtered = appState.records;
  if (activeValidationTab !== 'All') {
    filtered = filtered.filter(r => r.status === activeValidationTab);
  }
  if (validationSearchQuery !== "") {
    filtered = filtered.filter(r => 
      r.id.toLowerCase().includes(validationSearchQuery) || 
      r.department.toLowerCase().includes(validationSearchQuery)
    );
  }
  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  
  if (page > totalPages) return;
  
  currentRecordPaginationPage = page;
  renderValidationworkbench();
}

function focusValidationRecord(recordId) {
  selectedRecordForValidation = recordId;
  validationSearchQuery = recordId.toLowerCase();
  document.getElementById('validation-search').value = recordId;
  currentRecordPaginationPage = 1;
  renderValidationworkbench();
  
  // Highlight row visually
  setTimeout(() => {
    const row = document.getElementById('row-' + recordId);
    if (row) {
      row.style.backgroundColor = "var(--primary-subtle)";
      setTimeout(() => {
        row.style.backgroundColor = "";
      }, 2000);
    }
  }, 100);
}

// Approve / Reject Table Actions
function approveRecord(recordId) {
  const record = appState.records.find(r => r.id === recordId);
  if (record) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    record.status = "Approved";
    record.approvedDate = dateStr;
    record.issues = []; // clear error notifications on approval
    delete record.rejectionReason;
    
    // Log Activity
    logActivity(recordId, "Data approved", record.department, "Approved");
    
    // Fire notifications update
    appState.notifications.unshift({
      id: Date.now(),
      type: "success",
      title: "Record Approved",
      text: `${recordId} for ${record.department} approved successfully.`,
      time: "Just now",
      unread: true
    });
    
    saveAppState();
    updateDashboardKPIs();
    renderApprovedRecordsTable();
    renderValidationworkbench();
    updateNotificationBadge();
    renderNotificationsList();
  }
}

function rejectRecord(recordId, reason = '') {
  const record = appState.records.find(r => r.id === recordId);
  if (record) {
    record.status = "Rejected";
    record.rejectionReason = reason || 'No rejection reason provided.';
    
    // Log Activity
    logActivity(recordId, "Data rejected", record.department, "Rejected");
    
    appState.notifications.unshift({
      id: Date.now(),
      type: "error",
      title: "Record Rejected",
      text: `${recordId} for ${record.department} rejected.${reason ? ` Reason: ${reason}` : ''}`,
      time: "Just now",
      unread: true
    });
    
    saveAppState();
    updateDashboardKPIs();
    renderValidationworkbench();
    updateNotificationBadge();
    renderNotificationsList();
  }
}

function saveValidationDraft() {
  alert("Validation workbook states saved successfully!");
}


/* ================= RECORD MODAL OPERATIONS ================= */
function openRecordModal(recordId) {
  const r = appState.records.find(rec => rec.id === recordId);
  if (!r) return;
  
  selectedRecordForModal = r;
  selectedRecordForValidation = recordId;
  
  document.getElementById('modal-record-title').textContent = `Record ${r.id} Details`;
  document.getElementById('md-record-id').textContent = r.id;
  document.getElementById('md-department').textContent = r.department;
  document.getElementById('md-period').textContent = r.period;
  document.getElementById('md-submitted-on').textContent = r.submittedOn;
  const approvedDateElement = document.getElementById('md-approved-on');
  if (approvedDateElement) {
    approvedDateElement.textContent = r.approvedDate || 'Pending approval';
  }
  
  // Status badging
  const statusSpan = document.getElementById('md-status');
  statusSpan.textContent = r.status;
  statusSpan.className = "badge"; // reset classes
  if (r.status === 'Approved') statusSpan.classList.add('badge-approved');
  else if (r.status === 'Rejected') statusSpan.classList.add('badge-rejected');
  else if (r.issues && r.issues.length > 0) {
    statusSpan.textContent = "Errors Found";
    statusSpan.classList.add('badge-rejected');
  } else statusSpan.classList.add('badge-pending');
  
  // Data values
  document.getElementById('md-env-carbon').innerHTML = `${r.env.carbon.toLocaleString()} tCO<sub>2</sub>e`;
  document.getElementById('md-env-energy').textContent = `${r.env.energy.toLocaleString()} kWh`;
  document.getElementById('md-env-water').textContent = `${r.env.water.toLocaleString()} m³`;
  
  document.getElementById('md-soc-employees').textContent = `${r.soc.employees.toLocaleString()} Employees`;
  document.getElementById('md-soc-training').textContent = `${r.soc.training.toLocaleString()} Hours`;
  document.getElementById('md-soc-incidents').textContent = `${r.soc.incidents.toLocaleString()} Incidents`;
  
  document.getElementById('md-gov-meetings').textContent = `${r.gov.meetings.toLocaleString()} Meetings`;
  document.getElementById('md-gov-compliance').textContent = `${r.gov.compliance.toLocaleString()} %`;
  document.getElementById('md-gov-audits').textContent = `${r.gov.audits.toLocaleString()} Audit`;
  
  document.getElementById('md-comments').textContent = r.comments || "No comments provided.";
  
  // Warnings container inside modal
  const alertContainer = document.getElementById('modal-alerts-container');
  const alertList = document.getElementById('modal-alerts-list');
  
  if (r.issues && r.issues.length > 0) {
    alertContainer.classList.remove('hidden');
    alertList.innerHTML = r.issues.map(iss => `<li>${iss}</li>`).join('');
  } else {
    alertContainer.classList.add('hidden');
  }
  
  // Show / hide modal actions based on status
  const actionsWrapper = document.getElementById('modal-actions-wrapper');
  if (r.status === 'Pending') {
    actionsWrapper.classList.remove('hidden');
  } else {
    actionsWrapper.classList.add('hidden');
  }
  
  // Show Modal backdrop
  document.getElementById('record-details-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeRecordModal() {
  document.getElementById('record-details-modal').classList.add('hidden');
  selectedRecordForModal = null;
}

function approveRecordFromModal() {
  if (selectedRecordForModal) {
    openValidationConfirmModal('approve', selectedRecordForModal.id);
  }
}

function rejectRecordFromModal() {
  if (selectedRecordForModal) {
    openValidationConfirmModal('reject', selectedRecordForModal.id);
  }
}


/* ================= REPORTS TAB GENERATOR ================= */
function handleReportScopeChange() {
  const scopeSelect = document.getElementById('rep-time-scope');
  const periodSelect = document.getElementById('rep-time-period');
  if (!scopeSelect || !periodSelect) return;
  
  const scope = scopeSelect.value;
  let html = "";
  
  if (scope === "Quarterly") {
    html = `
      <option value="Q1 2026">Q1 2026</option>
      <option value="Q2 2026">Q2 2026 (Draft)</option>
      <option value="Q4 2025">Q4 2025</option>
      <option value="Q3 2025">Q3 2025</option>
      <option value="Q2 2025">Q2 2025</option>
      <option value="Q1 2025">Q1 2025</option>
    `;
  } else if (scope === "Annual") {
    html = `
      <option value="FY 2026">FY 2026 (In Progress)</option>
      <option value="FY 2025">FY 2025 (Annual Report)</option>
      <option value="FY 2024">FY 2024 (Historical Archive)</option>
    `;
  } else {
    html = `
      <option value="Q1 2026">Q1 2026</option>
      <option value="Q2 2026">Q2 2026 (Draft)</option>
      <option value="Q4 2025">Q4 2025</option>
      <option value="Q3 2025">Q3 2025</option>
    `;
  }
  
  periodSelect.innerHTML = html;
}

function triggerGenerateReport() {
  const type = document.getElementById('rep-type').value;
  const format = document.getElementById('rep-format').value;
  const scope = document.getElementById('rep-time-scope').value;
  const period = document.getElementById('rep-time-period').value;
  const focusAreas = Array.from(document.querySelectorAll('input[name="focus-area"]:checked')).map(input => input.value);
  const approvedRecords = appState.records.filter(record => record.status === 'Approved');

  if (approvedRecords.length === 0) {
    showToast('No approved ESG records are available for report generation.', 'warning');
    return;
  }

  const cleanPeriod = period.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
  const today = new Date().toISOString().split('T')[0];
  const reportName = `ESG_${type}_Report_${cleanPeriod}_${today.replace(/-/g, '_')}`;
  const size = (Math.random() * (4.2 - 1.2) + 1.2).toFixed(1) + ' MB';

  const generatedReport = {
    id: `REP-${today.replace(/-/g, '')}-${String(Date.now()).slice(-4)}`,
    name: reportName,
    dateGenerated: today,
    reportType: `${type} (${scope})`,
    format,
    size,
    approvedCount: approvedRecords.length,
    focusAreas,
    downloadContent: [
      `Report Name: ${reportName}`,
      `Generated: ${today}`,
      `Type: ${type}`,
      `Scope: ${scope}`,
      `Format: ${format}`,
      `Reporting Period: ${period}`,
      `Approved Records Included: ${approvedRecords.length}`,
      `Focus Areas: ${focusAreas.join(', ') || 'None'}`
    ].join('\n')
  };

  if (!Array.isArray(appState.reportArchives)) {
    appState.reportArchives = [];
  }
  appState.reportArchives.unshift(generatedReport);

  appState.recentActivities.unshift({
    id: generatedReport.id,
    action: `Report generated (${cleanPeriod} / ${scope})`,
    dept: 'All',
    time: 'Just now',
    status: 'Done'
  });

  appState.notifications.unshift({
    id: Date.now(),
    type: 'success',
    title: 'Report Generated',
    text: `${reportName} compiled from ${approvedRecords.length} approved ESG records.`,
    time: 'Just now',
    unread: true
  });

  saveAppState();
  updateDashboardKPIs();
  renderRecentActivities();
  renderReportArchives();
  updateNotificationBadge();
  renderNotificationsList();

  // Close the generator modal
  closeReportGeneratorModal();

  lucide.createIcons();
  showToast(`Report "${reportName}" generated successfully and added to the archive!`, 'success');
}

function renderReportArchives() {
  const tbody = document.getElementById('report-archives-body');
  if (!tbody) return;

  const archives = Array.isArray(appState.reportArchives) ? appState.reportArchives : [];
  if (archives.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state-row">No reports have been generated yet. Click "Generate New Report" to create one.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = archives.map(report => {
    let formatBadge = 'badge-approved';
    if (report.format === 'PDF') formatBadge = 'badge-pdf';
    else if (report.format === 'Excel') formatBadge = 'badge-success';
    else if (report.format === 'CSV') formatBadge = 'badge-pending';
    return `
      <tr>
        <td><strong>${report.name}</strong></td>
        <td>${report.dateGenerated}</td>
        <td>${report.reportType}</td>
        <td><span class="badge ${formatBadge}">${report.format}</span></td>
        <td>${report.size}</td>
        <td>
          <div class="actions-cell" style="gap:0.4rem;">
            <button class="btn btn-outline btn-sm" onclick="downloadReportArchive('${report.id}')">
              <i data-lucide="download"></i> Download
            </button>
            <button class="btn btn-primary btn-sm" onclick="openShareReportModal('${report.id}')">
              <i data-lucide="share-2"></i> Share
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

/* ================= REPORT DOWNLOAD — PROPER FORMATTED TEMPLATES ================= */
function downloadReportArchive(reportId) {
  const report = (appState.reportArchives || []).find(item => item.id === reportId);
  if (!report) return;
  _triggerFormattedDownload(report, report.format);
  showToast(`Downloading "${report.name}" as ${report.format}...`, 'success');
}

function _triggerFormattedDownload(report, format) {
  if (format === 'PDF') {
    _downloadPDFReport(report);
  } else if (format === 'CSV') {
    _downloadCSVReport(report);
  } else if (format === 'Excel') {
    _downloadExcelReport(report);
  } else {
    _downloadCSVReport(report);
  }
}

function _buildReportData(report) {
  const approvedRecords = appState.records.filter(r => r.status === 'Approved');
  const totalCarbon = approvedRecords.reduce((s, r) => s + (r.env?.carbon || 0), 0);
  const totalEnergy = approvedRecords.reduce((s, r) => s + (r.env?.energy || 0), 0);
  const totalWater = approvedRecords.reduce((s, r) => s + (r.env?.water || 0), 0);
  const totalEmployees = approvedRecords.reduce((s, r) => s + (r.soc?.employees || 0), 0);
  return { approvedRecords, totalCarbon, totalEnergy, totalWater, totalEmployees };
}

function _downloadCSVReport(report) {
  const { approvedRecords, totalCarbon, totalEnergy, totalWater, totalEmployees } = _buildReportData(report);
  const today = new Date().toISOString().split('T')[0];

  const header = [
    '# ESG PLATFORM — OFFICIAL REPORT',
    `# Report Name: ${report.name}`,
    `# Report Type: ${report.reportType}`,
    `# Date Generated: ${report.dateGenerated}`,
    `# Downloaded On: ${today}`,
    `# Total Approved Records: ${approvedRecords.length}`,
    '',
    '## SUMMARY TOTALS',
    `Total Carbon Emissions (tCO2e),${totalCarbon.toFixed(1)}`,
    `Total Energy Consumption (kWh),${totalEnergy.toFixed(0)}`,
    `Total Water Usage (m3),${totalWater.toFixed(1)}`,
    `Total Employees Reported,${totalEmployees}`,
    '',
    '## DETAILED RECORDS',
    'Record ID,Department,Period,Submitted On,Status,Carbon (tCO2e),Energy (kWh),Water (m3),Employees,Training (hrs),Incidents,Board Meetings,Compliance (%),Audits'
  ].join('\n');

  const rows = approvedRecords.map(r =>
    [
      r.id, r.department, r.period, r.submittedOn, r.status,
      (r.env?.carbon || 0).toFixed(1),
      (r.env?.energy || 0).toFixed(0),
      (r.env?.water || 0).toFixed(1),
      r.soc?.employees || 0,
      r.soc?.training || 0,
      r.soc?.incidents || 0,
      r.gov?.meetings || 0,
      r.gov?.compliance || 0,
      r.gov?.audits || 0
    ].join(',')
  ).join('\n');

  const content = header + '\n' + rows;
  _downloadBlob(content, `${report.name}.csv`, 'text/csv;charset=utf-8;');
}

function _downloadExcelReport(report) {
  // Build a multi-sheet HTML workbook that Excel can open
  const { approvedRecords, totalCarbon, totalEnergy, totalWater, totalEmployees } = _buildReportData(report);
  const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });

  const summaryRows = `
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Report Name</td><td>${report.name}</td></tr>
    <tr><td>Report Type</td><td>${report.reportType}</td></tr>
    <tr><td>Date Generated</td><td>${report.dateGenerated}</td></tr>
    <tr><td>Downloaded On</td><td>${today}</td></tr>
    <tr><td>Total Approved Records</td><td>${approvedRecords.length}</td></tr>
    <tr><td>&nbsp;</td><td></td></tr>
    <tr style="background:#e8f4fd"><th>ESG Totals</th><th></th></tr>
    <tr><td>Total Carbon Emissions (tCO2e)</td><td>${totalCarbon.toFixed(1)}</td></tr>
    <tr><td>Total Energy Consumption (kWh)</td><td>${totalEnergy.toFixed(0)}</td></tr>
    <tr><td>Total Water Usage (m3)</td><td>${totalWater.toFixed(1)}</td></tr>
    <tr><td>Total Employees Reported</td><td>${totalEmployees}</td></tr>
  `;

  const detailHeader = `<tr style="background:#1e3a5f;color:white;">
    <th>Record ID</th><th>Department</th><th>Period</th><th>Submitted On</th><th>Status</th>
    <th>Carbon (tCO2e)</th><th>Energy (kWh)</th><th>Water (m3)</th>
    <th>Employees</th><th>Training (hrs)</th><th>Incidents</th>
    <th>Board Meetings</th><th>Compliance (%)</th><th>Audits</th>
  </tr>`;

  const detailRows = approvedRecords.map((r, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f0f4f8'}">
      <td>${r.id}</td><td>${r.department}</td><td>${r.period}</td><td>${r.submittedOn}</td><td>${r.status}</td>
      <td>${(r.env?.carbon || 0).toFixed(1)}</td><td>${(r.env?.energy || 0).toFixed(0)}</td><td>${(r.env?.water || 0).toFixed(1)}</td>
      <td>${r.soc?.employees || 0}</td><td>${r.soc?.training || 0}</td><td>${r.soc?.incidents || 0}</td>
      <td>${r.gov?.meetings || 0}</td><td>${r.gov?.compliance || 0}</td><td>${r.gov?.audits || 0}</td>
    </tr>`).join('');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="UTF-8"><style>table{border-collapse:collapse;}th,td{border:1px solid #ccc;padding:6px 10px;font-family:Calibri,sans-serif;font-size:11pt;}th{font-weight:bold;}</style></head>
  <body>
    <h2 style="font-family:Calibri;color:#1e3a5f;">ESG Platform — ${report.name}</h2>
    <h3 style="font-family:Calibri;color:#555;">Executive Summary</h3>
    <table>${summaryRows}</table>
    <br/>
    <h3 style="font-family:Calibri;color:#1e3a5f;">Detailed ESG Records</h3>
    <table>${detailHeader}${detailRows}</table>
  </body></html>`;

  _downloadBlob(html, `${report.name}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
}

function _downloadPDFReport(report) {
  const { approvedRecords, totalCarbon, totalEnergy, totalWater, totalEmployees } = _buildReportData(report);
  const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });

  const detailRows = approvedRecords.map((r, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#f5f8ff'};">
      <td>${r.id}</td><td>${r.department}</td><td>${r.period}</td>
      <td>${(r.env?.carbon || 0).toFixed(1)}</td><td>${(r.env?.energy || 0).toFixed(0)}</td>
      <td>${(r.env?.water || 0).toFixed(1)}</td><td>${r.soc?.employees || 0}</td><td>${r.status}</td>
    </tr>`).join('');

  const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${report.name} — ESG Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; background: #fff; padding: 0; }
    @page { size: A4; margin: 20mm 15mm; }
    .cover { background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%); color: white; padding: 60px 50px; }
    .cover h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .cover h2 { font-size: 1.1rem; font-weight: 400; opacity: 0.85; margin-bottom: 2rem; }
    .cover .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; }
    .cover .meta-item { background: rgba(255,255,255,0.12); border-radius: 8px; padding: 14px 18px; }
    .cover .meta-item label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.7; }
    .cover .meta-item p { font-size: 1rem; font-weight: 600; margin-top: 4px; }
    .section { padding: 30px 50px; }
    .section h3 { font-size: 1.1rem; font-weight: 700; color: #1e3a5f; border-bottom: 2px solid #2d6a9f; padding-bottom: 6px; margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.05em; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
    .kpi-card { border: 1px solid #e0e7f0; border-radius: 8px; padding: 16px 14px; text-align: center; }
    .kpi-card .kpi-val { font-size: 1.6rem; font-weight: 700; color: #1e3a5f; }
    .kpi-card .kpi-label { font-size: 0.75rem; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    thead tr { background: #1e3a5f; color: white; }
    thead th { padding: 9px 10px; text-align: left; font-weight: 600; }
    tbody td { padding: 7px 10px; border-bottom: 1px solid #e0e7ef; }
    .footer { background: #f0f4f8; padding: 16px 50px; font-size: 0.75rem; color: #888; display: flex; justify-content: space-between; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; }
    .badge-approved { background:#d1fae5; color:#065f46; }
    .badge-pending { background:#fef3c7; color:#92400e; }
    .badge-rejected { background:#fee2e2; color:#991b1b; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${report.name.replace(/_/g, ' ')}</h1>
    <h2>Environmental, Social & Governance Report</h2>
    <div class="meta">
      <div class="meta-item"><label>Report Type</label><p>${report.reportType}</p></div>
      <div class="meta-item"><label>Date Generated</label><p>${report.dateGenerated}</p></div>
      <div class="meta-item"><label>Records Included</label><p>${approvedRecords.length} Approved</p></div>
      <div class="meta-item"><label>Downloaded On</label><p>${today}</p></div>
    </div>
  </div>

  <div class="section">
    <h3>Key Performance Indicators</h3>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-val">${totalCarbon.toFixed(0)}</div><div class="kpi-label">Carbon (tCO2e)</div></div>
      <div class="kpi-card"><div class="kpi-val">${(totalEnergy/1000).toFixed(0)}K</div><div class="kpi-label">Energy (kWh)</div></div>
      <div class="kpi-card"><div class="kpi-val">${totalWater.toFixed(0)}</div><div class="kpi-label">Water (m3)</div></div>
      <div class="kpi-card"><div class="kpi-val">${totalEmployees.toLocaleString()}</div><div class="kpi-label">Employees</div></div>
    </div>
  </div>

  <div class="section">
    <h3>Approved ESG Records — ${today}</h3>
    <table>
      <thead><tr>
        <th>ID</th><th>Department</th><th>Period</th>
        <th>Carbon (tCO2e)</th><th>Energy (kWh)</th><th>Water (m3)</th>
        <th>Employees</th><th>Status</th>
      </tr></thead>
      <tbody>${detailRows}</tbody>
    </table>
  </div>

  <div class="footer">
    <span>ESG Platform — Confidential</span>
    <span>Report ID: ${report.id} &nbsp;|&nbsp; Generated: ${report.dateGenerated}</span>
  </div>

  <script>window.onload = function() { window.print(); };<\/script>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(printHtml);
    win.document.close();
  } else {
    // Fallback: download as HTML
    _downloadBlob(printHtml, `${report.name}_report.html`, 'text/html;charset=utf-8;');
  }
}

function _downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/* ================= SHARE REPORT MODAL ================= */
let _currentShareReportId = null;

function openShareReportModal(reportId) {
  const report = (appState.reportArchives || []).find(r => r.id === reportId);
  if (!report) return;
  _currentShareReportId = reportId;

  document.getElementById('share-preview-name').textContent = report.name.replace(/_/g, ' ');
  document.getElementById('share-preview-meta').textContent = `${report.reportType} · ${report.format} · ${report.dateGenerated}`;

  // Generate a shareable link (simulated — in a real app this would be a server URL)
  const shareLink = `${window.location.origin}${window.location.pathname}?report=${encodeURIComponent(reportId)}&shared=1`;
  const linkInput = document.getElementById('share-link-input');
  if (linkInput) linkInput.value = shareLink;

  // Clear email field
  const emailInput = document.getElementById('share-email-input');
  if (emailInput) emailInput.value = '';

  document.getElementById('share-report-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeShareReportModal() {
  document.getElementById('share-report-modal').classList.add('hidden');
  _currentShareReportId = null;
}

function copyShareLink() {
  const input = document.getElementById('share-link-input');
  if (!input) return;
  navigator.clipboard.writeText(input.value).then(() => {
    const btn = document.getElementById('copy-link-btn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="check"></i> Copied!';
      btn.style.background = 'var(--accent-success, #16a34a)';
      lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="copy"></i> Copy';
        btn.style.background = '';
        lucide.createIcons();
      }, 2000);
    }
    showToast('Link copied to clipboard!', 'success');
  }).catch(() => {
    input.select();
    document.execCommand('copy');
    showToast('Link copied!', 'success');
  });
}

function sendReportByEmail() {
  const emailInput = document.getElementById('share-email-input');
  const email = emailInput ? emailInput.value.trim() : '';
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }
  const report = (appState.reportArchives || []).find(r => r.id === _currentShareReportId);
  const reportName = report ? report.name.replace(/_/g, ' ') : 'ESG Report';
  const shareLink = document.getElementById('share-link-input')?.value || '';

  // Use mailto as the sharing mechanism
  const subject = encodeURIComponent(`Shared ESG Report: ${reportName}`);
  const body = encodeURIComponent(`Hi,\n\nI'm sharing the following ESG report with you:\n\nReport: ${reportName}\nLink: ${shareLink}\n\nThis report was generated from the ESG Platform.\n\nBest regards`);
  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  showToast(`Email client opened for ${email}`, 'success');
}

function downloadSharedReport(format) {
  if (!_currentShareReportId) return;
  const report = (appState.reportArchives || []).find(r => r.id === _currentShareReportId);
  if (!report) return;
  _triggerFormattedDownload(report, format);
  showToast(`Downloading as ${format}...`, 'success');
}

/* ================= SETTINGS & THEMING ================= */
function saveSettings() {
  const fullname = document.getElementById('set-fullname').value.trim();
  const email = document.getElementById('set-email').value.trim();

  if (fullname === '') {
    showToast('Full Name cannot be blank.', 'error');
    return;
  }

  appState.currentUser.fullname = fullname;
  appState.currentUser.email = email;
  appState.currentUser.initials = fullname.split(' ').map(n => n[0]).join('').toUpperCase();

  saveAppState();
  updateProfileDetailsUI();
  showToast('Settings saved successfully!', 'success');
}

function toggleDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  localStorage.setItem(CONFIG.DARK_MODE_KEY, String(enabled));
  updateDashboardCharts();
}

function toggleColorblindModeBtn() {
  const isActive = document.body.classList.toggle('colorblind');
  const checkbox = document.getElementById('set-colorblind-mode');
  if (checkbox) checkbox.checked = isActive;
}

function toggleColorblindMode(enabled) {
  if (enabled) {
    document.body.classList.add('colorblind');
  } else {
    document.body.classList.remove('colorblind');
  }
}


/* ================= TOAST NOTIFICATION SYSTEM ================= */
function showToast(message, type = 'success') {
  // Remove existing toast if present
  const existing = document.getElementById('app-toast');
  if (existing) existing.remove();

  const iconMap = {
    success: 'check-circle-2',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'info'
  };
  const colorMap = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  const toast = document.createElement('div');
  toast.id = 'app-toast';
  toast.setAttribute('role', 'alert');
  toast.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-left: 4px solid ${colorMap[type] || colorMap.success};
    border-radius: 10px;
    padding: 1rem 1.25rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    max-width: 420px;
    min-width: 280px;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    color: var(--neutral-700);
    animation: toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" style="color:${colorMap[type]};width:20px;height:20px;flex-shrink:0;"></i>
    <span style="flex:1;line-height:1.4;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--neutral-400);cursor:pointer;padding:0;margin-left:0.5rem;" aria-label="Dismiss">
      <i data-lucide="x" style="width:16px;height:16px;"></i>
    </button>
  `;

  // Add animation keyframe if not present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(100%) scale(0.9); }
        to   { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes toastSlideOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to   { opacity: 0; transform: translateX(100%) scale(0.9); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  lucide.createIcons();

  // Auto-dismiss
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'toastSlideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}


/* ================= VALIDATION CONFIRM MODAL ENHANCEMENTS ================= */
function openValidationConfirmModal(action, recordId) {
  const record = appState.records.find(rec => rec.id === recordId);
  if (!record) return;

  pendingValidationDecision = { action, recordId };
  const modal = document.getElementById('validation-confirm-modal');
  const title = document.getElementById('validation-confirm-title');
  const message = document.getElementById('validation-confirm-message');
  const reasonWrap = document.getElementById('validation-confirm-reason-wrap');
  const reasonInput = document.getElementById('validation-reject-reason');
  const confirmButton = document.getElementById('validation-confirm-button');
  const iconWrap = document.getElementById('validation-confirm-icon-wrap');

  if (action === 'approve') {
    title.textContent = 'Confirm Approval';
    message.innerHTML = `<strong>Are you sure you want to approve this ESG record?</strong><br><span style="color:var(--neutral-500);font-size:0.875rem;">This will mark the record as officially approved and update all KPI counters.</span>`;
    reasonWrap.classList.add('hidden');
    if (reasonInput) reasonInput.value = '';
    confirmButton.textContent = 'Confirm Approve';
    confirmButton.className = 'btn btn-primary';
    if (iconWrap) {
      iconWrap.className = 'confirm-icon-wrap confirm-icon-approve';
    }
  } else {
    title.textContent = 'Confirm Rejection';
    message.innerHTML = `<strong>Are you sure you want to reject this ESG record?</strong><br><span style="color:var(--neutral-500);font-size:0.875rem;">The record will be marked as Rejected. You may optionally provide a reason below.</span>`;
    reasonWrap.classList.remove('hidden');
    confirmButton.textContent = 'Confirm Reject';
    confirmButton.className = 'btn btn-outline text-danger';
    if (iconWrap) {
      iconWrap.className = 'confirm-icon-wrap confirm-icon-reject';
    }
  }

  document.getElementById('validation-confirm-record-id').textContent = record.id;
  modal.classList.remove('hidden');
  lucide.createIcons();
}