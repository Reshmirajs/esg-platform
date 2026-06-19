# ESG Platform

A fully functional, visually premium client-side Single Page Application (SPA) designed for ESG data collection, carbon footprint auditing, and compliance validation.

---

## How to Run in Visual Studio Code

Follow these simple steps to load and run the ESG Platform project inside Visual Studio Code (VS Code):

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (which includes `npm`).

---

### Step-by-Step Instructions

### 1. Open the Project Folder in VS Code
1. Launch **Visual Studio Code**.
2. Click **File** &rarr; **Open Folder...** (or press `Ctrl + K` then `Ctrl + O`).
3. Select the project directory:  
   `C:\Users\Reshmi Raj\Desktop\Internship\UI`
4. Click **Select Folder**.

### 2. Open the VS Code Integrated Terminal
1. Open the terminal panel by pressing `Ctrl + ` ` ` (backtick) or going to **Terminal** &rarr; **New Terminal** in the top menu bar.

### 3. Install Project Dependencies
Run the following command in the terminal to ensure Vite (the development server) is installed:
```bash
npm install
```
*(This creates the `node_modules` folder based on the configurations inside `package.json`.)*

### 4. Start the Local Development Server
Launch the development server by running:
```bash
npm run dev
```

### 5. Open in Web Browser
Once Vite starts, it will display a local address:
```text
  ➜  Local:   http://localhost:5173/
```
- Hold `Ctrl` and click the link **`http://localhost:5173/`** directly in the VS Code terminal, or copy and paste it into your web browser.

---

## Project Scripts Overview

Available scripts defined in [package.json](package.json):

- **`npm run dev`** &mdash; Starts the local dev server at `http://localhost:5173/` with hot module replacement.
- **`npm run build`** &mdash; Compiles and builds production assets into a static `dist` bundle folder.
- **`npm run preview`** &mdash; Serves the built production bundle locally to verify build outputs.

---

## ESG Request Workflow

The platform supports collecting ESG data from external stakeholders:

1. Open **My ESG Data** and click **Request New Data**
2. Click **Send ESG Request** and fill in recipient details
3. A unique request ID is generated (e.g. `REQ-001`) with a shareable form link (`/submit-esg/REQ-001`)
4. A simulated email is sent with greeting, reporting period, deadline, and form link
5. Track request status in the workflow modal and send **Remind** for pending submissions

### External Submission Form

Recipients open the shared link to complete:

- Environmental, Social, and Governance metrics
- Optional comments and file attachment
- **Save Draft** or **Submit ESG Data**

Submitted records appear in **My ESG Data** and **Data Validation** for review.
