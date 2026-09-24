// MedAssist Main Application Logic — Clinic Operations & Patient Care Portal

// --- Constants & Config ---
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

// --- Clinical Departments Data (Matching Department Model) ---
const DEPARTMENTS_DATA = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "In-clinic heart diagnostics, ECG interpretation, and cardiovascular care management.",
    specialistsCount: 1,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Clinical neurological evaluations, cognitive assessments, and neurological therapy.",
    specialistsCount: 1,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Child wellness checks, developmental monitoring, and primary pediatric treatment.",
    specialistsCount: 1,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>`
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Musculoskeletal examinations, joint assessments, fracture reviews, and mobility care.",
    specialistsCount: 1,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>`
  },
  {
    id: "dermatology",
    name: "Dermatology",
    description: "Clinical skin evaluations, biopsies, chronic dermatitis management, and care plans.",
    specialistsCount: 1,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  },
  {
    id: "general",
    name: "General Medicine",
    description: "Comprehensive primary health evaluations, chronic condition tracking, and preventative exams.",
    specialistsCount: 1,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>`
  }
];

// --- Doctors Data (Directly Aligned with Doctor Schema & Model) ---
const DOCTORS_DATA = [
  {
    id: 1,
    user: {
      name: "Dr. Evelyn Vance",
      email: "e.vance@medassist.clinic"
    },
    department: {
      id: "cardiology",
      name: "Cardiology"
    },
    specialization: "Interventional Cardiology",
    qualification: "MD, FACC - Harvard Medical School",
    experienceYears: 14,
    consultationFee: 120,
    languages: ["English", "Spanish"],
    licenseNumber: "MD-849201",
    isAvailable: true,
    initials: "EV"
  },
  {
    id: 2,
    user: {
      name: "Dr. Marcus Thorne",
      email: "m.thorne@medassist.clinic"
    },
    department: {
      id: "neurology",
      name: "Neurology"
    },
    specialization: "Clinical Neurology & Neurophysiology",
    qualification: "MD, PhD - Johns Hopkins University",
    experienceYears: 18,
    consultationFee: 140,
    languages: ["English", "German"],
    licenseNumber: "MD-739102",
    isAvailable: true,
    initials: "MT"
  },
  {
    id: 3,
    user: {
      name: "Dr. Sophia Chen",
      email: "s.chen@medassist.clinic"
    },
    department: {
      id: "pediatrics",
      name: "Pediatrics"
    },
    specialization: "General Pediatrics & Child Health",
    qualification: "MD - Stanford University School of Medicine",
    experienceYears: 10,
    consultationFee: 95,
    languages: ["English", "Mandarin"],
    licenseNumber: "MD-928411",
    isAvailable: true,
    initials: "SC"
  },
  {
    id: 4,
    user: {
      name: "Dr. Julian Ross",
      email: "j.ross@medassist.clinic"
    },
    department: {
      id: "orthopedics",
      name: "Orthopedics"
    },
    specialization: "Orthopedic Surgery & Sports Medicine",
    qualification: "MS, Ortho, FRCS - Oxford University",
    experienceYears: 12,
    consultationFee: 110,
    languages: ["English"],
    licenseNumber: "MD-618402",
    isAvailable: true,
    initials: "JR"
  },
  {
    id: 5,
    user: {
      name: "Dr. Amara Patel",
      email: "a.patel@medassist.clinic"
    },
    department: {
      id: "dermatology",
      name: "Dermatology"
    },
    specialization: "Clinical & Diagnostic Dermatology",
    qualification: "MD, FAAD - Columbia University",
    experienceYears: 9,
    consultationFee: 100,
    languages: ["English", "Hindi"],
    licenseNumber: "MD-529184",
    isAvailable: true,
    initials: "AP"
  },
  {
    id: 6,
    user: {
      name: "Dr. David Kim",
      email: "d.kim@medassist.clinic"
    },
    department: {
      id: "general",
      name: "General Medicine"
    },
    specialization: "Internal & Preventive Medicine",
    qualification: "MD - UCLA David Geffen School of Medicine",
    experienceYears: 16,
    consultationFee: 80,
    languages: ["English", "Korean"],
    licenseNumber: "MD-410928",
    isAvailable: true,
    initials: "DK"
  }
];

// --- State Management ---
let currentUser = JSON.parse(localStorage.getItem('medassist_user') || 'null');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initAuthUI();
  initDepartmentsSection();
  initDoctorsDirectory();
  initBookingModal();
  initAuthModal();
  initStaffApplicationModal();
  initFAQAccordion();
  initStatsCounters();
});

// --- Theme Management ---
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('medassist_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('medassist_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

// --- Header & Navigation ---
function initHeader() {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

// --- Auth Modal Switcher ---
function setAuthActiveTab(tab) {
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const otpContainer = document.getElementById('otp-verification-container');
  const authTabs = document.querySelector('.auth-tabs');

  if (authTabs) authTabs.style.display = 'flex';
  if (otpContainer) otpContainer.style.display = 'none';

  if (tab === 'register') {
    if (loginTab) loginTab.classList.remove('active');
    if (registerTab) registerTab.classList.add('active');
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
  } else {
    if (registerTab) registerTab.classList.remove('active');
    if (loginTab) loginTab.classList.add('active');
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
  }
}

window.openAuthModal = function(tab = 'login') {
  setAuthActiveTab(tab);
  window.openModal('auth-modal');
};

// --- Auth UI Management (Separate Login & Register Buttons in Header) ---
function initAuthUI() {
  const authContainer = document.getElementById('header-auth-container');
  if (!authContainer) return;

  if (currentUser && currentUser.name) {
    authContainer.innerHTML = `
      <div class="user-pill-badge" id="header-user-pill">
        <div class="user-avatar-circle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span class="user-name-text">${currentUser.name.split(' ')[0]}</span>
        <button id="header-logout-btn" class="sign-out-link" title="Sign Out" aria-label="Sign Out">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          <span>Sign Out</span>
        </button>
      </div>
    `;
    const logoutBtn = document.getElementById('header-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLogout();
      };
    }
  } else {
    authContainer.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" id="header-signin-btn" class="btn btn-outline" style="padding: 8px 18px; font-size: 0.85rem;">
          Login
        </button>
        <button type="button" id="header-register-btn" class="btn btn-primary" style="padding: 8px 20px; font-size: 0.85rem;">
          Register
        </button>
      </div>
    `;

    const signInBtn = document.getElementById('header-signin-btn');
    const registerBtn = document.getElementById('header-register-btn');

    if (signInBtn) {
      signInBtn.onclick = (e) => {
        e.preventDefault();
        window.openAuthModal('login');
      };
    }

    if (registerBtn) {
      registerBtn.onclick = (e) => {
        e.preventDefault();
        window.openAuthModal('register');
      };
    }
  }
}

