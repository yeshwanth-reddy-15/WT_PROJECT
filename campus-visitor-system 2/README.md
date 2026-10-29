# CVR College of Engineering &mdash; Campus Visitor Registration & Approval System

A professional, understated, and highly functional frontend system tailored specifically for **CVR College of Engineering (Autonomous, Affiliated to JNTUH, NAAC 'A' Grade, NBA Tier-1 Accredited)**, Vastunagar, Mangalpalli (V), Ibrahimpatnam (M), Rangareddy District, Telangana – 501510.

Built strictly with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** with zero external frameworks or dependencies.

---

## 1. Institutional Context & Campus Overview

- **Institution:** CVR College of Engineering
- **Management:** Promoted by Cherabuddi Education Society (Estd. 2001)
- **Status:** UGC Autonomous Institution, Affiliated to JNTUH, Accredited by NAAC with 'A' Grade
- **Campus:** 33-acre campus at Vastunagar, Mangalpalli (V), Ibrahimpatnam (M), Rangareddy Dist, Telangana – 501510
- **City Office:** Units #201 & 202, Ashoka Scintilla, Opp. KFC, Himayatnagar, Hyderabad – 500029
- **Access Checkpoint:** Gate 1 (Vastunagar Main Campus Entrance) &bull; 24/7 Security Desk: 08414-661601 (Ext: 104)
- **Official Website:** [https://cvr.ac.in](https://cvr.ac.in)

---

## 2. Directory & File Structure

```
campus-visitor-system/
├── index.html                  # CVR Public Campus Portal & Visitor Guidelines
├── register.html               # Public Visitor Registration Form (CVR Departments)
├── status.html                 # Secure Two-Factor Clearance Status (CVR-2026-XXXX)
├── login.html                  # CVR Staff & Gate 1 Security Checkpoint Authentication
├── admin-dashboard.html        # Departmental Clearance & Administrative Console
├── security-dashboard.html     # Gate 1 (Vastunagar) Checkpoint Console (Check-In/Out)
├── README.md                   # System documentation, testing guide, and MySQL schema
├── css/
│   ├── styles.css              # Global variables, typography, modals, buttons, alerts, toasts
│   ├── forms.css               # Responsive two-column forms, validation UI, password toggles
│   └── dashboard.css           # Sidebar layout, topbar, metric cards, tables, filter toolbars
├── js/
│   ├── common.js               # Mock data store (VisitorDataService), CVR departments, toasts
│   ├── registration.js         # Real-time form validation, min-date, modal feedback
│   ├── status.js               # Two-factor verification lookup & state-specific instructions
│   ├── login.js                # Role-based credential verification & session management
│   ├── admin-dashboard.js      # Dynamic tables, multi-filter queries, approve/decline modals
│   └── security-dashboard.js   # Gatehouse operations, timestamp check-in/out, pass issuance
└── assets/
    ├── icons/
    │   └── favicon.svg         # CVR College crest favicon
    └── images/
        └── campus-seal.svg     # CVR College of Engineering vector seal
```

---

## 3. Academic Departments & Buildings Supported

The system is configured with official CVR academic wings and departments:
1. **Computer Science & Engineering (CSE)** &bull; Main Computing Block
2. **Electronics & Communication Engineering (ECE)** &bull; Vishveshwarya Block
3. **Electrical & Electronics Engineering (EEE)** &bull; Ramanujan Block
4. **Information Technology (IT)** &bull; Tech Complex
5. **Artificial Intelligence & Machine Learning (AI & ML)** &bull; Innovation Wing
6. **Mechanical Engineering (ME)** &bull; Workshop & Mechanical Block
7. **Civil Engineering (CE)** &bull; Infrastructure Block
8. **Humanities & Sciences (H&S)** &bull; Basic Sciences Wing
9. **Training & Placement Cell (T&P)** &bull; Central Placement Pavilion
10. **Administrative Office & Examination Branch** &bull; Main Admin Block

---

## 4. Built-In Prototype Demonstration Accounts

For reviewer evaluation, authentic demonstration profiles are pre-configured:

| Role | Username / Email | Password | Console |
|---|---|---|---|
| **Administrative Officer (AO)** | `admin@cvr.ac.in` | `admin123` | [`admin-dashboard.html`](file:///Users/cholletiyashwanthreddy/.gemini/antigravity/scratch/campus-visitor-system/admin-dashboard.html) |
| **Gate 1 Security Officer** | `security@cvr.ac.in` | `guard123` | [`security-dashboard.html`](file:///Users/cholletiyashwanthreddy/.gemini/antigravity/scratch/campus-visitor-system/security-dashboard.html) |

---

## 5. Planned MySQL Database Schema

```sql
-- 1. CVR College Departments Reference Table
CREATE TABLE cvr_departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    block_location VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CVR Visitor Requests Table
CREATE TABLE cvr_visitor_requests (
    id VARCHAR(30) PRIMARY KEY, -- e.g. 'CVR-2026-8491'
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    person_to_meet VARCHAR(150) NOT NULL,
    purpose TEXT NOT NULL,
    visit_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'On-Campus', 'Completed') DEFAULT 'Pending',
    approval_note TEXT NULL,
    reviewed_by VARCHAR(150) NULL,
    reviewed_at TIMESTAMP NULL,
    checked_in_at TIMESTAMP NULL,
    checked_out_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES cvr_departments(id) ON DELETE RESTRICT
);

-- 3. Gate 1 Vastunagar Checkpoint Logs
CREATE TABLE cvr_gate_access_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(30) NOT NULL,
    checkpoint_name VARCHAR(80) DEFAULT 'Gate 1 (Vastunagar)',
    officer_badge VARCHAR(50) NOT NULL,
    action_type ENUM('CHECK_IN', 'CHECK_OUT') NOT NULL,
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES cvr_visitor_requests(id)
);
```

---

## 6. How to Run & Test

Open [`index.html`](file:///Users/cholletiyashwanthreddy/.gemini/antigravity/scratch/campus-visitor-system/index.html) in your browser to start the journey across the CVR College of Engineering visitor management system.
