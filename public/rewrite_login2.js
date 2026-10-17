const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>Nexus - Digital Assets Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet" />
    <style>
        body { 
            font-family: 'Outfit', sans-serif; 
            background-color: #070b14; 
            color: #ffffff;
            overflow-x: hidden;
            /* Creating a futuristic triangular background effect using repeating linear gradients */
            background-image: 
                linear-gradient(30deg, #0b1120 12%, transparent 12.5%, transparent 87%, #0b1120 87.5%, #0b1120),
                linear-gradient(150deg, #0b1120 12%, transparent 12.5%, transparent 87%, #0b1120 87.5%, #0b1120),
                linear-gradient(30deg, #0b1120 12%, transparent 12.5%, transparent 87%, #0b1120 87.5%, #0b1120),
                linear-gradient(150deg, #0b1120 12%, transparent 12.5%, transparent 87%, #0b1120 87.5%, #0b1120),
                linear-gradient(60deg, #10172A 25%, transparent 25.5%, transparent 75%, #10172A 75%, #10172A),
                linear-gradient(60deg, #10172A 25%, transparent 25.5%, transparent 75%, #10172A 75%, #10172A);
            background-size: 80px 140px;
            background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
            background-attachment: fixed;
            position: relative;
        }

        /* Adding a dark overlay to make the background subtle like the image */
        body::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 0%, rgba(7, 11, 20, 0.85) 100%), rgba(7, 11, 20, 0.4);
            z-index: 0;
        }

        /* The main "Glassmorphic White" frosted card */
        .glass-panel {
            background: rgba(255, 255, 255, 0.15); /* More white/frosted as requested */
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-top: 1px solid rgba(255, 255, 255, 0.4);
            border-left: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 
                0 30px 60px -15px rgba(0, 0, 0, 0.6), 
                inset 0 0 40px rgba(255, 255, 255, 0.1);
        }

        .glass-input-container {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: all 0.3s ease;
        }
        
        .glass-input-container:focus-within, .glass-input-container.active-input {
            border-color: #ff6b00;
            box-shadow: 0 0 10px rgba(255, 107, 0, 0.2);
            background: rgba(255, 107, 0, 0.05);
        }

        .glass-input-container:focus-within .input-icon, .glass-input-container.active-input .input-icon {
            color: #ff6b00;
        }

        .custom-input {
            background: transparent;
            border: none;
            outline: none;
            color: #ffffff;
            width: 100%;
            font-size: 15px;
            font-weight: 500;
        }
        
        .custom-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .btn-solid-orange {
            background: #ff5500;
            box-shadow: 0 8px 20px rgba(255, 85, 0, 0.4);
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .btn-solid-orange:hover {
            box-shadow: 0 10px 25px rgba(255, 85, 0, 0.6);
            transform: translateY(-2px);
            background: #ff6a00;
        }
        
        .btn-solid-orange:active {
            transform: translateY(1px);
            box-shadow: 0 5px 15px rgba(255, 85, 0, 0.4);
        }

        .social-btn {
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.05);
            transition: all 0.3s ease;
        }
        
        .social-btn:hover {
            border-color: rgba(255, 107, 0, 0.5);
            box-shadow: 0 10px 25px rgba(255, 107, 0, 0.2), inset 0 2px 5px rgba(255,255,255,0.1);
            transform: translateY(-2px);
        }

        .social-icon {
            color: #ff5500;
        }

        .text-glow-orange {
            color: #ff5500;
        }

        /* Custom Toggle Switch */
        .toggle-checkbox:checked {
            right: 0;
            border-color: #ff5500;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #ff5500;
        }
        
        .hide { display: none !important; }

        /* Modal Overlay */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(15px);
            display: flex; align-items: center; justify-content: center; z-index: 999;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-content { transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .modal-overlay.active .modal-content { transform: scale(1); }

        /* OTP Inputs */
        .otp-input {
            width: 45px; height: 55px; text-align: center; font-size: 24px; font-weight: 700;
            border-radius: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.2s; color: #ff5500; margin: 0 4px;
        }
        .otp-input:focus { 
            border-color: #ff5500; 
            outline: none; 
            box-shadow: 0 0 15px rgba(255,85,0,0.3); 
            background: rgba(255,85,0,0.05); 
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }
        .error-shake {
            animation: shake 0.4s ease-in-out;
            border-color: #ef4444 !important;
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.4) !important;
        }

        .bouncing-dots {
            display: flex; justify-content: center; align-items: center; gap: 8px; height: 24px;
        }
        .bouncing-dots div {
            width: 8px; height: 8px; background-color: white; border-radius: 50%;
            animation: bounce 0.6s infinite alternate;
        }
        .bouncing-dots div:nth-child(2) { animation-delay: 0.2s; }
        .bouncing-dots div:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
            from { transform: translateY(2px) scale(0.8); opacity: 0.6; }
            to { transform: translateY(-2px) scale(1.1); opacity: 1; }
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    
    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 pointer-events-none"></div>

    <!-- MAIN CONTAINER -->
    <div class="w-full max-w-[400px] relative z-10">

        <!-- LOGIN CARD -->
        <div id="login-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 shadow-2xl">
            
            <!-- Logo Section -->
            <div class="flex flex-col items-center justify-center mb-10">
                <div class="flex items-center gap-3">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <path d="M5 35 V5 L30 25 V5 M35 5 V35 L10 15 V35" fill="none" stroke="#ff5500" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="text-[28px] font-bold tracking-widest text-white m-0 leading-none">NEXUS</h2>
                </div>
                <p class="text-[12px] font-medium text-gray-300 mt-2">Digital Assets Platform</p>
            </div>

            <div class="space-y-4">
                <!-- Email Input -->
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff5500] pl-2">person</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-300 font-medium mb-0.5">Email Address</label>
                        <input type="text" id="login-contact" class="custom-input" placeholder="joshua.m@mail.com">
                    </div>
                </div>

                <!-- Password Input -->
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff5500] pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-300 font-medium mb-0.5">Password</label>
                        <input type="password" id="login-password" class="custom-input" placeholder="••••••••••">
                    </div>
                    <button type="button" onclick="togglePassword('login-password', 'eye-login')" class="pr-2 text-gray-400 hover:text-white transition-colors">
                        <span id="eye-login" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                    </button>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between pt-1 pb-2">
                    <div class="flex items-center">
                        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="remember-me" checked class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-[#ff5500] appearance-none cursor-pointer z-10 top-[2px] left-[2px] transition-transform duration-300 ease-in-out transform translate-x-full"/>
                            <label for="remember-me" class="toggle-label block overflow-hidden h-6 rounded-full bg-[#ff5500] cursor-pointer shadow-inner"></label>
                        </div>
                        <label for="remember-me" class="text-xs font-medium text-gray-300 cursor-pointer">Remember me</label>
                    </div>
                    <button onclick="switchView('forgot-container')" class="text-xs font-medium text-[#ff5500] hover:text-white transition-colors">Forgot Password?</button>
                </div>

                <button onclick="handleLogin()" id="btn-login" class="btn-solid-orange w-full py-3.5 rounded-xl font-bold text-[15px] tracking-wide mt-2">LOG IN</button>
            </div>

            <!-- Social Login -->
            <div class="mt-8 text-center">
                <p class="text-xs font-medium text-gray-300 mb-4">Or sign in with:</p>
                <div class="flex justify-center gap-3">
                    <button class="social-btn w-12 h-12 rounded-xl flex items-center justify-center">
                        <span class="text-[22px] font-bold text-[#ff5500]">G</span>
                    </button>
                    <button class="social-btn w-12 h-12 rounded-xl flex items-center justify-center">
                        <span class="text-[22px] font-bold text-[#ff5500]">A</span>
                    </button>
                    <button class="social-btn w-12 h-12 rounded-xl flex items-center justify-center">
                        <span class="material-symbols-outlined text-[24px] text-[#ff5500]">face</span>
                    </button>
                </div>
            </div>

            <p class="text-center mt-10 text-xs font-medium text-gray-300">Don't have an account? <button onclick="switchView('register-container')" class="text-[#ff5500] font-bold hover:text-white transition-colors">Sign Up</button></p>
        </div>

        <!-- REGISTER CONTAINER -->
        <div id="register-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 hide shadow-2xl">
            <!-- Logo Section -->
            <div class="flex flex-col items-center justify-center mb-8">
                <div class="flex items-center gap-3">
                    <svg width="30" height="30" viewBox="0 0 40 40">
                        <path d="M5 35 V5 L30 25 V5 M35 5 V35 L10 15 V35" fill="none" stroke="#ff5500" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 class="text-[22px] font-bold tracking-widest text-white m-0 leading-none">NEXUS</h2>
                </div>
                <p class="text-[10px] font-medium text-gray-300 mt-1">Create Account</p>
            </div>

            <div class="space-y-3">
                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-[#ff5500] pl-2 transition-colors">person</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-300 font-medium mb-0.5">Full Name</label>
                        <input type="text" id="reg-name" class="custom-input text-sm" placeholder="John Doe" oninput="clearError('reg-name')">
                    </div>
                </div>
                <p id="reg-name-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-[#ff5500] pl-2 transition-colors">phone_iphone</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-300 font-medium mb-0.5">Phone Number</label>
                        <input type="tel" id="reg-phone" class="custom-input text-sm" placeholder="017XXXXXXXX" oninput="clearError('reg-phone')">
                    </div>
                </div>
                <p id="reg-phone-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[20px] text-[#ff5500] pl-2 transition-colors">mail</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-300 font-medium mb-0.5">Email Address</label>
                        <input type="email" id="reg-email" class="custom-input text-sm" placeholder="example@mail.com" oninput="clearError('reg-email')">
                    </div>
                </div>
                <p id="reg-email-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-[#ff5500] pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-300 font-medium mb-0.5">Password</label>
                        <input type="password" id="reg-password" class="custom-input text-sm" placeholder="••••••••" oninput="clearError('reg-password')">
                    </div>
                    <button type="button" onclick="togglePassword('reg-password', 'eye-reg1')" class="pr-2 text-gray-400 hover:text-white transition-colors">
                        <span id="eye-reg1" class="material-symbols-outlined text-[18px] hide">visibility_off</span>
                    </button>
                </div>
                <p id="reg-password-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-[#ff5500] pl-2 transition-colors">lock_reset</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-300 font-medium mb-0.5">Confirm Password</label>
                        <input type="password" id="reg-password-confirm" class="custom-input text-sm" placeholder="••••••••">
                    </div>
                </div>
                <p id="pw-error" class="text-red-500 text-xs font-bold pl-2 hide">Passwords do not match!</p>

                <button onclick="initiateRegistration()" class="btn-solid-orange w-full py-3.5 rounded-xl font-bold text-[15px] tracking-wide mt-4">SIGN UP</button>
            </div>
            <p class="text-center mt-6 text-xs font-medium text-gray-300">Already have an account? <button onclick="switchView('login-container')" class="text-[#ff5500] font-bold hover:text-white transition-colors">Log In</button></p>
        </div>

        <!-- FORGOT PASSWORD CONTAINER -->
        <div id="forgot-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 hide shadow-2xl">
            <button onclick="switchView('login-container')" class="absolute top-6 left-6 text-gray-400 hover:text-[#ff5500] transition-colors">
                <span class="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div class="text-center mb-8 mt-4">
                <h1 class="text-2xl font-bold text-[#ff5500] mb-2">Reset Password</h1>
                <p class="text-gray-300 font-medium text-sm">Enter your email to recover access</p>
            </div>
            
            <div class="space-y-5">
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff5500] pl-2 transition-colors">mail</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-300 font-medium mb-0.5">Email Address</label>
                        <input type="email" id="forgot-contact" class="custom-input" placeholder="example@mail.com" oninput="clearError('forgot-contact')">
                    </div>
                </div>
                <p id="forgot-contact-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <button onclick="requestResetOTP()" class="btn-solid-orange w-full py-3.5 rounded-xl font-bold text-[15px] tracking-wide">SEND OTP</button>
            </div>
        </div>

        <!-- SET NEW PASSWORD CONTAINER -->
        <div id="new-password-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 hide shadow-2xl">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-[#ff5500] mb-2">New Password</h1>
                <p class="text-gray-300 font-medium text-sm">Secure your account</p>
            </div>
            <div class="space-y-5">
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff5500] pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-300 font-medium mb-0.5">New Password</label>
                        <input type="password" id="new-pass" class="custom-input" placeholder="••••••••">
                    </div>
                    <button type="button" onclick="togglePassword('new-pass', 'eye-new1')" class="pr-2 text-gray-400 hover:text-white transition-colors">
                        <span id="eye-new1" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                    </button>
                </div>
                <button onclick="finalizePasswordReset()" class="btn-solid-orange w-full py-3.5 rounded-xl font-bold text-[15px] tracking-wide">SAVE PASSWORD</button>
            </div>
        </div>

    </div> <!-- END MAIN CONTAINER -->

    <!-- OTP VERIFICATION MODAL -->
    <div id="otp-modal" class="modal-overlay">
        <div class="modal-content glass-panel w-full max-w-sm rounded-[32px] p-8 text-center m-4">
            <h2 class="text-2xl font-bold text-[#ff5500] mb-2">Verification Code</h2>
            <p id="otp-hint" class="text-sm text-gray-300 mb-8">Enter the 6-digit code sent to your email</p>
            
            <div class="flex justify-center mb-8" id="otp-inputs">
                <input type="text" id="otp1" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp2', event)">
                <input type="text" id="otp2" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp3', event)">
                <input type="text" id="otp3" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp4', event)">
                <input type="text" id="otp4" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp5', event)">
                <input type="text" id="otp5" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp6', event)">
                <input type="text" id="otp6" maxlength="1" class="otp-input" onkeyup="focusNext(this, null, event)">
            </div>
            
            <button onclick="verifyOTP()" id="btn-verify" class="btn-solid-orange w-full py-3.5 rounded-xl font-bold text-[15px] tracking-wide">VERIFY</button>
            <button onclick="closeOTPModal()" class="mt-6 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
        </div>
    </div>

    <script src="/js/app.js"></script>
    <script>
        if (localStorage.getItem('userToken')) {
            window.location.href = '/index.html'; 
        }

        // Toggle Switch Logic
        const toggleCheckbox = document.getElementById('remember-me');
        if(toggleCheckbox) {
            toggleCheckbox.addEventListener('change', function() {
                if(this.checked) {
                    this.classList.replace('translate-x-0', 'translate-x-[calc(100%+4px)]');
                    this.classList.replace('border-gray-400', 'border-[#ff5500]');
                } else {
                    this.classList.replace('translate-x-[calc(100%+4px)]', 'translate-x-0');
                    this.classList.replace('border-[#ff5500]', 'border-gray-400');
                    this.nextElementSibling.style.backgroundColor = '#4b5563'; // gray-600
                }
            });
            // Initial set
            toggleCheckbox.classList.add('translate-x-[calc(100%+4px)]');
        }

        // Input Focus Logic to handle 'active-input' styling
        document.querySelectorAll('.custom-input').forEach(input => {
            input.addEventListener('focus', function() {
                // Remove active class from all
                document.querySelectorAll('.glass-input-container').forEach(c => c.classList.remove('active-input'));
                
                // Add to current
                const container = this.closest('.glass-input-container');
                container.classList.add('active-input');
            });
        });

        // Initialize first input as active on load
        setTimeout(() => {
            document.getElementById('login-contact')?.focus();
        }, 100);

        // State variables
        let authMethods = { login: 'email', reg: 'email', forgot: 'email' };
        let currentOTPAction = null;
        let pendingRegistrationData = null;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^01[3-9]\\d{8}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/;
        
        function clearError(inputId) {
            const input = document.getElementById(inputId)?.closest('.glass-input-container');
            const error = document.getElementById(inputId + '-error');
            if (input) input.classList.remove('error-shake');
            if (error) { error.classList.add('hide'); error.innerText = ''; }
        }

        function showInlineError(inputId, msg) {
            const input = document.getElementById(inputId)?.closest('.glass-input-container');
            const error = document.getElementById(inputId + '-error');
            if (input) {
                input.classList.remove('error-shake');
                void input.offsetWidth;
                input.classList.add('error-shake');
            }
            if (error) { error.classList.remove('hide'); error.innerText = msg; }
        }

        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            const isError = type === 'error';
            toast.className = \`transform transition-all duration-300 opacity-0 -translate-y-4 max-w-sm w-max bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-2xl px-6 py-4 font-bold flex items-center gap-3 \${isError ? 'text-red-400' : 'text-green-400'}\`;
            
            toast.innerHTML = \`
                <span class="material-symbols-outlined text-[24px]">
                    \${isError ? 'error' : 'check_circle'}
                </span>
                <span class="text-white">\${message}</span>
            \`;
            
            container.appendChild(toast);
            
            requestAnimationFrame(() => {
                toast.classList.remove('opacity-0', '-translate-y-4');
                toast.classList.add('opacity-100', 'translate-y-0');
            });

            setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        const views = ['login-container', 'register-container', 'forgot-container', 'new-password-container'];
        function switchView(viewId) {
            views.forEach(v => document.getElementById(v).classList.add('hide'));
            document.getElementById(viewId).classList.remove('hide');
            document.querySelectorAll('.error-shake').forEach(el => el.classList.remove('error-shake'));
            document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hide'));
            
            // Focus first input of new view
            const newView = document.getElementById(viewId);
            const firstInput = newView.querySelector('input:not([type="checkbox"])');
            if(firstInput) firstInput.focus();
        }

        function togglePassword(inputId, iconId) {
            const input = document.getElementById(inputId);
            const icon = document.getElementById(iconId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerText = 'visibility';
                icon.classList.remove('hide');
            } else {
                input.type = 'password';
                icon.innerText = 'visibility_off';
                icon.classList.add('hide'); // In this design, eye is usually hidden until needed or just completely clean
            }
        }

        // Show eye icon only when typing
        document.querySelectorAll('input[type="password"]').forEach(input => {
            input.addEventListener('input', function() {
                const btn = this.nextElementSibling;
                if(btn && btn.tagName === 'BUTTON') {
                    const icon = btn.querySelector('span');
                    if(this.value.length > 0) icon.classList.remove('hide');
                    else if(this.type === 'password') icon.classList.add('hide');
                }
            });
        });

        // OTP Flow
        function showOTPModal(action, contactMethod, contactValue) {
            currentOTPAction = action;
            document.getElementById('otp-modal').classList.add('active');
            document.querySelectorAll('.otp-input').forEach(i => i.value = '');
            document.querySelector('.otp-input').focus();
            
            const hint = document.getElementById('otp-hint');
            hint.innerText = \`Enter the 6-digit code sent to \${contactValue}\`;
        }

        function closeOTPModal() {
            document.getElementById('otp-modal').classList.remove('active');
        }

        function focusNext(current, nextId, event) {
            if (event && event.key === 'Backspace' && current.value === '') {
                const prevId = 'otp' + (parseInt(current.id.replace('otp', '')) - 1);
                const prev = document.getElementById(prevId);
                if (prev) { prev.focus(); prev.value = ''; }
                return;
            }
            if (current.value.length === 1) {
                if (nextId) document.getElementById(nextId).focus();
                else checkAndAutoVerifyOTP();
            }
        }

        function checkAndAutoVerifyOTP() {
            const inputs = document.querySelectorAll('.otp-input');
            const code = Array.from(inputs).map(i => i.value).join('');
            if (code.length === 6) verifyOTP();
        }

        document.addEventListener('DOMContentLoaded', () => {
            const otp1 = document.getElementById('otp1');
            if(otp1) {
                otp1.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\\D/g, '').slice(0, 6);
                    if(text) {
                        const inputs = document.querySelectorAll('.otp-input');
                        inputs.forEach((input, i) => { if(text[i]) input.value = text[i]; });
                        checkAndAutoVerifyOTP();
                    }
                });
            }
        });

        async function verifyOTP() {
            const inputs = document.querySelectorAll('.otp-input');
            const code = Array.from(inputs).map(i => i.value).join('');
            if (code.length !== 6) return showToast('Enter 6-digit code!', 'error');
            
            const btn = document.getElementById('btn-verify');
            const og = btn.innerHTML;
            btn.innerHTML = '<div class="bouncing-dots"><div></div><div></div><div></div></div>';
            
            let isValid = false;
            try {
                let contact = pendingRegistrationData ? pendingRegistrationData.email : document.getElementById('forgot-contact').value;
                const [res] = await Promise.all([
                    window.APP.verifyOTP(contact, code),
                    new Promise(r => setTimeout(r, 1000))
                ]);
                if (res.success) {
                    isValid = true;
                } else {
                    showToast('Invalid or expired OTP!', 'error');
                    inputs.forEach(i => {
                        i.classList.remove('error-shake');
                        void i.offsetWidth;
                        i.classList.add('error-shake');
                        i.value = '';
                    });
                    document.getElementById('otp1').focus();
                }
            } catch (err) {
                showToast('Something went wrong!', 'error');
            } finally {
                btn.innerHTML = og;
            }

            if (isValid) {
                closeOTPModal();
                if (currentOTPAction === 'register') finalizeRegistration();
                else if (currentOTPAction === 'reset') switchView('new-password-container');
            }
        }

        async function handleLogin() {
            const contact = document.getElementById('login-contact').value;
            const pw = document.getElementById('login-password').value;
            if(!contact || !pw) return showToast('Please fill all fields', 'error');
            
            const btn = document.getElementById('btn-login');
            const og = btn.innerHTML;
            btn.innerHTML = '<div class="bouncing-dots"><div></div><div></div><div></div></div>';
            
            const res = await window.APP.login(contact, pw);
            if (res.success) window.location.href = '/index.html';
            else {
                showToast('Login failed: ' + res.error, 'error');
                btn.innerHTML = og;
            }
        }

        async function initiateRegistration() {
            const n = document.getElementById('reg-name').value;
            const phone = document.getElementById('reg-phone').value;
            const email = document.getElementById('reg-email').value;
            const pw = document.getElementById('reg-password').value;
            const pwc = document.getElementById('reg-password-confirm').value;
            
            if(!n || !phone || !email || !pw || !pwc) return showToast('Fill all fields', 'error');
            
            let isValidForm = true;
            if (!emailRegex.test(email)) { showInlineError('reg-email', 'Invalid email address!'); isValidForm = false; }
            if (!isValidForm) return;

            const errEl = document.getElementById('pw-error');
            if (pw !== pwc) { errEl.classList.remove('hide'); return; }
            errEl.classList.add('hide');

            pendingRegistrationData = { name: n, phone: phone, email: email, password: pw };
            showOTPModal('register', 'email', email);

            window.APP.sendOTP(email, phone, n).then(res => {
                if (!res.success) {
                    closeOTPModal();
                    showToast(res.error || 'Failed to send email.', 'error');
                }
            });
        }

        async function finalizeRegistration() {
            if (!pendingRegistrationData) return;
            const { name, phone, email, password } = pendingRegistrationData;
            const res = await window.APP.register(name, phone, email, password);
            if (res.success) {
                showToast('Account created successfully!');
                switchView('login-container');
                document.getElementById('login-contact').value = email;
                document.getElementById('login-password').value = password;
            } else {
                showToast('Registration failed: ' + res.error, 'error');
            }
        }

        async function requestResetOTP() {
            const contact = document.getElementById('forgot-contact').value.trim();
            if(!contact) return showInlineError('forgot-contact', 'Enter email address');
            if (!emailRegex.test(contact)) return showInlineError('forgot-contact', 'Invalid email address!');
            
            const btn = document.querySelector('#forgot-container button.btn-solid-orange');
            const og = btn.innerHTML;
            btn.innerHTML = '<div class="bouncing-dots"><div></div><div></div><div></div></div>';
            
            const res = await window.APP.sendForgotOTP(contact);
            btn.innerHTML = og;
            
            if (res.success) showOTPModal('reset', 'email', contact);
            else showInlineError('forgot-contact', res.error || 'No account found with this email!');
        }

        function finalizePasswordReset() {
            const newPass = document.getElementById('new-pass').value;
            if(!newPass) return showToast('Enter new password', 'error');
            showToast('Password reset successfully! Please login.');
            switchView('login-container');
        }
    </script>
</body>
</html>`;

fs.writeFileSync('C:\\Users\\PC\\Documents\\JMJ_App\\public\\login.html', htmlContent, 'utf8');
console.log('Successfully updated login.html with the NEW Glassmorphic White/Frosted Nexus Theme!');