async function handleLogout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  } catch (err) {
    console.warn('Backend logout call skipped:', err);
  }
  localStorage.removeItem('medassist_user');
  currentUser = null;
  initAuthUI();
  showToast('You have been signed out successfully.', 'info');
}

// --- Browse Doctors by Department Section ---
function initDepartmentsSection() {
  const container = document.getElementById('departments-grid');
  if (!container) return;

  container.innerHTML = DEPARTMENTS_DATA.map(dept => `
    <div class="glass-card department-card" onclick="window.selectDepartmentFilter('${dept.id}')">
      <div class="dept-card-icon">${dept.icon}</div>
      <h3 class="dept-card-title">${dept.name}</h3>
      <p class="dept-card-desc">${dept.description}</p>
      <div class="dept-card-footer">
        <span class="dept-specialist-count">${dept.specialistsCount} Doctor${dept.specialistsCount > 1 ? 's' : ''} On Duty</span>
        <span class="dept-explore-btn">
          View Specialists
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
      </div>
    </div>
  `).join('');
}

window.selectDepartmentFilter = function(deptId) {
  const deptBtn = document.querySelector(`.dept-btn[data-dept="${deptId}"]`);
  if (deptBtn) {
    deptBtn.click();
  }
  const doctorsSection = document.getElementById('doctors');
  if (doctorsSection) {
    doctorsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- Doctors Directory (Driven strictly by Doctor Schema Model) ---
function initDoctorsDirectory() {
  const container = document.getElementById('doctors-grid');
  const filterBtns = document.querySelectorAll('.dept-btn');

  if (!container) return;

  function renderDoctors(department = 'all') {
    const filtered = department === 'all' 
      ? DOCTORS_DATA 
      : DOCTORS_DATA.filter(d => d.department.id === department);

    container.innerHTML = filtered.map(doc => `
      <div class="glass-card doctor-card">
        <div class="doc-card-header">
          <div class="doc-avatar-wrap">
            <div class="doc-avatar-inner">${doc.initials}</div>
            <div class="doc-status-badge ${doc.isAvailable ? 'available' : ''}" title="${doc.isAvailable ? 'In Clinic Today' : 'Off Duty'}"></div>
          </div>
          <div class="doc-status-pill ${doc.isAvailable ? 'available' : ''}">
            <span class="pulse-dot" style="background: ${doc.isAvailable ? '#10b981' : '#94a3b8'};"></span>
            ${doc.isAvailable ? 'In Clinic Today' : 'Off Duty'}
          </div>
        </div>

        <h4 class="doctor-name">${doc.user.name}</h4>
        <div class="doctor-specialty">${doc.specialization}</div>
        <div class="doctor-dept-badge">${doc.department.name}</div>
        
        <div class="doctor-qual">${doc.qualification}</div>

        <div class="doctor-meta-list">
          <div class="doc-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${doc.experienceYears} Yrs Experience</span>
          </div>
          <div class="doc-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>Languages: ${doc.languages.join(', ')}</span>
          </div>
        </div>

        <div class="doctor-card-bottom">
          <div>
            <span class="fee-label">Consultation Fee</span>
            <span class="doctor-fee">$${doc.consultationFee}</span>
          </div>
          <button class="btn btn-primary" style="padding: 8px 18px; font-size: 0.85rem;" onclick="window.bookDoctorById(${doc.id})">
            Book Visit
          </button>
        </div>
      </div>
    `).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDoctors(btn.dataset.dept);
    });
  });

  renderDoctors('all');
}

