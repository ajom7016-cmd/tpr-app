const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>Nexus - Premium Access</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet" />
    <style>
        body { 
            font-family: 'Outfit', sans-serif; 
            background-color: #070b14; 
            color: #ffffff;
            overflow-x: hidden;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(255, 107, 0, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(255, 140, 0, 0.08) 0%, transparent 50%);
            background-attachment: fixed;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02);
        }

        .glass-input-container {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .glass-input-container:focus-within, .glass-input-container.active-input {
            border-color: rgba(255, 107, 0, 0.6);
            box-shadow: 0 0 15px rgba(255, 107, 0, 0.2), inset 0 0 10px rgba(255, 107, 0, 0.1);
            background: rgba(255, 107, 0, 0.03);
        }

        .glass-input-container:focus-within .input-icon, .glass-input-container.active-input .input-icon {
            color: #ff6b00;
            text-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
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
            color: rgba(255, 255, 255, 0.3);
        }

        .btn-neon {
            background: linear-gradient(90deg, #ff6b00, #ff8c00);
            box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .btn-neon:hover {
            box-shadow: 0 10px 25px rgba(255, 107, 0, 0.6), inset 0 -2px 5px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.4);
            transform: translateY(-2px);
        }
        
        .btn-neon:active {
            transform: translateY(1px);
            box-shadow: 0 5px 15px rgba(255, 107, 0, 0.4);
        }

        .social-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 107, 0, 0.3);
            box-shadow: inset 0 0 10px rgba(255, 107, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .social-btn:hover {
            border-color: rgba(255, 107, 0, 0.8);
            box-shadow: 0 0 15px rgba(255, 107, 0, 0.2), inset 0 0 15px rgba(255, 107, 0, 0.1);
            transform: translateY(-2px);
        }

        .text-glow-orange {
            color: #ff8c00;
            text-shadow: 0 0 15px rgba(255, 107, 0, 0.6);
        }
        
        .text-glow-white {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
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
            border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.2s; color: #ff8c00; margin: 0 4px;
        }
        .otp-input:focus { 
            border-color: #ff6b00; 
            outline: none; 
            box-shadow: 0 0 15px rgba(255,107,0,0.3); 
            background: rgba(255,107,0,0.05); 
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
        
        /* Floating particles effect (pure css) */
        .particles {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1; pointer-events: none;
        }
        .particle {
            position: absolute; border-radius: 50%; background: rgba(255, 107, 0, 0.4);
            box-shadow: 0 0 10px rgba(255, 107, 0, 0.6);
            animation: float 15s infinite linear;
        }
        @keyframes float {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 relative">
    
    <!-- Background Particles -->
    <div class="particles">
        <div class="particle" style="width:4px; height:4px; left:10%; animation-duration:12s; animation-delay:0s;"></div>
        <div class="particle" style="width:6px; height:6px; left:30%; animation-duration:15s; animation-delay:2s;"></div>
        <div class="particle" style="width:3px; height:3px; left:50%; animation-duration:10s; animation-delay:5s;"></div>
        <div class="particle" style="width:5px; height:5px; left:70%; animation-duration:18s; animation-delay:1s;"></div>
        <div class="particle" style="width:7px; height:7px; left:90%; animation-duration:14s; animation-delay:4s;"></div>
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 pointer-events-none"></div>

    <!-- MAIN CONTAINER -->
    <div class="w-full max-w-md relative z-10">
        
        <!-- Logo Section (Outside the card, floating above) -->
        <div class="flex flex-col items-center mb-8">
            <svg width="60" height="70" viewBox="0 0 60 70" class="drop-shadow-[0_0_15px_rgba(255,107,0,0.8)]">
                <!-- Glowing N shape -->
                <path d="M10 60 V10 L45 50 V10" fill="none" stroke="#ff8c00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 60 V10 L45 50 V10" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="mt-2 text-center">
                <h2 class="text-2xl font-bold tracking-[0.2em] text-glow-orange m-0 leading-none">NEXUS</h2>
                <p class="text-[9px] font-bold tracking-[0.3em] text-gray-400 mt-1 uppercase">Premium Access</p>
            </div>
        </div>

        <!-- LOGIN CARD -->
        <div id="login-container" class="glass-panel w-full rounded-[32px] p-8 pb-10">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-glow-orange mb-1">Sign In</h1>
                <p class="text-gray-300 font-medium">Welcome Back!</p>
            </div>

            <div class="space-y-4">
                <!-- Email Input -->
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff6b00] pl-2">mail</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-400 font-medium mb-0.5">Email Address</label>
                        <input type="text" id="login-contact" class="custom-input" placeholder="Enter your email">
                    </div>
                </div>

                <!-- Password Input -->
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[24px] text-gray-400 pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-400 font-medium mb-0.5">Password</label>
                        <input type="password" id="login-password" class="custom-input" placeholder="••••••••">
                    </div>
                    <button type="button" onclick="togglePassword('login-password', 'eye-login')" class="pr-2 text-gray-400 hover:text-white transition-colors">
                        <span id="eye-login" class="material-symbols-outlined text-[20px]">visibility_off</span>
                    </button>
                </div>

                <div class="flex justify-end pt-1 pb-2">
                    <button onclick="switchView('forgot-container')" class="text-xs font-semibold text-[#ff8c00] hover:text-white transition-colors">Forgot Password?</button>
                </div>

                <button onclick="handleLogin()" id="btn-login" class="btn-neon w-full py-4 rounded-full font-bold text-lg tracking-wide">Sign In</button>
            </div>

            <!-- Social Login -->
            <div class="mt-8 text-center">
                <p class="text-sm text-gray-400 mb-4">Or sign in with:</p>
                <div class="flex justify-center gap-4">
                    <button class="social-btn w-12 h-12 rounded-2xl flex items-center justify-center">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                            <path d="M10 2c1 .5 2 2 2 5"></path>
                        </svg>
                    </button>
                    <button class="social-btn w-12 h-12 rounded-2xl flex items-center justify-center">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4l3 3"></path>
                            <!-- Simplifying Google to G -->
                            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" fill="#ff8c00" stroke="none"/>
                        </svg>
                    </button>
                    <button class="social-btn w-12 h-12 rounded-2xl flex items-center justify-center">
                        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <p class="text-center mt-8 text-sm text-gray-400">Don't have an account? <button onclick="switchView('register-container')" class="text-[#ff8c00] font-bold hover:text-white transition-colors">Sign Up</button></p>
        </div>

        <!-- REGISTER CONTAINER -->
        <div id="register-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 hide">
            <div class="text-center mb-6">
                <h1 class="text-3xl font-bold text-glow-orange mb-1">Sign Up</h1>
                <p class="text-gray-300 font-medium text-sm">Join the Premium Access</p>
            </div>

            <div class="space-y-3">
                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-gray-400 pl-2 transition-colors">person</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-400 font-medium mb-0.5">Full Name</label>
                        <input type="text" id="reg-name" class="custom-input text-sm" placeholder="John Doe" oninput="clearError('reg-name')">
                    </div>
                </div>
                <p id="reg-name-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-gray-400 pl-2 transition-colors">phone_iphone</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-400 font-medium mb-0.5">Phone Number</label>
                        <input type="tel" id="reg-phone" class="custom-input text-sm" placeholder="017XXXXXXXX" oninput="clearError('reg-phone')">
                    </div>
                </div>
                <p id="reg-phone-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[20px] text-[#ff6b00] pl-2 transition-colors">mail</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-400 font-medium mb-0.5">Email Address</label>
                        <input type="email" id="reg-email" class="custom-input text-sm" placeholder="example@nexus.io" oninput="clearError('reg-email')">
                    </div>
                </div>
                <p id="reg-email-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-gray-400 pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-400 font-medium mb-0.5">Password</label>
                        <input type="password" id="reg-password" class="custom-input text-sm" placeholder="••••••••" oninput="clearError('reg-password')">
                    </div>
                    <button type="button" onclick="togglePassword('reg-password', 'eye-reg1')" class="pr-2 text-gray-400 hover:text-white transition-colors">
                        <span id="eye-reg1" class="material-symbols-outlined text-[18px]">visibility_off</span>
                    </button>
                </div>
                <p id="reg-password-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[20px] text-gray-400 pl-2 transition-colors">lock_reset</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-400 font-medium mb-0.5">Confirm Password</label>
                        <input type="password" id="reg-password-confirm" class="custom-input text-sm" placeholder="••••••••">
                    </div>
                </div>
                <p id="pw-error" class="text-red-500 text-xs font-bold pl-2 hide">Passwords do not match!</p>

                <button onclick="initiateRegistration()" class="btn-neon w-full py-3.5 rounded-full font-bold text-lg tracking-wide mt-4">Create Account</button>
            </div>
            <p class="text-center mt-6 text-sm text-gray-400">Already have an account? <button onclick="switchView('login-container')" class="text-[#ff8c00] font-bold hover:text-white transition-colors">Sign In</button></p>
        </div>

        <!-- FORGOT PASSWORD CONTAINER -->
        <div id="forgot-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 hide">
            <button onclick="switchView('login-container')" class="absolute top-6 left-6 text-gray-400 hover:text-[#ff8c00] transition-colors">
                <span class="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div class="text-center mb-8 mt-4">
                <h1 class="text-2xl font-bold text-glow-orange mb-2">Reset Password</h1>
                <p class="text-gray-300 font-medium text-sm">Enter your email to recover access</p>
            </div>
            
            <div class="space-y-5">
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff6b00] pl-2 transition-colors">mail</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-400 font-medium mb-0.5">Email Address</label>
                        <input type="email" id="forgot-contact" class="custom-input" placeholder="example@nexus.io" oninput="clearError('forgot-contact')">
                    </div>
                </div>
                <p id="forgot-contact-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <button onclick="requestResetOTP()" class="btn-neon w-full py-4 rounded-full font-bold text-lg tracking-wide">Send Reset Code</button>
            </div>
        </div>

        <!-- SET NEW PASSWORD CONTAINER -->
        <div id="new-password-container" class="glass-panel w-full rounded-[32px] p-8 pb-10 hide">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-glow-orange mb-2">New Password</h1>
                <p class="text-gray-300 font-medium text-sm">Secure your account</p>
            </div>
            <div class="space-y-5">
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-[#ff6b00] pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-gray-400 font-medium mb-0.5">New Password</label>
                        <input type="password" id="new-pass" class="custom-input" placeholder="••••••••">
                    </div>
                    <button type="button" onclick="togglePassword('new-pass', 'eye-new1')" class="pr-2 text-gray-400 hover:text-white transition-colors">
                        <span id="eye-new1" class="material-symbols-outlined text-[20px]">visibility_off</span>
                    </button>
                </div>
                <button onclick="finalizePasswordReset()" class="btn-neon w-full py-4 rounded-full font-bold text-lg tracking-wide">Save Password</button>
            </div>
        </div>

    </div> <!-- END MAIN CONTAINER -->

    <!-- OTP VERIFICATION MODAL -->
    <div id="otp-modal" class="modal-overlay">
        <div class="modal-content glass-panel w-full max-w-sm rounded-[32px] p-8 text-center m-4">
            <h2 class="text-2xl font-bold text-glow-orange mb-2">Verification Code</h2>
            <p id="otp-hint" class="text-sm text-gray-300 mb-8">Enter the 6-digit code sent to your email</p>
            
            <div class="flex justify-center mb-8" id="otp-inputs">
                <input type="text" id="otp1" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp2', event)">
                <input type="text" id="otp2" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp3', event)">
                <input type="text" id="otp3" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp4', event)">
                <input type="text" id="otp4" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp5', event)">
                <input type="text" id="otp5" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp6', event)">
                <input type="text" id="otp6" maxlength="1" class="otp-input" onkeyup="focusNext(this, null, event)">
            </div>
            
            <button onclick="verifyOTP()" id="btn-verify" class="btn-neon w-full py-3.5 rounded-full font-bold text-lg tracking-wide">Verify Identity</button>
            <button onclick="closeOTPModal()" class="mt-6 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
        </div>
    </div>

    <script src="/js/app.js"></script>
    <script>
        if (localStorage.getItem('userToken')) {
            window.location.href = '/index.html'; 
        }

        // Input Focus Logic to handle 'active-input' styling
        document.querySelectorAll('.custom-input').forEach(input => {
            input.addEventListener('focus', function() {
                // Remove active class from all
                document.querySelectorAll('.glass-input-container').forEach(c => c.classList.remove('active-input'));
                document.querySelectorAll('.input-icon').forEach(i => i.classList.replace('text-[#ff6b00]', 'text-gray-400'));
                
                // Add to current
                const container = this.closest('.glass-input-container');
                container.classList.add('active-input');
                const icon = container.querySelector('.input-icon');
                if(icon) icon.classList.replace('text-gray-400', 'text-[#ff6b00]');
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
            toast.className = \`transform transition-all duration-300 opacity-0 -translate-y-4 max-w-sm w-max bg-[#1a1f2e]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-2xl px-6 py-4 font-bold flex items-center gap-3 \${isError ? 'text-red-400' : 'text-green-400'}\`;
            
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
            const firstInput = newView.querySelector('input');
            if(firstInput) firstInput.focus();
        }

        function togglePassword(inputId, iconId) {
            const input = document.getElementById(inputId);
            const icon = document.getElementById(iconId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerText = 'visibility';
                icon.classList.add('text-[#ff8c00]');
            } else {
                input.type = 'password';
                icon.innerText = 'visibility_off';
                icon.classList.remove('text-[#ff8c00]');
            }
        }

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
            
            const btn = document.querySelector('#forgot-container button.btn-neon');
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
console.log('Successfully updated login.html with the new Nexus Dark Theme!');
