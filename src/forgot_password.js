document.addEventListener('DOMContentLoaded', () => { 
   const emailInput = document.getElementById('email'); 
   const currentPasswordInput = 
document.getElementById('current-password'); 
   const newPasswordInput = document.getElementById('new-password'); 
   const cancelBtn = document.getElementById('cancel-btn'); 
   const saveBtn = document.getElementById('save-btn'); 
   const errorMsg = document.getElementById('forgot-error'); 
 
   const newPasswordError = document.getElementById('new-password-error'); 
 
   /** 
    * Validate password strength. 
    * Rules: min 8 chars, at least 1 uppercase, 1 lowercase, 1 special 
character. 
    */ 
   function validatePassword(password) { 
       if (!password) { 
           return 'Please enter a password.'; 
       } 
 
       const errors = []; 
 
       if (password.length < 8) { 
           errors.push('at least 8 characters'); 
       } 
       if (!/[A-Z]/.test(password)) { 
           errors.push('an uppercase letter'); 
       } 
       if (!/[a-z]/.test(password)) { 
           errors.push('a lowercase letter'); 
       } 
       if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) { 
           errors.push('a special character'); 
       } 
 
       if (errors.length > 0) { 
           return 'Password must contain ' + errors.join(', ') + '.'; 
       } 
 
       return null; 
   } 
 
   /** 
    * Handle Save: validate and update password. 
    */ 
   function handleSave() { 
       const email = emailInput.value.trim(); 
       const currentPassword = currentPasswordInput.value; 
       const newPassword = newPasswordInput.value; 
 
       // Clear previous errors 
       errorMsg.classList.remove('visible'); 
       newPasswordError.textContent = ''; 
       newPasswordError.classList.remove('visible'); 
 
       // Validation: empty fields 
       if (!email || !currentPassword || !newPassword) { 
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
 
       // Validate new password strength 
       const passErr = validatePassword(newPassword); 
       if (passErr) { 
           newPasswordError.textContent = passErr; 
           newPasswordError.classList.add('visible'); 
           newPasswordInput.focus(); 
           return; 
       } 
 
       // Check current credentials 
       const credentials = getCredentials(); 
 
       if (email !== credentials.email) { 
           errorMsg.textContent = 'Email does not match our records.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       if (currentPassword !== credentials.password) { 
           errorMsg.textContent = 'Current password is incorrect.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       if (newPassword === currentPassword) { 
           errorMsg.textContent = 'New password must be different from current password.'; 
           errorMsg.classList.add('visible'); 
           return; 
       } 
 
       // Update password 
       credentials.password = newPassword; 
       updateCredentials(credentials); 
 
       showToast('Password updated successfully!', 'success'); 
 
       setTimeout(() => { 
           navigateTo('../index.html'); 
       }, 1500); 
   } 
 
   /** 
    * Handle Cancel: go back to login page. 
    */ 
   function handleCancel() { 
       navigateTo('../index.html'); 
   } 
 
   // Real-time validation for new password 
   newPasswordInput.addEventListener('input', () => { 
       errorMsg.classList.remove('visible'); 
       const password = newPasswordInput.value; 
       if (password) { 
           const err = validatePassword(password); 
           if (err) { 
               newPasswordError.textContent = err; 
               newPasswordError.classList.add('visible'); 
           } else { 
               newPasswordError.textContent = ''; 
               newPasswordError.classList.remove('visible'); 
           } 
       } else { 
           newPasswordError.textContent = ''; 
           newPasswordError.classList.remove('visible'); 
       } 
   }); 
 
   // Event listeners 
   saveBtn.addEventListener('click', handleSave); 
   cancelBtn.addEventListener('click', handleCancel); 
 
   // Enter key support 
   newPasswordInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') handleSave(); 
   }); 
 
   // Clear main error on input 
   emailInput.addEventListener('input', () => 
errorMsg.classList.remove('visible')); 
   currentPasswordInput.addEventListener('input', () => 
errorMsg.classList.remove('visible')); 
 
   // Focus email field on load 
   emailInput.focus(); 
}); 