window.bookDoctorById = function(id) {
  const doc = DOCTORS_DATA.find(d => d.id === id);
  if (doc) {
    openBookingModalForDoctor(doc);
  }
};

// --- In-Clinic Booking Modal Flow ---
function initBookingModal() {
  const form = document.getElementById('booking-form');
  const doctorSelect = document.getElementById('booking-doctor-select');

  if (!form || !doctorSelect) return;

  // Populate doctor select options from data model
  doctorSelect.innerHTML = DOCTORS_DATA.map(d => `
    <option value="${d.id}">${d.user.name} (${d.department.name} - ${d.specialization}) — $${d.consultationFee}</option>
  `).join('');

  // Handle slot selection
  const slotBtns = document.querySelectorAll('.slot-chip');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => {
        b.style.borderColor = 'var(--border-subtle)';
        b.style.background = 'var(--bg-surface)';
        b.style.color = 'var(--text-secondary)';
      });
      btn.style.borderColor = 'var(--primary)';
      btn.style.background = 'rgba(14, 165, 233, 0.2)';
      btn.style.color = '#38bdf8';
      btn.dataset.selected = "true";
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const docId = parseInt(doctorSelect.value);
    const doctor = DOCTORS_DATA.find(d => d.id === docId) || DOCTORS_DATA[0];
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Confirming Appointment...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Confirm Appointment';
      closeModal('booking-modal');
      
      const refId = 'MED-' + Math.floor(100000 + Math.random() * 900000);
      const doctorName = doctor.user ? doctor.user.name : doctor.name;
      showToast(`Clinic appointment scheduled with ${doctorName}! Ref: ${refId}`, 'success');
      form.reset();
    }, 900);
  });
}

function openBookingModalForDoctor(doc) {
  const doctorSelect = document.getElementById('booking-doctor-select');
  if (doctorSelect && doc) {
    doctorSelect.value = doc.id;
  }
  openModal('booking-modal');
}

