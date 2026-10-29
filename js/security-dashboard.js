/**
 * Campus Visitor Registration & Approval System
 * Gatehouse Security Console Controller
 * 
 * Strict Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Authentication & Session Setup
  let currentOfficer = null;
  try {
    const rawUser = sessionStorage.getItem(AUTH_KEY);
    if (rawUser) {
      currentOfficer = JSON.parse(rawUser);
    }
  } catch (e) {
    console.error(e);
  }

  // Fallback default officer for direct page reviewers
  if (!currentOfficer) {
    currentOfficer = {
      role: 'Security',
      name: 'Officer M. Srinivas',
      title: 'Gate 1 Security Lead (Vastunagar)',
      department: 'CVR Campus Security & Access Control',
      email: 'security@cvr.ac.in'
    };
  }

  // Populate Officer Details
  const officerNameEl = document.getElementById('securityOfficerName');
  const officerRoleEl = document.getElementById('securityOfficerRole');
  const bannerOfficerEl = document.getElementById('bannerOfficerName');
  const avatarEl = document.getElementById('securityAvatar');

  if (officerNameEl) officerNameEl.textContent = currentOfficer.name;
  if (officerRoleEl) officerRoleEl.textContent = currentOfficer.title;
  if (bannerOfficerEl) bannerOfficerEl.textContent = `${currentOfficer.name} (Badge #482, Vastunagar Gatehouse)`;
  if (avatarEl) {
    const initials = currentOfficer.name.split(' ').map(p => p[0]).join('').slice(0, 2);
    avatarEl.textContent = initials || 'MS';
  }

  // Logout Handler
  const logoutBtn = document.getElementById('secLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY);
      showToast('Signed Out', 'Gate terminal session closed.', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 300);
    });
  }

  // Mobile Sidebar Toggle
  const sidebar = document.getElementById('securitySidebar');
  const toggleBtn = document.getElementById('secSidebarToggleBtn');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // State
  let activeTab = 'approved'; // 'approved' | 'oncampus' | 'completed' | 'all'
  let activeSelectedId = null;

  // DOM Elements
  const tableBody = document.getElementById('secTableBody');
  const emptyState = document.getElementById('secEmptyState');
  const searchInput = document.getElementById('secSearchInput');
  const deptFilter = document.getElementById('secDeptFilter');
  const resetFiltersBtn = document.getElementById('secResetFiltersBtn');
  const tabLabel = document.getElementById('secCurrentTabLabel');
  const countDisplay = document.getElementById('secCountDisplay');

  // Metrics
  const metricApproved = document.getElementById('secMetricApproved');
  const metricOnCampus = document.getElementById('secMetricOnCampus');
  const metricCompleted = document.getElementById('secMetricCompleted');
  const sidebarGateApprovedCount = document.getElementById('sidebarGateApprovedCount');

  // Tab count indicators
  const countTabApproved = document.getElementById('countTabApproved');
  const countTabOnCampus = document.getElementById('countTabOnCampus');
  const countTabCompleted = document.getElementById('countTabCompleted');
  const countTabAll = document.getElementById('countTabAll');

  // Confirmation Modals
  const confirmCheckInBtn = document.getElementById('confirmCheckInBtn');
  const confirmCheckOutBtn = document.getElementById('confirmCheckOutBtn');

  // Modal Close Attribute Listeners
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Tab Buttons Listener
  const tabButtons = document.querySelectorAll('.security-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      activeTab = btn.getAttribute('data-tab');
      renderTable();
    });
  });

  // Calculate & Refresh Metrics & Tab Counters
  function updateCounters() {
    const all = visitorStore.getAll();
    const approvedList = all.filter(r => r.status === 'Approved');
    const onCampusList = all.filter(r => r.status === 'On-Campus');
    const completedList = all.filter(r => r.status === 'Completed');

    if (metricApproved) metricApproved.textContent = approvedList.length;
    if (metricOnCampus) metricOnCampus.textContent = onCampusList.length;
    if (metricCompleted) metricCompleted.textContent = completedList.length;
    if (sidebarGateApprovedCount) sidebarGateApprovedCount.textContent = approvedList.length;

    if (countTabApproved) countTabApproved.textContent = approvedList.length;
    if (countTabOnCampus) countTabOnCampus.textContent = onCampusList.length;
    if (countTabCompleted) countTabCompleted.textContent = completedList.length;
    if (countTabAll) countTabAll.textContent = all.length;
  }

  // Filter Logic
  function getFilteredRecords() {
    const all = visitorStore.getAll();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const deptVal = deptFilter ? deptFilter.value : '';

    return all.filter(r => {
      // Tab Category Filtering
      if (activeTab === 'approved' && r.status !== 'Approved') {
        return false;
      } else if (activeTab === 'oncampus' && r.status !== 'On-Campus') {
        return false;
      } else if (activeTab === 'completed' && r.status !== 'Completed') {
        return false;
      }

      // Department Filter
      if (deptVal && r.department !== deptVal) {
        return false;
      }

      // Search Query
      if (query) {
        const text = `${r.id} ${r.fullName} ${r.personToMeet} ${r.department} ${r.phone}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }

  // Render Table
  function renderTable() {
    updateCounters();
    const records = getFilteredRecords();

    // Update Tab Label
    if (tabLabel) {
      if (activeTab === 'approved') tabLabel.textContent = 'Approved Awaiting Arrival';
      else if (activeTab === 'oncampus') tabLabel.textContent = 'Currently On Campus';
      else if (activeTab === 'completed') tabLabel.textContent = 'Completed Visits';
      else tabLabel.textContent = 'All Campus Logs';
    }

    if (countDisplay) countDisplay.textContent = records.length;

    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (records.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    records.forEach(item => {
      const tr = document.createElement('tr');

      // Formulate timestamps
      let timestampText = `<span style="color:var(--color-text-muted); font-size:0.75rem;">Not Checked In</span>`;
      if (item.checkedInAt && !item.checkedOutAt) {
        timestampText = `<span style="color:#1D4ED8; font-weight:600; font-size:0.8125rem;">In: ${formatTime(item.checkedInAt)}</span>`;
      } else if (item.checkedInAt && item.checkedOutAt) {
        timestampText = `
          <div style="font-size:0.75rem;">In: ${formatTime(item.checkedInAt)}</div>
          <div style="font-size:0.75rem; color:var(--color-text-secondary);">Out: ${formatTime(item.checkedOutAt)}</div>
        `;
      }

      // Formulate Actions
      let actionButtons = `
        <button type="button" class="btn btn-secondary btn-sm action-gate-view-btn" data-id="${item.id}" title="Inspect verification pass">
          Verify Pass
        </button>
      `;

      if (item.status === 'Approved') {
        actionButtons += `
          <button type="button" class="btn btn-success btn-sm action-gate-checkin-btn" data-id="${item.id}" title="Issue pass & check in visitor">
            Check-In
          </button>
        `;
      } else if (item.status === 'On-Campus') {
        actionButtons += `
          <button type="button" class="btn btn-primary btn-sm action-gate-checkout-btn" data-id="${item.id}" title="Collect badge & log checkout">
            Check-Out
          </button>
        `;
      } else if (item.status === 'Pending' || item.status === 'Rejected') {
        actionButtons += `
          <span style="font-size:0.75rem; color:var(--color-danger); font-weight:600; padding: 0.2rem 0.4rem; background:#FEF3F2; border-radius:3px;">
            No Gate Entry
          </span>
        `;
      }

      tr.innerHTML = `
        <td>
          <span class="table-code">${escapeHTML(item.id)}</span>
        </td>
        <td>
          <div class="table-person-name">${escapeHTML(item.fullName)}</div>
          <div class="table-person-sub">${escapeHTML(item.phone)}</div>
        </td>
        <td>
          <div class="table-person-name">${escapeHTML(item.personToMeet)}</div>
          <div class="table-person-sub">${escapeHTML(item.department)}</div>
        </td>
        <td>
          <div class="table-person-name">${formatDate(item.visitDate)}</div>
          <div class="table-person-sub">${formatTime(item.arrivalTime)}</div>
        </td>
        <td>
          ${timestampText}
        </td>
        <td>
          ${renderStatusBadge(item.status)}
        </td>
        <td style="text-align: right;">
          <div class="action-buttons-group" style="justify-content: flex-end;">
            ${actionButtons}
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
    });

    attachRowListeners();
  }

  // Row Event Listeners
  function attachRowListeners() {
    // View verification pass
    document.querySelectorAll('.action-gate-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openGateDetailModal(id);
      });
    });

    // Check In
    document.querySelectorAll('.action-gate-checkin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCheckInConfirmation(id);
      });
    });

    // Check Out
    document.querySelectorAll('.action-gate-checkout-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openCheckOutConfirmation(id);
      });
    });
  }

  // Gate Detail / Pass Verification Modal
  function openGateDetailModal(id) {
    const item = visitorStore.getById(id);
    if (!item) return;

    activeSelectedId = id;
    const content = document.getElementById('gateModalContent');
    const footer = document.getElementById('gateModalFooter');

    content.innerHTML = `
      <div style="border: 2px dashed var(--color-border); border-radius: var(--radius-sm); padding: 1.25rem; background: #FAFAFA; margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; margin-bottom: 0.875rem;">
          <div>
            <div style="font-size: 0.6875rem; text-transform: uppercase; color: var(--color-text-secondary); font-weight: 700;">Official Campus Visitor Pass</div>
            <div style="font-family: var(--font-family-mono); font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">${escapeHTML(item.id)}</div>
          </div>
          <div>
            ${renderStatusBadge(item.status)}
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-label">Visitor Legal Name</div>
            <div class="detail-value" style="font-size: 1rem; color: var(--color-primary);">${escapeHTML(item.fullName)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Contact Mobile</div>
            <div class="detail-value">${escapeHTML(item.phone)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Authorized Destination</div>
            <div class="detail-value">${escapeHTML(item.department)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Faculty Host / Contact</div>
            <div class="detail-value">${escapeHTML(item.personToMeet)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Scheduled Date &amp; Arrival</div>
            <div class="detail-value">${formatDate(item.visitDate)} &bull; ${formatTime(item.arrivalTime)}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Gate Log Status</div>
            <div class="detail-value">
              ${item.checkedInAt ? `In: ${formatTime(item.checkedInAt)}` : 'Awaiting Entry'}
              ${item.checkedOutAt ? ` &bull; Out: ${formatTime(item.checkedOutAt)}` : ''}
            </div>
          </div>
          <div class="detail-item detail-item-full">
            <div class="detail-label">Approved Purpose</div>
            <div style="font-size: 0.84375rem; color: var(--color-text-main);">${escapeHTML(item.purpose)}</div>
          </div>
          ${item.approvalNote ? `
            <div class="detail-item detail-item-full">
              <div class="detail-label">Host Instructions / Parking Note</div>
              <div style="font-size: 0.84375rem; font-style: italic; color: var(--color-text-main); background: #FFFFFF; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: 4px;">
                "${escapeHTML(item.approvalNote)}"
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    let footerHtml = `
      <button type="button" class="btn btn-secondary" data-close-modal="gateDetailModal">Close</button>
      <button type="button" class="btn btn-secondary" onclick="window.print()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print Gate Pass
      </button>
    `;

    if (item.status === 'Approved') {
      footerHtml += `
        <button type="button" class="btn btn-success" id="gateModalCheckInBtn">Check In &amp; Issue Badge</button>
      `;
    } else if (item.status === 'On-Campus') {
      footerHtml += `
        <button type="button" class="btn btn-primary" id="gateModalCheckOutBtn">Log Check Out</button>
      `;
    }

    footer.innerHTML = footerHtml;

    footer.querySelector('[data-close-modal="gateDetailModal"]').addEventListener('click', () => {
      closeModal('gateDetailModal');
    });

    const modalInBtn = document.getElementById('gateModalCheckInBtn');
    if (modalInBtn) {
      modalInBtn.addEventListener('click', () => {
        closeModal('gateDetailModal');
        openCheckInConfirmation(id);
      });
    }

    const modalOutBtn = document.getElementById('gateModalCheckOutBtn');
    if (modalOutBtn) {
      modalOutBtn.addEventListener('click', () => {
        closeModal('gateDetailModal');
        openCheckOutConfirmation(id);
      });
    }

    openModal('gateDetailModal');
  }

  // Check In Modal
  function openCheckInConfirmation(id) {
    const item = visitorStore.getById(id);
    if (!item) return;

    activeSelectedId = id;
    document.getElementById('checkInVisitorName').textContent = item.fullName;
    document.getElementById('checkInRefId').textContent = item.id;
    openModal('checkInModal');
  }

  confirmCheckInBtn.addEventListener('click', () => {
    if (!activeSelectedId) return;

    const res = visitorStore.checkIn(activeSelectedId);
    if (res.success) {
      closeModal('checkInModal');
      renderTable();
      showToast(
        'Visitor Checked In', 
        `${res.item.fullName} entry logged at Main Gate. Status updated to On-Campus.`, 
        'success'
      );
    } else {
      showToast('Action Disallowed', res.message, 'error');
    }
  });

  // Check Out Modal
  function openCheckOutConfirmation(id) {
    const item = visitorStore.getById(id);
    if (!item) return;

    activeSelectedId = id;
    document.getElementById('checkOutVisitorName').textContent = item.fullName;
    document.getElementById('checkOutRefId').textContent = item.id;
    openModal('checkOutModal');
  }

  confirmCheckOutBtn.addEventListener('click', () => {
    if (!activeSelectedId) return;

    const res = visitorStore.checkOut(activeSelectedId);
    if (res.success) {
      closeModal('checkOutModal');
      renderTable();
      showToast(
        'Departure Logged', 
        `${res.item.fullName} badge surrendered. Visit completed.`, 
        'info'
      );
    } else {
      showToast('Action Disallowed', res.message, 'error');
    }
  });

  // Search & Filter Listeners
  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (deptFilter) deptFilter.addEventListener('change', renderTable);
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (deptFilter) deptFilter.value = '';
      renderTable();
    });
  }

  // Initial table render
  renderTable();
});
