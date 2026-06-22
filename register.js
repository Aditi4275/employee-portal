document.addEventListener('DOMContentLoaded', () => { 
   const nameInput = document.getElementById('name'); 
   const emailInput = document.getElementById('email-id'); 
   const passwordInput = document.getElementById('password'); 
   const registerBtn = document.getElementById('register-btn'); 
   const registerError = document.getElementById('register-error'); 
 
   /** Allowed email domains */ 
   const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com']; 
 
   /** 
    * Validate name field. 
    * @param {string} name 
    * @returns {string|null} Error message or null if valid. 
    */ 
   function validateName(name) { 
       if (!name) { 
           return 'Please enter your name.'; 
       } 
       if (name.length < 2) { 
           return 'Name must be at least 2 characters.'; 
       } 
       return null; 
   } 
 
   /** 
    * Validate email format and domain. 
    * @param {string} email 
    * @returns {string|null} Error message or null if valid. 
    */ 
   function validateEmail(email) { 
       if (!email) { 
           return 'Please enter your email ID.'; 
       } 
 
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
       if (!emailRegex.test(email)) { 
           return 'Please enter a valid email address.'; 
       } 
 
       const domain = email.split('@')[1].toLowerCase(); 
       if (!ALLOWED_DOMAINS.includes(domain)) { 
           return 'Email must be a Google, Yahoo, or Outlook address.'; 
       } 
 
       return null; 
   } 
 
   /** 
    * Validate password strength. 
    * Rules: min 8 chars, at least 1 uppercase, 1 lowercase, 1 special 
character. 
    * @param {string} password 
    * @returns {string|null} Error message or null if valid. 
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
 
   const nameError = document.getElementById('name-error'); 
   const emailError = document.getElementById('email-error'); 
   const passwordError = document.getElementById('password-error'); 
 
   /** 
    * Show inline error under a field. 
    */ 
   function showFieldError(errorEl, message) { 
       errorEl.textContent = message; 
       errorEl.classList.add('visible'); 
   } 
 
   /** 
    * Clear inline error under a field. 
    */ 
   function clearFieldError(errorEl) { 
       errorEl.textContent = ''; 
       errorEl.classList.remove('visible'); 
   } 
 
   /** 
    * Show general error message. 
    */ 
   function showError(message) { 
       registerError.textContent = message; 
       registerError.classList.add('visible'); 
   } 
 
   /** 
    * Clear general error message. 
    */ 
   function clearError() { 
       registerError.textContent = ''; 
       registerError.classList.remove('visible'); 
   } 
 
   /** 
    * Handle registration. 
    */ 
   function handleRegister() { 
       clearError(); 
       clearFieldError(nameError); 
       clearFieldError(emailError); 
       clearFieldError(passwordError); 
 
       const name = nameInput.value.trim(); 
       const email = emailInput.value.trim(); 
       const password = passwordInput.value; 
 
       // Validate name 
       const nameErr = validateName(name); 
       if (nameErr) { 
           showFieldError(nameError, nameErr); 
           nameInput.focus(); 
           return; 
       } 
 
       // Validate email 
       const emailErr = validateEmail(email); 
       if (emailErr) { 
           showFieldError(emailError, emailErr); 
           emailInput.focus(); 
           return; 
       } 
 
       // Validate password 
       const passErr = validatePassword(password); 
       if (passErr) { 
           showFieldError(passwordError, passErr); 
           passwordInput.focus(); 
           return; 
       } 
 
       // Check if email is already registered 
       const existingCreds = getCredentials(); 
       if (email === existingCreds.username || email === existingCreds.email) { 
           showFieldError(emailError, 'This email is already registered. Please login instead.'); 
           return; 
       } 
 
       // Save new credentials 
       updateCredentials({ 
           username: email, 
           password: password, 
           email: email, 
           name: name 
       }); 
 
       showToast('Registration successful! Redirecting to login...', 'success', 2000); 
       setTimeout(() => { 
           navigateTo('../index.html'); 
       }, 1500); 
   } 
 
   // ===== Real-time validation as user types ===== 
 
   nameInput.addEventListener('input', () => { 
       const name = nameInput.value.trim(); 
       clearError(); 
       if (name) { 
           const err = validateName(name); 
           if (err) { 
               showFieldError(nameError, err); 
           } else { 
               clearFieldError(nameError); 
           } 
       } else { 
           clearFieldError(nameError); 
       } 
   }); 
 
   emailInput.addEventListener('input', () => { 
       const email = emailInput.value.trim(); 
       clearError(); 
       if (email) { 
           const err = validateEmail(email); 
           if (err) { 
               showFieldError(emailError, err); 
           } else { 
               clearFieldError(emailError); 
           } 
       } else { 
           clearFieldError(emailError); 
       } 
   }); 
 
   passwordInput.addEventListener('input', () => { 
       const password = passwordInput.value; 
       clearError(); 
       if (password) { 
           const err = validatePassword(password); 
           if (err) { 
               showFieldError(passwordError, err); 
           } else { 
               clearFieldError(passwordError); 
           } 
       } else { 
           clearFieldError(passwordError); 
       } 
   }); 
 
   // Register button click 
   registerBtn.addEventListener('click', handleRegister); 
 
   // Enter key support 
   passwordInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') handleRegister(); 
   }); 
 
   emailInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') passwordInput.focus(); 
   }); 
 
   nameInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') emailInput.focus(); 
   }); 
 
   // Focus name field on load 
   nameInput.focus(); 
});