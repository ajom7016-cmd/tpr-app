const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>Nexus - Premium Access (Light Mode)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet" />
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: #f1f5f9; 
            color: #1e293b;
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent;
        }

        /* Animated 3D Background - Light Mode (From VIP Page) */
        .bg-3d {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            background: #f8fafc;
            overflow: hidden;
        }
        
        .orb-1 {
            position: absolute;
            top: -10%;
            right: -20%;
            width: 70vh;
            height: 70vh;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0) 70%);
            border-radius: 50%;
            filter: blur(50px);
            animation: float 12s ease-in-out infinite;
        }
        
        .orb-2 {
            position: absolute;
            bottom: -20%;
            left: -20%;
            width: 80vh;
            height: 80vh;
            background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0) 70%);
            border-radius: 50%;
            filter: blur(60px);
            animation: float 15s ease-in-out infinite reverse;
        }

        @keyframes float {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
        }

        .bg-block-1 {
            position: absolute;
            top: 5%;
            left: -15%;
            width: 300px;
            height: 400px;
            background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
            transform: rotate(25deg);
            border-radius: 60px;
            box-shadow: 20px 20px 60px rgba(0,0,0,0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.8);
        }

        .bg-block-2 {
            position: absolute;
            top: 50%;
            right: -20%;
            width: 400px;
            height: 500px;
            background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 100%);
            transform: rotate(-15deg);
            border-radius: 80px;
            box-shadow: -20px 20px 60px rgba(0,0,0,0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.6);
        }

        /* Glassmorphic White Panels */
        .glass-panel {
            background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255,255,255,0.9);
            border-bottom: 1px solid rgba(255,255,255,0.3);
            border-right: 1px solid rgba(255,255,255,0.3);
            box-shadow: 
                0 30px 60px -15px rgba(0, 0, 0, 0.1),
                inset 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .glass-input-container {
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
            transition: all 0.3s ease;
        }
        
        .glass-input-container:focus-within, .glass-input-container.active-input {
            border-color: #ea580c; /* orange-600 */
            box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.1), inset 0 2px 5px rgba(0,0,0,0.02);
            background: rgba(255, 255, 255, 0.8);
        }

        .glass-input-container:focus-within .input-icon, .glass-input-container.active-input .input-icon {
            color: #ea580c;
        }

        .custom-input {
            background: transparent;
            border: none;
            outline: none;
            color: #1e293b; /* slate-800 */
            width: 100%;
            font-size: 15px;
            font-weight: 600;
        }
        
        .custom-input::placeholder {
            color: #94a3b8; /* slate-400 */
            font-weight: 500;
        }

        .btn-premium {
            background: linear-gradient(135deg, #ef4444 0%, #ea580c 100%);
            box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.4), inset 0 -3px 0 rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.3);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .btn-premium:hover {
            box-shadow: 0 15px 35px -5px rgba(239, 68, 68, 0.5), inset 0 -3px 0 rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,0.4);
            transform: translateY(-2px);
        }
        
        .btn-premium:active {
            transform: translateY(1px);
            box-shadow: 0 5px 15px -5px rgba(239, 68, 68, 0.4);
        }

        .social-btn {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 1);
            box-shadow: 0 8px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }
        
        .social-btn:hover {
            border-color: #ea580c;
            background: white;
            box-shadow: 0 10px 25px rgba(234, 88, 12, 0.15);
            transform: translateY(-2px);
        }

        /* Custom Toggle Switch - Light Theme */
        .toggle-checkbox:checked {
            right: 0;
            border-color: #ea580c;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #ea580c;
        }
        .toggle-label {
            background-color: #cbd5e1; /* slate-300 */
        }
        
        .hide { display: none !important; }

        /* Modal Overlay - Light Theme */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(255,255,255,0.4); backdrop-filter: blur(15px);
            display: flex; align-items: center; justify-content: center; z-index: 999;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .modal-overlay.active { opacity: 1; pointer-events: auto; }
        .modal-content { transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .modal-overlay.active .modal-content { transform: scale(1); }

        /* OTP Inputs - Light */
        .otp-input {
            width: 45px; height: 55px; text-align: center; font-size: 24px; font-weight: 800;
            border-radius: 12px; background: rgba(255,255,255,0.8); border: 2px solid rgba(203,213,225,0.5);
            transition: all 0.2s; color: #ea580c; margin: 0 4px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .otp-input:focus { 
            border-color: #ea580c; 
            outline: none; 
            box-shadow: 0 0 0 4px rgba(234,88,12,0.1); 
            background: white;
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
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2) !important;
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
    
    <!-- VIP 3D Animated Background Elements -->
    <div class="bg-3d">
        <div class="orb-1"></div>
        <div class="orb-2"></div>
        <div class="bg-block-1"></div>
        <div class="bg-block-2"></div>
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-2 pointer-events-none"></div>

    <!-- MAIN CONTAINER -->
    <div class="w-full max-w-[400px] relative z-10">

        <!-- LOGIN CARD -->
        <div id="login-container" class="glass-panel w-full rounded-[40px] p-8 pb-10">
            
            <!-- Logo Section -->
            <div class="flex flex-col items-center justify-center mb-8 pt-2">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <svg width="24" height="24" viewBox="0 0 40 40">
                            <path d="M5 35 V5 L30 25 V5 M35 5 V35 L10 15 V35" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="text-[30px] font-black tracking-wider text-slate-800 m-0 leading-none">NEXUS</h2>
                </div>
                <p class="text-[13px] font-semibold text-slate-500 mt-2">Premium Digital Assets</p>
            </div>

            <div class="space-y-4">
                <!-- Email Input -->
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-orange-600 pl-2">person</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-slate-500 font-bold mb-0.5 uppercase tracking-wide">Email Address</label>
                        <input type="text" id="login-contact" class="custom-input" placeholder="joshua.m@mail.com">
                    </div>
                </div>

                <!-- Password Input -->
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[24px] text-slate-400 pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-slate-500 font-bold mb-0.5 uppercase tracking-wide">Password</label>
                        <input type="password" id="login-password" class="custom-input" placeholder="••••••••••">
                    </div>
                    <button type="button" onclick="togglePassword('login-password', 'eye-login')" class="pr-2 text-slate-400 hover:text-orange-600 transition-colors">
                        <span id="eye-login" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                    </button>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between pt-1 pb-3">
                    <div class="flex items-center">
                        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="remember-me" checked class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-orange-600 appearance-none cursor-pointer z-10 top-[2px] left-[2px] transition-transform duration-300 ease-in-out transform translate-x-full shadow-sm"/>
                            <label for="remember-me" class="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer shadow-inner"></label>
                        </div>
                        <label for="remember-me" class="text-xs font-bold text-slate-600 cursor-pointer">Remember me</label>
                    </div>
                    <button onclick="switchView('forgot-container')" class="text-xs font-bold text-orange-600 hover:text-red-600 transition-colors">Forgot Password?</button>
                </div>

                <button onclick="handleLogin()" id="btn-login" class="btn-premium w-full py-4 rounded-2xl font-bold text-[16px] tracking-wide mt-2">LOG IN</button>
            </div>

            <!-- Social Login -->
            <div class="mt-8 text-center">
                <p class="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Or sign in with</p>
                <div class="flex justify-center gap-4">
                    <button class="social-btn w-14 h-14 rounded-2xl flex items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" class="w-6 h-6 opacity-80" alt="Google">
                    </button>
                    <button class="social-btn w-14 h-14 rounded-2xl flex items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" class="w-6 h-6 opacity-80" alt="Apple">
                    </button>
                    <button class="social-btn w-14 h-14 rounded-2xl flex items-center justify-center">
                        <span class="material-symbols-outlined text-[28px] text-slate-600">face</span>
                    </button>
                </div>
            </div>

            <p class="text-center mt-10 text-sm font-bold text-slate-500">Don't have an account? <button onclick="switchView('register-container')" class="text-orange-600 font-extrabold hover:text-red-600 transition-colors">Sign Up</button></p>
        </div>

        <!-- REGISTER CONTAINER -->
        <div id="register-container" class="glass-panel w-full rounded-[40px] p-8 pb-10 hide">
            <!-- Logo Section -->
            <div class="flex flex-col items-center justify-center mb-6 pt-2">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <svg width="16" height="16" viewBox="0 0 40 40">
                            <path d="M5 35 V5 L30 25 V5 M35 5 V35 L10 15 V35" fill="none" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h2 class="text-[20px] font-black tracking-widest text-slate-800 m-0 leading-none">NEXUS</h2>
                </div>
                <p class="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-wide">Create Account</p>
            </div>

            <div class="space-y-3">
                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[22px] text-orange-600 pl-2 transition-colors">person</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Full Name</label>
                        <input type="text" id="reg-name" class="custom-input text-sm" placeholder="John Doe" oninput="clearError('reg-name')">
                    </div>
                </div>
                <p id="reg-name-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[22px] text-slate-400 pl-2 transition-colors">phone_iphone</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Phone Number</label>
                        <input type="tel" id="reg-phone" class="custom-input text-sm" placeholder="017XXXXXXXX" oninput="clearError('reg-phone')">
                    </div>
                </div>
                <p id="reg-phone-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[22px] text-orange-600 pl-2 transition-colors">mail</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Email Address</label>
                        <input type="email" id="reg-email" class="custom-input text-sm" placeholder="example@mail.com" oninput="clearError('reg-email')">
                    </div>
                </div>
                <p id="reg-email-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[22px] text-slate-400 pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Password</label>
                        <input type="password" id="reg-password" class="custom-input text-sm" placeholder="••••••••" oninput="clearError('reg-password')">
                    </div>
                    <button type="button" onclick="togglePassword('reg-password', 'eye-reg1')" class="pr-2 text-slate-400 hover:text-orange-600 transition-colors">
                        <span id="eye-reg1" class="material-symbols-outlined text-[18px] hide">visibility_off</span>
                    </button>
                </div>
                <p id="reg-password-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <div class="glass-input-container rounded-2xl p-2.5 flex items-center gap-4">
                    <span class="input-icon material-symbols-outlined text-[22px] text-slate-400 pl-2 transition-colors">lock_reset</span>
                    <div class="flex-1">
                        <label class="block text-[10px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Confirm Password</label>
                        <input type="password" id="reg-password-confirm" class="custom-input text-sm" placeholder="••••••••">
                    </div>
                </div>
                <p id="pw-error" class="text-red-500 text-xs font-bold pl-2 hide">Passwords do not match!</p>

                <button onclick="initiateRegistration()" class="btn-premium w-full py-3.5 rounded-2xl font-bold text-[15px] tracking-wide mt-4">SIGN UP</button>
            </div>
            <p class="text-center mt-6 text-xs font-bold text-slate-500">Already have an account? <button onclick="switchView('login-container')" class="text-orange-600 font-extrabold hover:text-red-600 transition-colors">Log In</button></p>
        </div>

        <!-- FORGOT PASSWORD CONTAINER -->
        <div id="forgot-container" class="glass-panel w-full rounded-[40px] p-8 pb-10 hide">
            <button onclick="switchView('login-container')" class="absolute top-8 left-8 w-10 h-10 bg-white/80 rounded-full shadow-sm flex items-center justify-center text-slate-500 hover:text-orange-600 transition-colors">
                <span class="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div class="text-center mb-8 mt-12">
                <h1 class="text-2xl font-black text-slate-800 mb-2">Reset Password</h1>
                <p class="text-slate-500 font-semibold text-sm">Enter your email to recover access</p>
            </div>
            
            <div class="space-y-6">
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-orange-600 pl-2 transition-colors">mail</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">Email Address</label>
                        <input type="email" id="forgot-contact" class="custom-input" placeholder="example@mail.com" oninput="clearError('forgot-contact')">
                    </div>
                </div>
                <p id="forgot-contact-error" class="text-red-500 text-xs font-bold pl-2 hide"></p>

                <button onclick="requestResetOTP()" class="btn-premium w-full py-4 rounded-2xl font-bold text-[15px] tracking-wide mt-4">SEND OTP</button>
            </div>
        </div>

        <!-- SET NEW PASSWORD CONTAINER -->
        <div id="new-password-container" class="glass-panel w-full rounded-[40px] p-8 pb-10 hide">
            <div class="text-center mb-8 pt-4">
                <h1 class="text-2xl font-black text-slate-800 mb-2">New Password</h1>
                <p class="text-slate-500 font-semibold text-sm">Secure your account</p>
            </div>
            <div class="space-y-6">
                <div class="glass-input-container rounded-2xl p-3 flex items-center gap-4 active-input">
                    <span class="input-icon material-symbols-outlined text-[24px] text-orange-600 pl-2 transition-colors">lock</span>
                    <div class="flex-1">
                        <label class="block text-[11px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">New Password</label>
                        <input type="password" id="new-pass" class="custom-input" placeholder="••••••••">
                    </div>
                    <button type="button" onclick="togglePassword('new-pass', 'eye-new1')" class="pr-2 text-slate-400 hover:text-orange-600 transition-colors">
                        <span id="eye-new1" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                    </button>
                </div>
                <button onclick="finalizePasswordReset()" class="btn-premium w-full py-4 rounded-2xl font-bold text-[15px] tracking-wide mt-4">SAVE PASSWORD</button>
            </div>
        </div>

    </div> <!-- END MAIN CONTAINER -->

    <!-- OTP VERIFICATION MODAL -->
    <div id="otp-modal" class="modal-overlay">
        <div class="modal-content glass-panel w-full max-w-sm rounded-[32px] p-8 text-center m-4 shadow-2xl">
            <h2 class="text-2xl font-black text-slate-800 mb-2">Verification Code</h2>
            <p id="otp-hint" class="text-sm font-semibold text-slate-500 mb-8">Enter the 6-digit code sent to your email</p>
            
            <div class="flex justify-center mb-8" id="otp-inputs">
                <input type="text" id="otp1" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp2', event)">
                <input type="text" id="otp2" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp3', event)">
                <input type="text" id="otp3" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp4', event)">
                <input type="text" id="otp4" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp5', event)">
                <input type="text" id="otp5" maxlength="1" class="otp-input" onkeyup="focusNext(this, 'otp6', event)">
                <input type="text" id="otp6" maxlength="1" class="otp-input" onkeyup="focusNext(this, null, event)">
            </div>
            
            <button onclick="verifyOTP()" id="btn-verify" class="btn-premium w-full py-3.5 rounded-2xl font-bold text-[15px] tracking-wide">VERIFY</button>
            <button onclick="closeOTPModal()" class="mt-6 text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">Cancel</button>
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
                    this.classList.replace('border-slate-300', 'border-orange-600');
                    this.nextElementSibling.style.backgroundColor = '#ea580c';
                } else {
                    this.classList.replace('translate-x-[calc(100%+4px)]', 'translate-x-0');
                    this.classList.replace('border-orange-600', 'border-slate-300');
                    this.nextElementSibling.style.backgroundColor = '#cbd5e1'; 
                }
            });
            // Initial set
            toggleCheckbox.classList.add('translate-x-[calc(100%+4px)]');
        }

        // Input Focus Logic to handle 'active-input' styling
        document.querySelectorAll('.custom-input').forEach(input => {
            input.addEventListener('focus', function() {
                // Remove active class from all
                document.querySelectorAll('.glass-input-container').forEach(c => {
                    c.classList.remove('active-input');
                    c.querySelector('.input-icon').classList.replace('text-orange-600', 'text-slate-400');
                });
                
                // Add to current
                const container = this.closest('.glass-input-container');
                container.classList.add('active-input');
                container.querySelector('.input-icon').classList.replace('text-slate-400', 'text-orange-600');
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
            toast.className = \`transform transition-all duration-300 opacity-0 -translate-y-4 max-w-sm w-max bg-white/90 backdrop-blur-xl border border-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-2xl px-6 py-4 font-bold flex items-center gap-3 \${isError ? 'text-red-500' : 'text-green-500'}\`;
            
            toast.innerHTML = \`
                <span class="material-symbols-outlined text-[24px]">
                    \${isError ? 'error' : 'check_circle'}
                </span>
                <span class="text-slate-800">\${message}</span>
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
                icon.classList.add('hide'); 
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
            
            const btn = document.querySelector('#forgot-container button.btn-premium');
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
console.log('Successfully updated login.html with the LIGHT White Glassmorphic Theme!');
