/**
 * CVR College of Engineering
 * Campus Visitor Registration & Approval System
 * Common Utilities & Client-Side Demonstration Data Service
 * 
 * Strict Vanilla JavaScript (ES6+)
 * Sourced for: CVR College of Engineering (Autonomous, Affiliated to JNTUH)
 * Vastunagar, Mangalpalli (V), Ibrahimpatnam (M), Rangareddy Dist, Telangana - 501510
 */

// Storage Key for Local Demonstration Session
const STORAGE_KEY = 'cvr_visitor_demo_data_v2';
const AUTH_KEY = 'cvr_visitor_auth_session';

// CVR College of Engineering Official Departments
const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Humanities & Sciences (H&S)',
  'Training & Placement Cell (T&P)',
  'Administrative Office & Examination Branch'
];

// Initial Realistic Demonstration Dataset for CVR College of Engineering
const INITIAL_DEMO_REQUESTS = [
  {
    id: 'CVR-2026-8491',
    fullName: 'Dr. K. Srinivas Rao',
    email: 'ksrao@iiit.ac.in',
    phone: '+91 98490 12345',
    department: 'Computer Science & Engineering (CSE)',
    personToMeet: 'Prof. L. C. Siva Reddy (Dean & CSE Head)',
    purpose: 'Invited Expert Lecture & BoS Curriculum Review on Generative AI and Autonomous Cloud Systems in Main Computing Block.',
    visitDate: '2026-10-13',
    arrivalTime: '09:30',
    status: 'Approved',
    approvalNote: 'Official guest speaker clearance granted. Reserved guest parking allocated near Central Library Block.',
    reviewedBy: 'Dr. B. Balaram (AO)',
    reviewedAt: '2026-10-11T14:20:00Z',
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-10T10:15:00Z'
  },
  {
    id: 'CVR-2026-8492',
    fullName: 'Suresh Nambiar',
    email: 'suresh.n@tcs-campus.com',
    phone: '+91 98201 54321',
    department: 'Training & Placement Cell (T&P)',
    personToMeet: 'Dr. K. Venkatesh (Placement Director)',
    purpose: 'Campus Recruitment Day-1 technical assessment dry run and student auditorium technical briefing.',
    visitDate: '2026-10-13',
    arrivalTime: '10:00',
    status: 'On-Campus',
    approvalNote: 'Recruitment partner authorized. Issued corporate badge for Placement Pavilion.',
    reviewedBy: 'Dr. B. Balaram (AO)',
    reviewedAt: '2026-10-12T09:10:00Z',
    checkedInAt: '2026-10-13T09:45:00Z',
    checkedOutAt: null,
    createdAt: '2026-10-11T08:30:00Z'
  },
  {
    id: 'CVR-2026-8493',
    fullName: 'Priya Narayanan',
    email: 'priya.n@ti-semiconductors.com',
    phone: '+91 94400 67890',
    department: 'Electronics & Communication Engineering (ECE)',
    personToMeet: 'Dr. K. Lal Kishore (Senior Professor & Advisor)',
    purpose: 'Texas Instruments Embedded Systems and VLSI design center lab equipment calibration and MoU review in Vishveshwarya Block.',
    visitDate: '2026-10-13',
    arrivalTime: '11:15',
    status: 'Approved',
    approvalNote: 'Industry collaboration verified. Cleared for Vishveshwarya Block Labs.',
    reviewedBy: 'Dr. B. Balaram (AO)',
    reviewedAt: '2026-10-12T16:45:00Z',
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-11T11:00:00Z'
  },
  {
    id: 'CVR-2026-8494',
    fullName: 'Venkata Ramana Reddy',
    email: 'vr.reddy@lntinfra.in',
    phone: '+91 99887 11223',
    department: 'Civil Engineering (CE)',
    personToMeet: 'Dr. T. Muralidhara Rao (CE Head)',
    purpose: 'Advanced Concrete Technology lab testing and structural consultancy sample dispatch in Civil Engineering Block.',
    visitDate: '2026-10-13',
    arrivalTime: '13:00',
    status: 'Pending',
    approvalNote: null,
    reviewedBy: null,
    reviewedAt: null,
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-12T09:40:00Z'
  },
  {
    id: 'CVR-2026-8495',
    fullName: 'Anuradha & K. V. Sharma',
    email: 'sharma.family@gmail.com',
    phone: '+91 94901 23456',
    department: 'Administrative Office & Examination Branch',
    personToMeet: 'Sri M. Ramesh (Admissions Coordinator)',
    purpose: 'TSEAMCET Category-B admission counseling and campus facilities inspection tour for B.Tech CSE aspirant.',
    visitDate: '2026-10-14',
    arrivalTime: '14:00',
    status: 'Pending',
    approvalNote: null,
    reviewedBy: null,
    reviewedAt: null,
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-12T11:22:00Z'
  },
  {
    id: 'CVR-2026-8496',
    fullName: 'Ramesh Babu Goud',
    email: 'ramesh.babu@tgspdcl.gov.in',
    phone: '+91 94408 88210',
    department: 'Electrical & Electronics Engineering (EEE)',
    personToMeet: 'Dr. S. Venkateshwarlu (EEE Head)',
    purpose: 'Vastunagar 33kV dedicated campus substation inspection and solar micro-grid synchronization audit in Ramanujan Block.',
    visitDate: '2026-10-13',
    arrivalTime: '15:30',
    status: 'Pending',
    approvalNote: null,
    reviewedBy: null,
    reviewedAt: null,
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-12T14:05:00Z'
  },
  {
    id: 'CVR-2026-8488',
    fullName: 'Sunil Verma',
    email: 'sverma@citymediahyd.com',
    phone: '+91 98480 99887',
    department: 'Administrative Office & Examination Branch',
    personToMeet: 'Dr. B. Balaram (Administrative Officer)',
    purpose: 'Unsolicited commercial promotional filming and drone aerial survey.',
    visitDate: '2026-10-12',
    arrivalTime: '10:00',
    status: 'Rejected',
    approvalNote: 'Commercial drone operation and unauthorized videography are strictly prohibited on CVR campus grounds without prior Principal clearance.',
    reviewedBy: 'Dr. B. Balaram (AO)',
    reviewedAt: '2026-10-11T13:10:00Z',
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-10T16:30:00Z'
  },
  {
    id: 'CVR-2026-8487',
    fullName: 'Deepak Chawla',
    email: 'dchawla@schneider-electric.com',
    phone: '+91 98112 33990',
    department: 'Mechanical Engineering (ME)',
    personToMeet: 'Dr. M. Venkata Ramana (ME Head)',
    purpose: 'CAD/CAM Robotics Automation center quarterly equipment maintenance and CNC router testing.',
    visitDate: '2026-10-12',
    arrivalTime: '08:30',
    status: 'Completed',
    approvalNote: 'Approved. Completed maintenance job report #ME-2026-441.',
    reviewedBy: 'Dr. B. Balaram (AO)',
    reviewedAt: '2026-10-10T09:00:00Z',
    checkedInAt: '2026-10-12T08:35:00Z',
    checkedOutAt: '2026-10-12T14:15:00Z',
    createdAt: '2026-10-09T11:20:00Z'
  },
  {
    id: 'CVR-2026-8497',
    fullName: 'Prof. Y. Madhavi Latha',
    email: 'ymadhavi@jntuh.ac.in',
    phone: '+91 98495 56789',
    department: 'Electronics & Communication Engineering (ECE)',
    personToMeet: 'Dr. K. Ramamohan Reddy (Principal)',
    purpose: 'JNTUH Academic Affiliation and UGC Autonomous extension committee review meeting.',
    visitDate: '2026-10-15',
    arrivalTime: '10:00',
    status: 'Approved',
    approvalNote: 'University inspection dignitary. Protocol parking reserved at Main Administrative Porch.',
    reviewedBy: 'Dr. B. Balaram (AO)',
    reviewedAt: '2026-10-12T15:10:00Z',
    checkedInAt: null,
    checkedOutAt: null,
    createdAt: '2026-10-11T13:40:00Z'
  }
];

