/**
 * Campus Visitor Registration & Approval System
 * Registration Form Controller & Real-Time Validation
 * 
 * Strict Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('visitorRegistrationForm');
  if (!form) return;

  const dateInput = document.getElementById('visitDate');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewStatusBtn = document.getElementById('viewStatusBtn');

  // Enforce minimum date to today
  if (dateInput) {
    const today = getTodayString();
    dateInput.min = today;
    // Default to today if unset
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }

  // Password Visibility Toggles
  const toggleButtons = document.querySelectorAll('.toggle-password-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      // Update button icon
      btn.innerHTML = isPassword
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  // Validation Rules
  const validators = {
    fullName: (value) => {
      if (!value.trim()) return 'Legal name is required.';
      if (value.trim().length < 3) return 'Full name must contain at least 3 characters.';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'Email address is required.';
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!regex.test(value.trim())) return 'Please provide a valid email format (e.g. name@domain.com).';
      return null;
    },
    phone: (value) => {
      if (!value.trim()) return 'Mobile number is required for gate emergency contact.';
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length < 10) return 'Please provide a valid phone number with at least 10 digits.';
      return null;
    },
    password: (value) => {
      if (!value) return 'Passcode is required.';
      if (value.length < 6) return 'Passcode must be at least 6 characters in length.';
      return null;
    },
    confirmPassword: (value) => {
      const pwd = document.getElementById('password').value;
      if (!value) return 'Please confirm your passcode.';
      if (value !== pwd) return 'Passcodes do not match.';
      return null;
    },
    department: (value) => {
      if (!value || value.trim() === '') return 'Please select a host department.';
      return null;
    },
    personToMeet: (value) => {
      if (!value.trim()) return 'Please identify the faculty or staff member you are meeting.';
      if (value.trim().length < 2) return 'Host name is too short.';
      return null;
    },
    visitDate: (value) => {
      if (!value) return 'Planned visit date is required.';
      const selected = new Date(value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) return 'Visit date cannot be in the past.';
      return null;
    },
    arrivalTime: (value) => {
      if (!value) return 'Expected arrival time is required.';
      return null;
    },
    purpose: (value) => {
      if (!value.trim()) return 'Please provide the purpose of your visit.';
      if (value.trim().length < 15) return 'Please provide a brief justification (at least 15 characters).';
      return null;
    }
  };

  function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const group = document.getElementById(`group-${fieldName}`);
    const errorEl = document.getElementById(`error-${fieldName}`);
    if (!input || !group || !errorEl) return true;

    const validator = validators[fieldName];
    if (!validator) return true;

    const errorMsg = validator(input.value);

    if (errorMsg) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      errorEl.textContent = errorMsg;
      errorEl.classList.add('active');
      return false;
    } else {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      errorEl.classList.remove('active');
      return true;
    }
  }

  // Attach blur and input event handlers to fields
  Object.keys(validators).forEach(fieldName => {
    const input = document.getElementById(fieldName);
    if (!input) return;

    input.addEventListener('blur', () => {
      validateField(fieldName);
    });

    input.addEventListener('input', () => {
      const group = document.getElementById(`group-${fieldName}`);
      if (group && group.classList.contains('has-error')) {
        validateField(fieldName);
      }
      if (fieldName === 'password') {
        const confirmField = document.getElementById('confirmPassword');
        if (confirmField && confirmField.value) {
          validateField('confirmPassword');
        }
      }
    });
  });

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;

    Object.keys(validators).forEach(fieldName => {
      const isValid = validateField(fieldName);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = document.getElementById(fieldName);
        }
      }
    });

    if (!isFormValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
        showToast('Incomplete Form', 'Please correct the highlighted errors before submitting.', 'error');
      }
      return;
    }

    // Set loading state on submit button
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    // Simulate standard asynchronous API call delay
    setTimeout(() => {
      const formData = {
        fullName: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        department: form.department.value,
        personToMeet: form.personToMeet.value,
        visitDate: form.visitDate.value,
        arrivalTime: form.arrivalTime.value,
        purpose: form.purpose.value
      };

      const newRecord = visitorStore.createRequest(formData);

      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Update Modal
      const refEl = document.getElementById('confirmedRefNumber');
      const nameEl = document.getElementById('confirmedVisitorName');
      if (refEl) refEl.textContent = newRecord.id;
      if (nameEl) nameEl.textContent = newRecord.fullName;

      if (viewStatusBtn) {
        viewStatusBtn.href = `status.html?ref=${encodeURIComponent(newRecord.id)}&email=${encodeURIComponent(newRecord.email)}`;
      }

      openModal('successModal');
      showToast('Request Submitted', `Your visit request ${newRecord.id} has been registered.`, 'success');

      form.reset();
      // Remove success styles from groups
      document.querySelectorAll('.form-group.has-success').forEach(el => el.classList.remove('has-success'));
      if (dateInput) {
        dateInput.value = getTodayString();
      }
    }, 450);
  });

  // Modal Close Button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      closeModal('successModal');
    });
  }
});
