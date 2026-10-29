/**
 * Campus Visitor Registration & Approval System
 * Administrative Dashboard Controller
 * 
 * Strict Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Authentication & Session Setup
  let currentUser = null;
  try {
    const rawUser = sessionStorage.getItem(AUTH_KEY);
    if (rawUser) {
      currentUser = JSON.parse(rawUser);
    }
  } catch (e) {
    console.error(e);
  }

  // Fallback default admin profile for direct page reviewers
  if (!currentUser) {
    currentUser = {
      role: 'Admin',
      name: 'Dr. B. Balaram',
      title: 'Administrative Officer & Campus Operations',
      department: 'Central Administration Block, Vastunagar',
      email: 'admin@cvr.ac.in'
    };
  }

  // Populate User Profile in Sidebar
  const userNameEl = document.getElementById('sidebarUserName');
  const userRoleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarAvatar');
  if (userNameEl) userNameEl.textContent = currentUser.name;
  if (userRoleEl) userRoleEl.textContent = currentUser.title;
  if (avatarEl) {
    const initials = currentUser.name.split(' ').map(p => p[0]).join('').slice(0, 2);
    avatarEl.textContent = initials || 'BB';
  }

  // Logout Handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY);
      showToast('Logged Out', 'Staff session concluded.', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 300);
    });
  }

  // Mobile Sidebar Toggle
  const sidebar = document.getElementById('dashboardSidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Global State for Currently Selected Item in Modals
  let activeSelectedId = null;

  // DOM Elements
  const tableBody = document.getElementById('requestsTableBody');
  const emptyState = document.getElementById('tableEmptyState');
  const countDisplay = document.getElementById('recordCountDisplay');
  const searchInput = document.getElementById('tableSearchInput');
  const statusFilter = document.getElementById('filterStatus');
  const deptFilter = document.getElementById('filterDepartment');
  const dateFilter = document.getElementById('filterDate');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const resetDemoBtn = document.getElementById('resetDemoBtn');

  // Metrics Elements
  const metricTotal = document.getElementById('metricTotal');
  const metricPending = document.getElementById('metricPending');
  const metricApproved = document.getElementById('metricApproved');
  const metricRejected = document.getElementById('metricRejected');
  const sidebarPendingBadge = document.getElementById('sidebarPendingBadge');

  // Confirmation Modals Elements
  const confirmApproveBtn = document.getElementById('confirmApproveBtn');
  const confirmRejectBtn = document.getElementById('confirmRejectBtn');
  const approvalNoteInput = document.getElementById('approvalNoteInput');
  const rejectReasonInput = document.getElementById('rejectReasonInput');

  // Modal Close Attribute Listeners
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Calculate & Render Metric Summary Badges
  function updateMetrics() {
    const metrics = visitorStore.getMetrics();
    if (metricTotal) metricTotal.textContent = metrics.total;
    if (metricPending) metricPending.textContent = metrics.pending;
    if (metricApproved) metricApproved.textContent = metrics.approved;
    if (metricRejected) metricRejected.textContent = metrics.rejected;
    if (sidebarPendingBadge) sidebarPendingBadge.textContent = metrics.pending;
  }

  // Filter & Query Logic
  function getFilteredRequests() {
    const all = visitorStore.getAll();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const statusVal = statusFilter ? statusFilter.value : '';
    const deptVal = deptFilter ? deptFilter.value : '';
    const dateVal = dateFilter ? dateFilter.value : '';

    const todayStr = getTodayString();

    return all.filter(r => {
      // Search matching across multiple fields
      if (query) {
        const matchText = `${r.id} ${r.fullName} ${r.email} ${r.personToMeet} ${r.department} ${r.purpose}`.toLowerCase();
        if (!matchText.includes(query)) return false;
      }

      // Status filter
      if (statusVal && r.status !== statusVal) {
        return false;
      }

      // Department filter
      if (deptVal && r.department !== deptVal) {
        return false;
      }

      // Date filter
      if (dateVal === 'today' && r.visitDate !== todayStr) {
        return false;
      } else if (dateVal === 'upcoming' && r.visitDate <= todayStr) {
        return false;
      } else if (dateVal === 'past' && r.visitDate >= todayStr) {
        return false;
      }

      return true;
    });
  }

  // Render Table Rows
  function renderTable() {
    const list = getFilteredRequests();
    updateMetrics();

    if (countDisplay) countDisplay.textContent = list.length;

    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (list.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    list.forEach(item => {
      const tr = document.createElement('tr');

      // Actions cell buttons
      let actionButtons = `
        <button type="button" class="btn btn-secondary btn-sm action-view-btn" data-id="${item.id}" title="View full visit request details">
          View
        </button>
      `;

      if (item.status === 'Pending') {
        actionButtons += `
          <button type="button" class="btn btn-success btn-sm action-approve-btn" data-id="${item.id}" title="Authorize visit">
            Approve
          </button>
          <button type="button" class="btn btn-danger btn-sm action-reject-btn" data-id="${item.id}" title="Decline visit">
            Decline
          </button>
        `;
      } else if (item.status === 'Approved') {
        actionButtons += `
          <button type="button" class="btn btn-danger btn-sm action-reject-btn" data-id="${item.id}" title="Revoke authorization">
            Revoke
          </button>
        `;
      }

      tr.innerHTML = `
        <td>
          <span class="table-code">${escapeHTML(item.id)}</span>
        </td>
        <td>
          <div class="table-person-name">${escapeHTML(item.fullName)}</div>
          <div class="table-person-sub">${escapeHTML(item.email)} &bull; ${escapeHTML(item.phone)}</div>
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

  // Row Action Click Handlers
  function attachRowListeners() {
    // View detail
    document.querySelectorAll('.action-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openDetailModal(id);
      });
    });

    // Approve
    document.querySelectorAll('.action-approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openApproveConfirmation(id);
      });
    });

    // Reject / Revoke
    document.querySelectorAll('.action-reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openRejectConfirmation(id);
      });
    });
  }

  // View Details Modal Handler
  function openDetailModal(id) {
    const item = visitorStore.getById(id);
    if (!item) return;

    activeSelectedId = id;
    const content = document.getElementById('detailModalContent');
    const footer = document.getElementById('detailModalFooter');

    content.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">Reference ID</div>
          <div class="detail-value"><span class="table-code">${escapeHTML(item.id)}</span></div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Approval Status</div>
          <div class="detail-value">${renderStatusBadge(item.status)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Visitor Full Name</div>
          <div class="detail-value">${escapeHTML(item.fullName)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Contact Credentials</div>
          <div class="detail-value">${escapeHTML(item.email)}<br><span style="color:var(--color-text-secondary);">${escapeHTML(item.phone)}</span></div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Host Department</div>
          <div class="detail-value">${escapeHTML(item.department)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Faculty / Host To Meet</div>
          <div class="detail-value">${escapeHTML(item.personToMeet)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Planned Visit Date &amp; Time</div>
          <div class="detail-value">${formatDate(item.visitDate)} at ${formatTime(item.arrivalTime)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Application Logged</div>
          <div class="detail-value">${formatDate(item.createdAt.split('T')[0])}</div>
        </div>
        <div class="detail-item detail-item-full">
          <div class="detail-label">Stated Purpose of Visit</div>
          <div class="detail-box-notes">${escapeHTML(item.purpose)}</div>
        </div>
        ${item.approvalNote ? `
          <div class="detail-item detail-item-full">
            <div class="detail-label">Administrative Review Notes</div>
            <div class="detail-box-notes" style="background:#FFFDFD; border-color:var(--color-border);">
              <em>"${escapeHTML(item.approvalNote)}"</em> &mdash; <span style="font-size:0.75rem; color:var(--color-text-secondary);">${escapeHTML(item.reviewedBy || 'Admin')}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Footer actions in detail modal
    let footerBtns = `<button type="button" class="btn btn-secondary" data-close-modal="detailModal">Close</button>`;
    if (item.status === 'Pending') {
      footerBtns += `
        <button type="button" class="btn btn-danger" id="detailModalRejectBtn">Decline Request</button>
        <button type="button" class="btn btn-success" id="detailModalApproveBtn">Approve Request</button>
      `;
    }

    footer.innerHTML = footerBtns;

    footer.querySelector('[data-close-modal="detailModal"]').addEventListener('click', () => {
      closeModal('detailModal');
    });

    const modalApprove = document.getElementById('detailModalApproveBtn');
    if (modalApprove) {
      modalApprove.addEventListener('click', () => {
        closeModal('detailModal');
        openApproveConfirmation(id);
      });
    }

    const modalReject = document.getElementById('detailModalRejectBtn');
    if (modalReject) {
      modalReject.addEventListener('click', () => {
        closeModal('detailModal');
        openRejectConfirmation(id);
      });
    }

    openModal('detailModal');
  }

  // Approve Confirmation Modal Handlers
  function openApproveConfirmation(id) {
    const item = visitorStore.getById(id);
    if (!item) return;

    activeSelectedId = id;
    document.getElementById('approveVisitorName').textContent = item.fullName;
    document.getElementById('approveRefId').textContent = item.id;
    if (approvalNoteInput) approvalNoteInput.value = '';

    openModal('approveModal');
  }

  confirmApproveBtn.addEventListener('click', () => {
    if (!activeSelectedId) return;

    const note = approvalNoteInput ? approvalNoteInput.value.trim() : '';
    const updated = visitorStore.updateStatus(activeSelectedId, 'Approved', note, currentUser.name);

    if (updated) {
      closeModal('approveModal');
      renderTable();
      showToast('Visit Authorized', `Approved clearance for ${updated.fullName} (${updated.id}).`, 'success');
    }
  });

  // Reject Confirmation Modal Handlers
  function openRejectConfirmation(id) {
    const item = visitorStore.getById(id);
    if (!item) return;

    activeSelectedId = id;
    document.getElementById('rejectVisitorName').textContent = item.fullName;
    document.getElementById('rejectRefId').textContent = item.id;
    if (rejectReasonInput) rejectReasonInput.value = '';

    openModal('rejectModal');
  }

  confirmRejectBtn.addEventListener('click', () => {
    if (!activeSelectedId) return;

    const reason = rejectReasonInput ? rejectReasonInput.value.trim() : '';
    if (!reason) {
      rejectReasonInput.focus();
      showToast('Reason Required', 'Please enter a justification for declining this request.', 'warning');
      return;
    }

    const updated = visitorStore.updateStatus(activeSelectedId, 'Rejected', reason, currentUser.name);

    if (updated) {
      closeModal('rejectModal');
      renderTable();
      showToast('Request Declined', `Declined visit request for ${updated.fullName} (${updated.id}).`, 'warning');
    }
  });

  // Filter change listeners
  [searchInput, statusFilter, deptFilter, dateFilter].forEach(el => {
    if (el) {
      el.addEventListener('input', renderTable);
      el.addEventListener('change', renderTable);
    }
  });

  // Reset Filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = '';
      if (deptFilter) deptFilter.value = '';
      if (dateFilter) dateFilter.value = '';
      renderTable();
      showToast('Filters Cleared', 'Displaying all visitor records.', 'info');
    });
  }

  // Reset Demo Data
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('Reset prototype records back to initial demonstration state?')) {
        visitorStore.resetDemo();
        renderTable();
        showToast('Demo Data Reset', 'Demonstration dataset restored to factory defaults.', 'info');
      }
    });
  }

  // Initial table render
  renderTable();
});
