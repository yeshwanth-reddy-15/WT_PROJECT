/**
 * Campus Visitor Registration & Approval System
 * Visit Status Controller & Verification Lookup
 * 
 * Strict Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('statusLookupForm');
  if (!form) return;

  const refInput = document.getElementById('referenceNumber');
  const credInput = document.getElementById('verificationCred');
  const submitBtn = document.getElementById('lookupSubmitBtn');
  const emptyPlaceholder = document.getElementById('statusEmptyPlaceholder');
  const errorAlert = document.getElementById('lookupErrorAlert');
  const resultPanel = document.getElementById('statusResultPanel');
  const printPassBtn = document.getElementById('printPassBtn');

  // Handle URL Query Parameters (Auto-lookup if redirected from registration)
  const urlParams = new URLSearchParams(window.location.search);
  const queryRef = urlParams.get('ref');
  const queryEmail = urlParams.get('email');

  if (queryRef && queryEmail) {
    if (refInput) refInput.value = queryRef;
    if (credInput) credInput.value = queryEmail;
    executeLookup(queryRef, queryEmail);
  }

  // Demo shortcut buttons for reviewers
  const demoBtns = document.querySelectorAll('.demo-fill-btn');
  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.getAttribute('data-ref');
      const cred = btn.getAttribute('data-cred');
      if (refInput) refInput.value = ref;
      if (credInput) credInput.value = cred;
      executeLookup(ref, cred);
    });
  });

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ref = refInput ? refInput.value.trim() : '';
    const cred = credInput ? credInput.value.trim() : '';

    let hasError = false;
    if (!ref) {
      document.getElementById('group-referenceNumber').classList.add('has-error');
      document.getElementById('error-ref').classList.add('active');
      hasError = true;
    } else {
      document.getElementById('group-referenceNumber').classList.remove('has-error');
      document.getElementById('error-ref').classList.remove('active');
    }

    if (!cred) {
      document.getElementById('group-verificationCred').classList.add('has-error');
      document.getElementById('error-cred').classList.add('active');
      hasError = true;
    } else {
      document.getElementById('group-verificationCred').classList.remove('has-error');
      document.getElementById('error-cred').classList.remove('active');
    }

    if (hasError) return;

    executeLookup(ref, cred);
  });

  function executeLookup(ref, cred) {
    if (submitBtn) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
    }

    // Brief simulated verification lookup
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }

      const record = visitorStore.verifyStatus(ref, cred);

      if (!record) {
        if (resultPanel) resultPanel.style.display = 'none';
        if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';
        if (errorAlert) {
          errorAlert.style.display = 'flex';
          document.getElementById('lookupErrorMessage').textContent = 
            `No matching record found for Reference "${ref}" with contact "${cred}". Please check your reference code and credentials or verify if your registration was properly submitted.`;
        }
        showToast('Verification Failed', 'Identity verification check failed. Record not found.', 'error');
        return;
      }

      // Record successfully verified
      if (errorAlert) errorAlert.style.display = 'none';
      if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';
      if (resultPanel) resultPanel.style.display = 'block';

      populateStatusView(record);
      showToast('Record Verified', `Viewing status for ${record.fullName} (${record.id})`, 'success');
      
      // Smooth scroll to results
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 280);
  }

  function populateStatusView(record) {
    document.getElementById('resRefNumber').textContent = record.id;
    document.getElementById('resCreatedAt').textContent = formatDate(record.createdAt.split('T')[0]);
    document.getElementById('resFullName').textContent = record.fullName;
    document.getElementById('resEmailPhone').textContent = `${record.email} • ${record.phone}`;
    document.getElementById('resDepartment').textContent = record.department;
    document.getElementById('resPersonToMeet').textContent = record.personToMeet;
    document.getElementById('resVisitDateTime').textContent = `${formatDate(record.visitDate)} at ${formatTime(record.arrivalTime)}`;
    document.getElementById('resPurpose').textContent = record.purpose;

    // Render Badge
    const badgeContainer = document.getElementById('resBadgeContainer');
    if (badgeContainer) {
      badgeContainer.innerHTML = renderStatusBadge(record.status);
    }

    // Notes
    const noteBlock = document.getElementById('resReviewNoteBlock');
    const noteText = document.getElementById('resApprovalNote');
    if (record.approvalNote) {
      noteBlock.style.display = 'block';
      noteText.textContent = `"${record.approvalNote}" — Reviewed by ${record.reviewedBy || 'Department Admin'}`;
    } else {
      noteBlock.style.display = 'none';
    }

    // Contextual Instructions
    const instrCard = document.getElementById('resInstructionsCard');
    const instrHeading = document.getElementById('resInstructionHeading');
    const instrText = document.getElementById('resInstructionText');

    instrCard.className = 'instructions-card';

    if (record.status === 'Approved') {
      instrCard.classList.add('alert-success');
      instrHeading.textContent = 'Visit Approved — CVR Gate 1 Clearance Granted:';
      instrText.innerHTML = `
        Your visit request has been approved by the department. On <strong>${formatDate(record.visitDate)}</strong>, please report to <strong>CVR Gate 1 (Vastunagar Main Entrance)</strong>. 
        Present your Reference Number (<code>${record.id}</code>) and a government-issued photo ID (Aadhaar, Driving License, or Passport) to security personnel to receive your temporary visitor badge and parking slip.
      `;
    } else if (record.status === 'Pending') {
      instrCard.classList.add('alert-warning');
      instrHeading.textContent = 'Application Pending CVR Department Review:';
      instrText.innerHTML = `
        Your request has been forwarded to <strong>${record.department}</strong> and is currently awaiting clearance review. 
        Decisions are typically issued within 1 business day. <strong>Do not proceed to campus until your status updates to "Approved"</strong>, as CVR campus security will not authorize entry for unapproved visits.
      `;
    } else if (record.status === 'Rejected') {
      instrCard.classList.add('alert-danger');
      instrHeading.textContent = 'Visit Authorization Declined:';
      instrText.innerHTML = `
        This visit request was declined by the college department. Campus security at Gate 1 will not issue an entry pass for this reference number. 
        If you require further information, please contact the host staff member directly or phone the CVR College Administrative Office at 08414-661601 / 661666.
      `;
    } else if (record.status === 'On-Campus') {
      instrCard.classList.add('alert-info');
      instrHeading.textContent = 'Active On-Campus Visit (Vastunagar):';
      instrText.innerHTML = `
        Visitor is currently logged as <strong>On-Campus</strong> (Checked in at Gate 1 at ${record.checkedInAt ? formatTime(record.checkedInAt) : 'today'}). 
        Please keep your visitor badge visibly displayed above the waist at all times. Upon completing your appointment, surrender your badge to security at Gate 1 for checkout.
      `;
    } else if (record.status === 'Completed') {
      instrCard.classList.add('alert-info');
      instrHeading.textContent = 'Visit Completed:';
      instrText.innerHTML = `
        This campus visit has concluded and the departure was logged at ${record.checkedOutAt ? formatTime(record.checkedOutAt) : 'Gate 1'}. 
        Thank you for visiting CVR College of Engineering. For future visits, please submit a new registration request.
      `;
    }
  }

  // Print button
  if (printPassBtn) {
    printPassBtn.addEventListener('click', () => {
      window.print();
    });
  }
});
