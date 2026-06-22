document.addEventListener('DOMContentLoaded', () => { 
   const emailInput = document.getElementById('email-id'); 
   const passwordInput = document.getElementById('password'); 
   const loginBtn = document.getElementById('login-btn'); 
   const loginError = document.getElementById('login-error'); 
   const emailError = document.getElementById('email-error'); 
   const passwordError = document.getElementById('password-error'); 
 
   /** Allowed email domains */ 
   const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com']; 
 
   /** 
    * Validate email format and domain (must be gmail, yahoo, or outlook). 
    * @param {string} email 
    * @returns {string|null} Error message or null if valid. 
    */ 
   function validateEmail(email) { 
       if (!email) { 
           return 'Please enter your email ID.'; 
       } 
 
       // Basic email format check 
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
       if (!emailRegex.test(email)) { 
           return 'Please enter a valid email address.'; 
       } 
 
       // Domain check 
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
           return 'Please enter your password.'; 
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
    * Handle login: validate format first, then check credentials. 
    */ 
   function handleLogin() { 
       // Clear all previous errors 
       clearFieldError(emailError); 
       clearFieldError(passwordError); 
       loginError.classList.remove('visible'); 
 
       const email = emailInput.value.trim(); 
       const password = passwordInput.value; 
 
       // Step 1: Validate email format & domain 
       const emailErr = validateEmail(email); 
       if (emailErr) { 
           showFieldError(emailError, emailErr); 
           emailInput.focus(); 
           return; 
       } 
 
       // Step 2: Validate password strength 
       const passErr = validatePassword(password); 
       if (passErr) { 
           showFieldError(passwordError, passErr); 
           passwordInput.focus(); 
           return; 
       } 
 
       // Step 3: Check against stored credentials 
       const credentials = getCredentials(); 
 
       if (email === credentials.username && password === credentials.password) { 
           // Login success 
           sessionStorage.setItem('loggedIn', 'true'); 
           showToast('Login successful! Redirecting...', 'success', 1500); 
           setTimeout(() => { 
               navigateTo('pages/dashboard.html'); 
           }, 1000); 
       } else { 
           // Login failed 
           loginError.textContent = 'Invalid email or password. Please check and re-enter.'; 
           loginError.classList.add('visible'); 
 
           // Shake the card for visual feedback 
           const card = document.querySelector('.login-card'); 
           card.style.animation = 'none'; 
           card.offsetHeight; // Trigger reflow 
           card.style.animation = 'shakeIn 0.4s ease'; 
 
           // Clear password field 
           passwordInput.value = ''; 
           passwordInput.focus(); 
       } 
   } 
 
   // ===== Real-time validation on blur ===== 
 
   emailInput.addEventListener('blur', () => { 
       const email = emailInput.value.trim(); 
       if (email) { 
           const err = validateEmail(email); 
           if (err) { 
               showFieldError(emailError, err); 
           } else { 
               clearFieldError(emailError); 
           } 
       } 
   }); 
 
   passwordInput.addEventListener('blur', () => { 
       const password = passwordInput.value; 
       if (password) { 
           const err = validatePassword(password); 
           if (err) { 
               showFieldError(passwordError, err); 
           } else { 
               clearFieldError(passwordError); 
           } 
       } 
   }); 
 
   // Login button click 
   loginBtn.addEventListener('click', handleLogin); 
 
   // Enter key support 
   passwordInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') handleLogin(); 
   }); 
 
   emailInput.addEventListener('keydown', (e) => { 
       if (e.key === 'Enter') passwordInput.focus(); 
   }); 
 
   // Clear errors on typing 
   emailInput.addEventListener('input', () => { 
       clearFieldError(emailError); 
       loginError.classList.remove('visible'); 
   }); 
   passwordInput.addEventListener('input', () => { 
       clearFieldError(passwordError); 
       loginError.classList.remove('visible'); 
   }); 
 
   // Focus email field on load 
   emailInput.focus(); 
}); 