document.addEventListener('DOMContentLoaded', () => { 
   const formTitle = document.getElementById('form-title'); 
   const nameInput = document.getElementById('emp-name'); 
   const emailInput = document.getElementById('emp-email'); 
    const departmentSelect = document.getElementById('emp-dept'); 
   const salaryInput = document.getElementById('emp-salary'); 
   const cancelBtn = document.getElementById('cancel-btn'); 
   const saveBtn = document.getElementById('save-btn'); 
   const errorMsg = document.getElementById('record-error'); 
 
   // Parse URL parameters 
   const urlParams = new URLSearchParams(window.location.search); 
   const mode = urlParams.get('mode') || 'add'; 
   const employeeId = urlParams.get('id'); 
 
   // Set form title based on mode 
   if (mode === 'modify') { 
       formTitle.textContent = 'Modify Employee'; 
       document.title = 'Employee Portal - Modify Record'; 
 
       if (employeeId) { 
           const employee = getEmployeeById(employeeId); 
           if (employee) { 
               nameInput.value = employee.name; 
               emailInput.value = employee.email; 
               departmentSelect.value = employee.department; 
               salaryInput.value = employee.salary; 
           } else { 
               showToast('Employee record not found.', 'error'); 
               setTimeout(() => navigateTo('dashboard.html'), 1500); 
               return; 
           } 
       } 
   } else { 
       formTitle.textContent = 'Add Employee'; 
       document.title = 'Employee Portal - Add Record'; 
   } 
 
   /** 
    * Handle Save: validate and save the employee record. 
    */ 
   function handleSave() { 
       const name = nameInput.value.trim(); 
       const email = emailInput.value.trim(); 
       const department = departmentSelect.value; 
       const salary = salaryInput.value.trim(); 
 
       // Clear previous error 
       errorMsg.classList.remove('visible'); 
 
       // Validation: empty fields 
       if (!name || !email || !department || !salary) { 
           errorMsg.textContent = 'Please fill in all fields.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       // Validate email format 
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
       if (!emailRegex.test(email)) { 
           errorMsg.textContent = 'Please enter a valid email address.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       // Validate salary is a number 
       if (isNaN(salary) || Number(salary) <= 0) { 
           errorMsg.textContent = 'Please enter a valid salary amount.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       const employees = getEmployees(); 
 
       // Duplicate check: prevent adding a record with the same email 
        const duplicate = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase() && String(emp.id) !== String(employeeId)); 
       if (duplicate) { 
           errorMsg.textContent = 'An employee with this email already exists.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       if (mode === 'modify' && employeeId) { 
           // Update existing record 
            const index = employees.findIndex(emp => String(emp.id) === String(employeeId)); 
           if (index !== -1) { 
               employees[index] = { 
                   ...employees[index], 
                   name, 
                   email, 
                   department, 
                   salary 
               }; 
               saveEmployees(employees); 
               showToast('Record has been updated successfully!', 'success'); 
           } 
       } else { 
           // Add new record 
           const newEmployee = { 
               id: generateId(), 
               name, 
               email, 
               department, 
               salary 
           }; 
           employees.push(newEmployee); 
           saveEmployees(employees); 
           showToast('Record has been saved successfully!', 'success'); 
       } 
 
       setTimeout(() => { 
           navigateTo('dashboard.html'); 
       }, 1500); 
   } 
 
   /** 
    * Handle Cancel: go back to dashboard. 
    */ 
   function handleCancel() { 
       navigateTo('dashboard.html'); 
   } 
 
   // Event listeners 
   saveBtn.addEventListener('click', handleSave); 
   cancelBtn.addEventListener('click', handleCancel); 
 
   // Enter key support on last field 
   salaryInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') handleSave(); 
   }); 
 
   // Clear error on input 
   [nameInput, emailInput, salaryInput].forEach(input => { 
       input.addEventListener('input', () => errorMsg.classList.remove('visible')); 
   }); 
   departmentSelect.addEventListener('change', () => errorMsg.classList.remove('visible')); 
 
   // Focus name field on load 
   nameInput.focus(); 
});