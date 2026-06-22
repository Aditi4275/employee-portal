let selectedRowId = null; 
 
document.addEventListener('DOMContentLoaded', async () => { 
   const tbody = document.getElementById('employee-tbody'); 
   const emptyState = document.getElementById('empty-state'); 
   const searchInput = document.getElementById('search-input'); 
   const addBtn = document.getElementById('add-btn'); 
   const modifyBtn = document.getElementById('modify-btn'); 
   const deleteBtn = document.getElementById('delete-btn'); 
   const backBtn = document.getElementById('back-btn'); 
   const logoutBtn = document.getElementById('logout-btn'); 
 
   // Load employee data (from JSON on first load, then localStorage) 
   await loadEmployeeData(); 
 
   
   function renderTable(filter = '') { 
       const employees = getEmployees(); 
       tbody.innerHTML = ''; 
       selectedRowId = null; 
 
       const filtered = filter 
           ? employees.filter(emp => 
               emp.name.toLowerCase().includes(filter.toLowerCase()) || 
               emp.email.toLowerCase().includes(filter.toLowerCase()) || 
               emp.department.toLowerCase().includes(filter.toLowerCase()) || 
               emp.salary.toString().includes(filter) 
           ) 
           : employees; 
 
       if (filtered.length === 0) { 
           emptyState.style.display = 'block'; 
           document.getElementById('employee-table').style.display = 'none'; 
           return; 
       } 
 
       emptyState.style.display = 'none'; 
       document.getElementById('employee-table').style.display = 'table'; 
 
       filtered.forEach(emp => { 
           const row = document.createElement('tr'); 
           row.setAttribute('data-id', emp.id); 
           row.innerHTML = ` 
               <td>${escapeHtml(emp.name)}</td> 
               <td>${escapeHtml(emp.email)}</td> 
               <td>${escapeHtml(emp.department)}</td> 
               <td>${escapeHtml(emp.salary)}</td> 
           `; 
 
           // Row click to select 
           row.addEventListener('click', () => { 
               // Deselect previous 
               const prevSelected = tbody.querySelector('.selected'); 
               if (prevSelected) 
prevSelected.classList.remove('selected'); 
 
               // Select this row 
               row.classList.add('selected'); 
               selectedRowId = emp.id; 
           }); 
 
           tbody.appendChild(row); 
       }); 
   } 
 
   /** 
    * Escape HTML to prevent XSS. 
    */ 
   function escapeHtml(text) { 
       const div = document.createElement('div'); 
       div.textContent = text; 
       return div.innerHTML; 
   } 
 
   // ===== Event Listeners ===== 
 
   // Search / Find 
   searchInput.addEventListener('input', (e) => { 
       renderTable(e.target.value); 
   }); 
 
   // Add button 
   addBtn.addEventListener('click', () => { 
       navigateTo('add-record.html?mode=add'); 
   }); 
 
   // Modify button 
   modifyBtn.addEventListener('click', () => { 
       if (!selectedRowId) { 
           showToast('Please select a record to modify.', 'error'); 
           return; 
       } 
       navigateTo(`add-record.html?mode=modify&id=${selectedRowId}`); 
   }); 
 
   // Delete button 
   deleteBtn.addEventListener('click', () => { 
       if (!selectedRowId) { 
           showToast('Please select a record to delete.', 'error'); 
           return; 
       } 
 
       const employees = getEmployees(); 
       const employee = employees.find(emp => emp.id === selectedRowId); 
 
       if (employee) { 
           const updated = employees.filter(emp => emp.id !== selectedRowId); 
           saveEmployees(updated); 
           showToast(`Record for "${employee.name}" deleted successfully.`, 'success'); 
           renderTable(searchInput.value); 
       } 
   }); 
 
   // Back button 
   backBtn.addEventListener('click', () => { 
       window.history.back(); 
   }); 
 
   // Logout button 
   logoutBtn.addEventListener('click', () => { 
       sessionStorage.removeItem('loggedIn'); 
       showToast('Logged out successfully.', 'success', 1500); 
       setTimeout(() => { 
           navigateTo('../index.html'); 
       }, 1000); 
   }); 
 
   // Initial render 
   renderTable(); 
});