/**
 * Data Management Service
 */
class VisitorDataService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_REQUESTS));
      }
    } catch (e) {
      console.warn('localStorage is restricted. Fallback to memory store.', e);
      this.inMemoryData = [...INITIAL_DEMO_REQUESTS];
    }
  }

  getRequests() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      if (this.inMemoryData) return this.inMemoryData;
    }
    return INITIAL_DEMO_REQUESTS;
  }

  saveRequests(requests) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      this.inMemoryData = requests;
    }
  }

  getAll() {
    return this.getRequests();
  }

  getById(id) {
    const list = this.getRequests();
    return list.find(r => r.id.trim().toUpperCase() === id.trim().toUpperCase()) || null;
  }

  createRequest(data) {
    const list = this.getRequests();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `CVR-2026-${randomSuffix}`;

    const newRecord = {
      id: newId,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      department: data.department,
      personToMeet: data.personToMeet.trim(),
      purpose: data.purpose.trim(),
      visitDate: data.visitDate,
      arrivalTime: data.arrivalTime,
      status: 'Pending',
      approvalNote: null,
      reviewedBy: null,
      reviewedAt: null,
      checkedInAt: null,
      checkedOutAt: null,
      createdAt: new Date().toISOString()
    };

    list.unshift(newRecord);
    this.saveRequests(list);
    return newRecord;
  }

  updateStatus(id, newStatus, note, reviewerName = 'Dr. B. Balaram (AO)') {
    const list = this.getRequests();
    const item = list.find(r => r.id === id);
    if (!item) return false;

    item.status = newStatus;
    item.approvalNote = note || (newStatus === 'Approved' ? 'Campus gate clearance granted. Present reference number at Gate 1.' : 'Visit authorization declined by college administration.');
    item.reviewedBy = reviewerName;
    item.reviewedAt = new Date().toISOString();

    this.saveRequests(list);
    return item;
  }

  checkIn(id) {
    const list = this.getRequests();
    const item = list.find(r => r.id === id);
    if (!item) return false;

    if (item.status !== 'Approved') {
      return { success: false, message: 'Only officially approved visits can be checked in.' };
    }

    item.status = 'On-Campus';
    item.checkedInAt = new Date().toISOString();
    this.saveRequests(list);
    return { success: true, item };
  }

  checkOut(id) {
    const list = this.getRequests();
    const item = list.find(r => r.id === id);
    if (!item) return false;

    if (item.status !== 'On-Campus') {
      return { success: false, message: 'Visitor is not currently checked in.' };
    }

    item.status = 'Completed';
    item.checkedOutAt = new Date().toISOString();
    this.saveRequests(list);
    return { success: true, item };
  }

  verifyStatus(referenceNumber, emailOrPhone) {
    const ref = referenceNumber.trim().toUpperCase();
    const cred = emailOrPhone.trim().toLowerCase();

    const list = this.getRequests();
    const found = list.find(r => {
      const matchId = r.id.toUpperCase() === ref;
      const matchEmail = r.email.toLowerCase() === cred;
      const cleanPhone = r.phone.replace(/\D/g, '');
      const cleanInput = cred.replace(/\D/g, '');
      const matchPhone = cleanPhone.length > 5 && cleanPhone === cleanInput;
      return matchId && (matchEmail || matchPhone);
    });

    return found || null;
  }

  getMetrics() {
    const list = this.getRequests();
    return {
      total: list.length,
      pending: list.filter(r => r.status === 'Pending').length,
      approved: list.filter(r => r.status === 'Approved').length,
      rejected: list.filter(r => r.status === 'Rejected').length,
      onCampus: list.filter(r => r.status === 'On-Campus').length,
      completed: list.filter(r => r.status === 'Completed').length
    };
  }

  resetDemo() {
    this.saveRequests(INITIAL_DEMO_REQUESTS);
  }
}