// --- Auth Modal & Backend Integration ---
function initAuthModal() {
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (!loginTab || !registerTab) return;

  loginTab.addEventListener('click', () => {
    setAuthActiveTab('login');
  });

  registerTab.addEventListener('click', () => {
    setAuthActiveTab('register');
  });

  // State for pending phone verification
  let pendingRegistration = { name: '', email: '', phone: '', devOtp: '' };
  let otpCountdownInterval = null;

  const otpContainer = document.getElementById('otp-verification-container');
  const otpForm = document.getElementById('otp-form');
  const otpBoxes = document.querySelectorAll('.otp-input-box');
  const otpPhoneDisplay = document.getElementById('otp-phone-display');
  const otpDevHint = document.getElementById('otp-dev-hint');
  const otpDevCode = document.getElementById('otp-dev-code');
  const otpTimerText = document.getElementById('otp-timer-text');
  const otpCountdownEl = document.getElementById('otp-countdown');
  const btnResendOtp = document.getElementById('btn-resend-otp');
  const btnBackToRegister = document.getElementById('btn-back-to-register');
  const authTabs = document.querySelector('.auth-tabs');

  function startOtpCountdown(seconds = 60) {
    if (otpCountdownInterval) clearInterval(otpCountdownInterval);
    let remaining = seconds;
    if (otpTimerText) otpTimerText.style.display = 'inline';
    if (btnResendOtp) btnResendOtp.style.display = 'none';
    if (otpCountdownEl) otpCountdownEl.innerText = remaining;

    otpCountdownInterval = setInterval(() => {
      remaining -= 1;
      if (otpCountdownEl) otpCountdownEl.innerText = remaining;
      if (remaining <= 0) {
        clearInterval(otpCountdownInterval);
        if (otpTimerText) otpTimerText.style.display = 'none';
        if (btnResendOtp) btnResendOtp.style.display = 'inline-block';
      }
    }, 1000);
  }

  function showOtpVerificationStep(phone, devOtp, name) {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (authTabs) authTabs.style.display = 'none';
    if (otpContainer) otpContainer.style.display = 'block';

    if (otpPhoneDisplay) otpPhoneDisplay.innerText = phone;

    if (devOtp && otpDevHint && otpDevCode) {
      otpDevHint.style.display = 'block';
      otpDevCode.innerText = devOtp;
    } else if (otpDevHint) {
      otpDevHint.style.display = 'none';
    }

    otpBoxes.forEach(box => {
      box.value = '';
      box.classList.remove('filled', 'error');
    });

    if (otpBoxes[0]) {
      setTimeout(() => otpBoxes[0].focus(), 100);
    }

    startOtpCountdown(60);
  }

  // OTP Digits interaction (Auto-focus next, backspace support, paste support)
  otpBoxes.forEach((box, idx) => {
    box.addEventListener('input', (e) => {
      box.value = box.value.replace(/\D/g, '');
      if (box.value) {
        box.classList.add('filled');
        if (idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        } else {
          // Check if all filled
          const allFilled = Array.from(otpBoxes).every(b => b.value.length > 0);
          if (allFilled && otpForm) {
            otpForm.requestSubmit();
          }
        }
      } else {
        box.classList.remove('filled');
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (!box.value && idx > 0) {
          otpBoxes[idx - 1].value = '';
          otpBoxes[idx - 1].classList.remove('filled');
          otpBoxes[idx - 1].focus();
        } else {
          box.value = '';
          box.classList.remove('filled');
        }
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        otpBoxes[idx - 1].focus();
      } else if (e.key === 'ArrowRight' && idx < otpBoxes.length - 1) {
        otpBoxes[idx + 1].focus();
      }
    });

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const digits = pasted.replace(/\D/g, '').slice(0, 6);
      digits.split('').forEach((digit, i) => {
        if (otpBoxes[i]) {
          otpBoxes[i].value = digit;
          otpBoxes[i].classList.add('filled');
        }
      });
      if (digits.length === 6 && otpForm) {
        otpBoxes[5].focus();
        otpForm.requestSubmit();
      } else if (digits.length > 0 && digits.length < 6) {
        otpBoxes[digits.length]?.focus();
      }
    });
  });

  // Back to registration from OTP
  if (btnBackToRegister) {
    btnBackToRegister.addEventListener('click', () => {
      if (otpCountdownInterval) clearInterval(otpCountdownInterval);
      setAuthActiveTab('register');
    });
  }

  // Resend OTP
  if (btnResendOtp) {
    btnResendOtp.addEventListener('click', async () => {
      btnResendOtp.disabled = true;
      btnResendOtp.innerText = 'Sending...';

      try {
        const response = await fetch(`${API_BASE}/auth/resend-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: pendingRegistration.phone })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          startOtpCountdown(60);
          showToast(data.message || 'New verification code sent to your mobile phone!', 'success');
          if (data.data?.devOtp) {
            pendingRegistration.devOtp = data.data.devOtp;
            if (otpDevCode) otpDevCode.innerText = data.data.devOtp;
            if (otpDevHint) otpDevHint.style.display = 'block';
          }
        } else {
          showToast(data.message || 'Failed to resend code', 'error');
        }
      } catch (err) {
        console.warn('Resend OTP offline fallback:', err);
        const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
        pendingRegistration.devOtp = fallbackOtp;
        if (otpDevCode) otpDevCode.innerText = fallbackOtp;
        if (otpDevHint) otpDevHint.style.display = 'block';
        startOtpCountdown(60);
        showToast(`New Demo OTP sent: ${fallbackOtp}`, 'info');
      } finally {
        btnResendOtp.disabled = false;
        btnResendOtp.innerText = 'Resend OTP';
      }
    });
  }

  // OTP Form Submit
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredOtp = Array.from(otpBoxes).map(b => b.value.trim()).join('');

      if (enteredOtp.length !== 6) {
        showToast('Please enter all 6 digits of the OTP code', 'error');
        otpBoxes.forEach(b => { if (!b.value) b.classList.add('error'); });
        setTimeout(() => otpBoxes.forEach(b => b.classList.remove('error')), 600);
        return;
      }

      const verifyBtn = document.getElementById('btn-verify-otp');
      if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerText = 'Verifying Code...';
      }

      try {
        const response = await fetch(`${API_BASE}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            phone: pendingRegistration.phone,
            otp: enteredOtp
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (otpCountdownInterval) clearInterval(otpCountdownInterval);
          currentUser = data.data.user;
          localStorage.setItem('medassist_user', JSON.stringify(currentUser));
          initAuthUI();
          closeModal('auth-modal');
          showToast(`Mobile verified! Welcome to MedAssist, ${currentUser.name}!`, 'success');
          registerForm.reset();
          otpForm.reset();
          setAuthActiveTab('login');
        } else {
          showToast(data.message || 'Incorrect verification code. Please try again.', 'error');
          otpBoxes.forEach(b => b.classList.add('error'));
          setTimeout(() => otpBoxes.forEach(b => b.classList.remove('error')), 800);
        }
      } catch (err) {
        console.warn('Verify OTP offline fallback:', err);
        // Fallback for offline demo mode
        if (otpCountdownInterval) clearInterval(otpCountdownInterval);
        currentUser = {
          name: pendingRegistration.name || 'Verified Patient',
          email: pendingRegistration.email,
          phone: pendingRegistration.phone,
          role: 'PATIENT',
          isPhoneVerified: true
        };
        localStorage.setItem('medassist_user', JSON.stringify(currentUser));
        initAuthUI();
        closeModal('auth-modal');
        showToast(`Mobile verified! Welcome, ${currentUser.name}! (Demo Mode)`, 'success');
        registerForm.reset();
        otpForm.reset();
        setAuthActiveTab('login');
      } finally {
        if (verifyBtn) {
          verifyBtn.disabled = false;
          verifyBtn.innerText = 'Verify Mobile & Complete Registration';
        }
      }
    });
  }

  // Login Submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = loginForm.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.innerText = 'Signing in...';

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        currentUser = data.data.user;
        localStorage.setItem('medassist_user', JSON.stringify(currentUser));
        initAuthUI();
        closeModal('auth-modal');
        showToast(`Welcome back, ${currentUser.name}!`, 'success');
        loginForm.reset();
      } else if (data.requiresPhoneVerification) {
        pendingRegistration = {
          email,
          phone: data.phone,
          devOtp: data.devOtp
        };
        showOtpVerificationStep(data.phone, data.devOtp);
        showToast(data.message || 'Please verify your mobile number to complete login.', 'info');
      } else {
        showToast(data.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback demo login
      currentUser = { name: email.split('@')[0], email, role: 'PATIENT', isPhoneVerified: true };
      localStorage.setItem('medassist_user', JSON.stringify(currentUser));
      initAuthUI();
      closeModal('auth-modal');
      showToast(`Signed in as ${currentUser.name} (Demo Mode)`, 'success');
    } finally {
      btn.disabled = false;
      btn.innerText = 'Sign In';
    }
  });

  // Register Submit (Triggers OTP verification step)
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value.trim();
    const btn = registerForm.querySelector('button[type="submit"]');

    if (!phone) {
      showToast('Please enter your mobile phone number for OTP verification', 'error');
      document.getElementById('reg-phone')?.focus();
      return;
    }

    btn.disabled = true;
    btn.innerText = 'Sending Verification OTP...';

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        pendingRegistration = {
          name,
          email,
          phone,
          devOtp: data.data?.devOtp
        };
        showOtpVerificationStep(phone, data.data?.devOtp, name);
        showToast(data.message || `Verification OTP sent to ${phone}`, 'success');
      } else {
        showToast(data.message || 'Registration failed. Check phone and password requirements.', 'error');
      }
    } catch (err) {
      console.error('Registration error (Demo mode fallback):', err);
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      pendingRegistration = {
        name,
        email,
        phone,
        devOtp: mockOtp
      };
      showOtpVerificationStep(phone, mockOtp, name);
      showToast(`Verification code sent to ${phone}! (Demo OTP: ${mockOtp})`, 'info');
    } finally {
      btn.disabled = false;
      btn.innerText = 'Create Patient Account & Get OTP';
    }
  });
}

