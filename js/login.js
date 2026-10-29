/**
 * CVR College of Engineering
 * Staff Authentication Controller
 * 
 * Strict Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('staffLoginForm');
  if (!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const errorAlert = document.getElementById('loginErrorAlert');
  const errorMessage = document.getElementById('loginErrorMessage');

  // Password visibility toggle
  const toggleBtn = form.querySelector('.toggle-password-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      toggleBtn.innerHTML = isPassword
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  // Demo accounts auto-fill buttons
  const fillBtns = document.querySelectorAll('.fill-account-btn');
  fillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      const pwd = btn.getAttribute('data-pwd');
      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = pwd;
      if (errorAlert) errorAlert.style.display = 'none';
      submitBtn.click();
    });
  });

  // Handle Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const password = passwordInput ? passwordInput.value : '';

    let hasError = false;

    if (!email) {
      document.getElementById('group-loginEmail').classList.add('has-error');
      document.getElementById('error-loginEmail').classList.add('active');
      hasError = true;
    } else {
      document.getElementById('group-loginEmail').classList.remove('has-error');
      document.getElementById('error-loginEmail').classList.remove('active');
    }

    if (!password) {
      document.getElementById('group-loginPassword').classList.add('has-error');
      document.getElementById('error-loginPassword').classList.add('active');
      hasError = true;
    } else {
      document.getElementById('group-loginPassword').classList.remove('has-error');
      document.getElementById('error-loginPassword').classList.remove('active');
    }

    if (hasError) return;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    if (errorAlert) errorAlert.style.display = 'none';

    // Simulate authentication processing
    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Recognized CVR Demonstration Credentials
      const isAdmin = (email === 'admin@cvr.ac.in' || email === 'admin@crestview.edu') && password === 'admin123';
      const isSecurity = (email === 'security@cvr.ac.in' || email === 'security@crestview.edu') && password === 'guard123';

      if (isAdmin) {
        const user = {
          role: 'Admin',
          name: 'Dr. B. Balaram',
          title: 'Administrative Officer & Campus Operations',
          department: 'Central Administration Block, Vastunagar',
          email: 'admin@cvr.ac.in'
        };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
        showToast('Login Successful', 'Authenticated as CVR Administrative Officer. Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 350);
        return;
      }

      if (isSecurity) {
        const user = {
          role: 'Security',
          name: 'Officer M. Srinivas',
          title: 'Chief Security Officer (Gate 1 Vastunagar)',
          department: 'CVR Campus Security & Access Control',
          email: 'security@cvr.ac.in'
        };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
        showToast('Login Successful', 'Authenticated as Gate 1 Security In-charge. Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'security-dashboard.html';
        }, 350);
        return;
      }

      // Invalid credentials
      if (errorAlert) {
        errorAlert.style.display = 'flex';
        errorMessage.textContent = 'Invalid credentials. Please use the CVR prototype demo accounts shown below (admin@cvr.ac.in / security@cvr.ac.in).';
      }
      showToast('Authentication Failed', 'Invalid staff username or password.', 'error');
    }, 350);
  });
});