// Global Service Instance
const visitorStore = new VisitorDataService();

/**
 * Common UI & Notification Utilities
 */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  toast.innerHTML = `
    <div class="toast-body">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div>${escapeHTML(message)}</div>
    </div>
    <button class="toast-close" type="button" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 200);
  };

  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    setTimeout(() => focusable[0].focus(), 50);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Setup common modal listeners (Escape key & backdrop click)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    activeModals.forEach(modal => closeModal(modal.id));
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal(e.target.id);
  }
});

/**
 * Text & Date Helpers
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(isoDateString) {
  if (!isoDateString) return '—';
  try {
    const parts = isoDateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    const d = new Date(isoDateString);
    return isNaN(d) ? isoDateString : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return isoDateString;
  }
}

function formatTime(timeString) {
  if (!timeString) return '—';
  if (timeString.includes('T')) {
    const d = new Date(timeString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  return timeString;
}

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function renderStatusBadge(status) {
  switch (status) {
    case 'Approved':
      return `<span class="badge badge-approved"><span class="badge-dot"></span> Approved</span>`;
    case 'Pending':
      return `<span class="badge badge-pending"><span class="badge-dot"></span> Pending Review</span>`;
    case 'Rejected':
      return `<span class="badge badge-rejected"><span class="badge-dot"></span> Declined</span>`;
    case 'On-Campus':
      return `<span class="badge badge-oncampus"><span class="badge-dot"></span> On-Campus</span>`;
    case 'Completed':
      return `<span class="badge badge-completed"><span class="badge-dot"></span> Completed</span>`;
    default:
      return `<span class="badge">${escapeHTML(status)}</span>`;
  }
}

// Mobile Navbar Toggle for Public Pages
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // Populate dynamic current date where needed
  const dateElements = document.querySelectorAll('.current-date-display');
  if (dateElements.length) {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    dateElements.forEach(el => el.textContent = formatted);
  }
});