// --- Staff Recruitment Application Modal (Driven by StaffApplication Model) ---
function initStaffApplicationModal() {
  const form = document.getElementById('staff-application-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Submitting Application...';

    const payload = {
      name: document.getElementById('staff-name').value.trim(),
      email: document.getElementById('staff-email').value.trim(),
      phone: document.getElementById('staff-phone').value.trim(),
      requestedRole: document.getElementById('staff-role').value,
      qualification: document.getElementById('staff-qualification').value.trim(),
      experience: document.getElementById('staff-experience').value.trim(),
      specialization: document.getElementById('staff-specialization').value.trim(),
      message: document.getElementById('staff-message').value.trim()
    };

    try {
      const res = await fetch(`${API_BASE}/staff-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Application submitted successfully! Our clinic administrator will review your credentials.', 'success');
        closeModal('staff-modal');
        form.reset();
      } else {
        throw new Error(data.message || 'Submission error');
      }
    } catch (err) {
      // Demo fallback simulation
      const ref = 'APP-' + Math.floor(100000 + Math.random() * 900000);
      showToast(`Application received! Ref: ${ref}. Our clinic administrator will contact you at ${payload.email}.`, 'success');
      closeModal('staff-modal');
      form.reset();
    } finally {
      btn.disabled = false;
      btn.innerText = 'Submit Application';
    }
  });
}

// --- FAQ Accordion ---
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// --- Stats Counters Animation ---
function initStatsCounters() {
  const statElements = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statElements.forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          let count = 0;
          const duration = 1500;
          const increment = target / (duration / 25);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              el.innerText = target.toLocaleString() + suffix;
              clearInterval(timer);
            } else {
              el.innerText = Math.floor(count).toLocaleString() + suffix;
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

// --- Global Modal Helpers ---
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

// --- Toast System ---
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' 
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
    : type === 'error'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
