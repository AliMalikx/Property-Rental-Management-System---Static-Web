// ============================================
//  PROPERTY RENTAL MANAGEMENT SYSTEM
//  Global App JS — Data store & utilities
// ============================================

// ---------- DEFAULT SEED DATA ----------
const SEED = {
  owners: [
    { id: 'OWN001', name: 'Ahmed Khan', phone: '0300-1234567', cnic: '37405-1234567-1', email: 'ahmed@email.com', address: 'House 12, F-7, Islamabad' },
    { id: 'OWN002', name: 'Sara Malik', phone: '0311-9876543', cnic: '35202-9876543-2', email: 'sara@email.com', address: 'Plot 5, DHA Phase 2, Lahore' },
  ],
  properties: [
    { id: 'PROP001', ownerId: 'OWN001', title: 'Green Valley Apartment', location: 'Blue Area', city: 'Islamabad', bedrooms: 3, rent: 45000, status: 'Available' },
    { id: 'PROP002', ownerId: 'OWN002', title: 'DHA Corner House', location: 'Phase 2, Block C', city: 'Lahore', bedrooms: 5, rent: 120000, status: 'Rented' },
    { id: 'PROP003', ownerId: 'OWN001', title: 'Gulshan Studio', location: 'Gulshan-e-Iqbal', city: 'Karachi', bedrooms: 1, rent: 22000, status: 'Available' },
  ],
  tenants: [
    { id: 'TEN001', name: 'Bilal Ahmed', phone: '0333-5554444', cnic: '61101-5554444-3', email: 'bilal@email.com', address: 'Flat 3B, G-11, Islamabad' },
    { id: 'TEN002', name: 'Fatima Noor', phone: '0345-7778888', cnic: '42201-7778888-4', email: 'fatima@email.com', address: 'House 7, Model Town, Lahore' },
  ],
  agreements: [
    { id: 'AGR001', propertyId: 'PROP002', ownerId: 'OWN002', tenantId: 'TEN002', startDate: '2025-01-01', endDate: '2026-01-01', monthlyRent: 120000, status: 'Active' },
  ],
  payments: [
    { id: 'PAY001', tenantId: 'TEN002', propertyId: 'PROP002', amount: 120000, date: '2025-04-01', method: 'Bank Transfer', status: 'Paid' },
    { id: 'PAY002', tenantId: 'TEN001', propertyId: 'PROP001', amount: 45000, date: '2025-03-15', method: 'Cash', status: 'Paid' },
  ]
};

// ---------- DATA STORE ----------
const DB = {
  get(key) {
    const d = localStorage.getItem('prms_' + key);
    return d ? JSON.parse(d) : null;
  },
  set(key, val) { localStorage.setItem('prms_' + key, JSON.stringify(val)); },
  init() {
    ['owners','properties','tenants','agreements','payments'].forEach(k => {
      if (!this.get(k)) this.set(k, SEED[k]);
    });
  }
};

DB.init();

// ---------- AUTH ----------
const AUTH = {
  credentials: { username: 'admin', password: 'admin123' },
  login(u, p) { return u === this.credentials.username && p === this.credentials.password; },
  isLoggedIn() { return sessionStorage.getItem('prms_auth') === 'true'; },
  setLogin() { sessionStorage.setItem('prms_auth', 'true'); },
  logout() { sessionStorage.removeItem('prms_auth'); }
};

// ---------- TOAST ----------
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span><span class="toast-msg">${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ---------- ID GENERATOR ----------
function genId(prefix, list) {
  return prefix + String(list.length + 1).padStart(3, '0');
}

// ---------- MODAL ----------
function confirmModal(title, msg, onConfirm) {
  let overlay = document.getElementById('confirm-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirm-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3 id="cm-title"></h3>
        <p id="cm-msg"></p>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="cm-cancel">Cancel</button>
          <button class="btn btn-danger" id="cm-confirm">Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#cm-cancel').onclick = () => overlay.classList.remove('open');
    overlay.addEventListener('click', e => { if(e.target === overlay) overlay.classList.remove('open'); });
  }
  overlay.querySelector('#cm-title').textContent = title;
  overlay.querySelector('#cm-msg').textContent = msg;
  overlay.querySelector('#cm-confirm').onclick = () => { onConfirm(); overlay.classList.remove('open'); };
  overlay.classList.add('open');
}

// ---------- GUARD (redirect if not logged in) ----------
function requireAuth() {
  if (!AUTH.isLoggedIn()) window.location.href = 'index.html';
}

// ---------- TAB SWITCHER ----------
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

// ---------- LOGOUT ----------
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      AUTH.logout();
      window.location.href = 'index.html';
    });
  }
});