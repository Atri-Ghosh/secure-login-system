document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    const loginCard = document.getElementById('loginCard');
    const dashboardArea = document.getElementById('dashboardArea');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Password Strength Elements
    const bars = [
        document.getElementById('bar1'),
        document.getElementById('bar2'),
        document.getElementById('bar3'),
        document.getElementById('bar4')
    ];
    const strengthText = document.getElementById('strengthText');

    // 1. Session Persistence Check on Load
    const activeUser = localStorage.getItem('loggedUser') || sessionStorage.getItem('loggedUser');
    if (activeUser) {
        showDashboard(activeUser);
    }

    // 2. Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // 3. Real-Time Password Strength Meter Logic
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        let score = 0;

        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        updateStrengthMeter(score, val.length);
    });

    function updateStrengthMeter(score, length) {
        // Reset bars
        bars.forEach(bar => bar.style.backgroundColor = '#e2e8f0');

        if (length === 0) {
            strengthText.textContent = 'Password Strength';
            strengthText.style.color = '#718096';
            return;
        }

        const colors = ['#e53e3e', '#ed8936', '#ecc94b', '#48bb78'];
        const labels = ['Weak', 'Fair', 'Good', 'Strong'];

        for (let i = 0; i < score; i++) {
            bars[i].style.backgroundColor = colors[score - 1];
        }
        strengthText.textContent = labels[score - 1] || 'Weak';
        strengthText.style.color = colors[score - 1] || '#e53e3e';
    }

    // 4. Form Submission & Validation Handling
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Email Regex Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email address is required.';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address format.';
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('error');
        }

        // Password Validation
        if (!passwordInput.value) {
            passwordError.textContent = 'Password is required.';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters long.';
            passwordInput.classList.add('error');
            isValid = false;
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
        }

        // If Validation Passes -> Authenticate & Establish Session
        if (isValid) {
            const email = emailInput.value.trim();
            
            // Session Persistence handling
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('loggedUser', email);
            } else {
                sessionStorage.setItem('loggedUser', email);
            }

            showDashboard(email);
        }
    });

    // Helper function to transition to the application area
    function showDashboard(email) {
        loginCard.classList.add('hidden');
        dashboardArea.classList.remove('hidden');
        userEmailDisplay.textContent = email;
    }

    // 5. Logout & Session Clearance
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        sessionStorage.removeItem('loggedUser');
        loginForm.reset();
        updateStrengthMeter(0, 0);
        dashboardArea.classList.add('hidden');
        loginCard.classList.remove('hidden');
    });
});