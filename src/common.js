function navigateTo(path) {
  window.location.href = path;
}

function showToast(message, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function getCredentials() {
  return JSON.parse(localStorage.getItem('credentials')) || {};
}

function updateCredentials(creds) {
  localStorage.setItem('credentials', JSON.stringify(creds));
}

function getEmployees() {
  return JSON.parse(localStorage.getItem('employees')) || [];
}

function saveEmployees(employees) {
  localStorage.setItem('employees', JSON.stringify(employees));
}

function getEmployeeById(id) {
  return getEmployees().find(emp => emp.id === id) || null;
}

async function loadEmployeeData() {
  if (localStorage.getItem('employees')) return;

  const isSubPage = !window.location.pathname.endsWith('index.html');
  const dataFile = isSubPage ? '../data/employee.json' : 'data/employee.json';

  try {
    const res = await fetch(dataFile);
    if (!res.ok) throw new Error('Failed to fetch');
    const employees = await res.json();
    saveEmployees(employees);
  } catch {
    saveEmployees([]);
  }
}
