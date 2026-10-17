const fs = require('fs');

const loginHTML = fs.readFileSync('public/login.html', 'utf8');
const styleStart = loginHTML.indexOf('<style>');
const styleEnd = loginHTML.indexOf('</style>') + 8;
let loginStyle = loginHTML.substring(styleStart, styleEnd);

const html = <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Change Password</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet" />
     + loginStyle + 
</head>
<body class="pt-[72px] pb-24">

    <!-- Fixed Header Grid (No Overlap) -->
    <div class="px-6 mb-8 grid grid-cols-[48px_1fr_48px] items-center relative z-20 gap-2">
        <button class="header-btn" onclick="window.parent.loadPage('security_glass/code.html', null)">
            <span class="material-symbols-outlined text-[24px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
        <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center truncate">Change Password</h1>
        <div></div>
    </div>

    <div class="max-w-[400px] mx-auto px-6 relative z-10 pb-8">
        
        <!-- Standard Password UI -->
        <div id="standard-password-ui" class="glass-panel w-full rounded-[40px] p-8 pb-10">
            <div class="mb-10 text-center">
                <div class="w-20 h-20 mx-auto bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-full flex items-center justify-center mb-4 relative">
                    <div class="absolute inset-0 border border-slate-200/50 rounded-full opacity-40 z-0"></div>
                    <span class="material-symbols-outlined text-[36px] text-slate-700 relative z-10" style="font-variation-settings: 'FILL' 1;">password</span>
                </div>
                <p class="text-[18px] font-black text-slate-800">Change Password</p>
                <p class="text-[13px] font-semibold text-slate-500 mt-1">Your password must be at least 8 characters.</p>
            </div>

            <form onsubmit="savePassword(event)" novalidate>
                <div class="space-y-4">
                    <div class="glass-input-container mb-4" style="--gap-width: 107px;">
                        <div class="glass-input-bg"></div>
                        <div class="glass-input-border"></div>
                        <label class="glass-input-label">Current Password</label>
                        <input type="password" id="currPass" class="custom-input" placeholder=" " required>
                        <button type="button" onclick="togglePassword('currPass', 'eye-curr')" class="absolute right-4 z-20 text-slate-400 hover:text-orange-600 transition-colors focus:outline-none">
                            <span id="eye-curr" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                        </button>
                    </div>
                    
                    <div class="glass-input-container mb-4" style="--gap-width: 88px;">
                        <div class="glass-input-bg"></div>
                        <div class="glass-input-border"></div>
                        <label class="glass-input-label">New Password</label>
                        <input type="password" id="newPass" class="custom-input" placeholder=" " required minlength="8">
                        <button type="button" onclick="togglePassword('newPass', 'eye-new')" class="absolute right-4 z-20 text-slate-400 hover:text-orange-600 transition-colors focus:outline-none">
                            <span id="eye-new" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                        </button>
                    </div>

                    <div class="glass-input-container mb-4" style="--gap-width: 137px;">
                        <div class="glass-input-bg"></div>
                        <div class="glass-input-border"></div>
                        <label class="glass-input-label">Confirm New Password</label>
                        <input type="password" id="confPass" class="custom-input" placeholder=" " required minlength="8">
                        <button type="button" onclick="togglePassword('confPass', 'eye-conf')" class="absolute right-4 z-20 text-slate-400 hover:text-orange-600 transition-colors focus:outline-none">
                            <span id="eye-conf" class="material-symbols-outlined text-[20px] hide">visibility_off</span>
                        </button>
                    </div>
                </div>

                <button type="submit" class="btn-premium w-full py-4 rounded-2xl font-bold tracking-wide mt-6">
                    Update Password
                    <span class="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                </button>
            </form>
        </div>

        <!-- Google Auth UI -->
        <div id="google-auth-ui" style="display: none;" class="text-center mt-4 w-full">
            <div class="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
                <div class="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div class="absolute inset-0 border border-white/40 rounded-full opacity-60 z-0 shadow-[0_0_30px_rgba(255,255,255,0.4)]"></div>
                <div class="relative z-10 w-20 h-20 bg-white/80 backdrop-blur-2xl border border-white shadow-[0_15px_35px_rgba(0,0,0,0.1),inset_0_4px_15px_rgba(255,255,255,1)] rounded-full flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" class="w-10 h-10 drop-shadow-md">
                </div>
            </div>

            <h2 class="text-[26px] font-black tracking-tight text-slate-800 mb-3 drop-shadow-sm">Linked to Google</h2>
            <p class="text-[14px] font-semibold text-slate-500 leading-relaxed max-w-[300px] mx-auto mb-10 px-2">
                You signed up for TPR using your <strong class="text-slate-700">Google Account</strong>. Therefore, you do not have a separate app password to manage.
            </p>
            
            <div class="relative p-5 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
                <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-3xl -z-10"></div>
                <div class="absolute inset-0 border border-white/80 rounded-3xl -z-10 pointer-events-none"></div>
                
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-50/80 border border-blue-100 shadow-inner flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[22px] text-blue-600 drop-shadow-sm">gpp_good</span>
                    </div>
                    <div class="text-left">
                        <p class="text-[15px] font-black text-slate-800 tracking-wide mb-1">Maximum Security</p>
                        <p class="text-[12px] font-semibold text-slate-500 leading-snug">Your account is secured natively by Google's advanced authentication system and OAuth 2.0.</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-8">
                <button onclick="window.parent.loadPage('security_glass/code.html', null)" class="px-6 py-2.5 rounded-full bg-slate-800/5 hover:bg-slate-800/10 text-slate-600 font-bold text-[13px] transition-colors border border-slate-200/50">
                    Back to Security
                </button>
            </div>
        </div>
    </div>

    <script>
        // Input Focus Logic to handle active-input styling
        document.querySelectorAll('.custom-input').forEach(input => {
            input.addEventListener('focus', function() {
                document.querySelectorAll('.glass-input-container').forEach(c => c.classList.remove('active-input'));
                this.closest('.glass-input-container').classList.add('active-input');
            });
        });

        function clearError(inputId) {
            const input = document.getElementById(inputId);
            const container = input?.closest('.glass-input-container');
            if (container) {
                container.classList.remove('error-shake', 'error-shake-large');
                let errorSpan = container.querySelector('.error-text');
                if (errorSpan) errorSpan.remove();
            }
        }

        function showInlineError(inputId, message) {
            const input = document.getElementById(inputId);
            const container = input?.closest('.glass-input-container');
            if (container) {
                container.classList.remove('error-shake', 'error-shake-large');
                void container.offsetWidth;
                container.classList.add('error-shake');
                
                let errorSpan = container.querySelector('.error-text');
                if (!errorSpan) {
                    errorSpan = document.createElement('span');
                    errorSpan.className = 'error-text text-red-600 text-[11px] font-extrabold absolute bottom-full left-4 mb-[9px] z-10 leading-tight';
                    container.appendChild(errorSpan);
                }
                errorSpan.textContent = message;
            }
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

        if (localStorage.getItem('tpr_auth_provider') === 'google') {
            document.getElementById('standard-password-ui').style.display = 'none';
            document.getElementById('google-auth-ui').style.display = 'block';
        }

        async function savePassword(e) {
            e.preventDefault();
            ['currPass', 'newPass', 'confPass'].forEach(clearError);
            
            const curr = document.getElementById('currPass').value;
            const newP = document.getElementById('newPass').value;
            const confP = document.getElementById('confPass').value;

            let hasError = false;

            if(!curr) {
                showInlineError('currPass', "Enter current password");
                hasError = true;
            }
            if(!newP || newP.length < 8) {
                showInlineError('newPass', "Password must be at least 8 characters");
                hasError = true;
            }
            if(!confP || confP.length < 8) {
                showInlineError('confPass', "Confirm your password");
                hasError = true;
            }
            if(newP.length >= 8 && confP.length >= 8 && newP !== confP) {
                showInlineError('confPass', "Passwords do not match!");
                hasError = true;
            }

            if(hasError) return;

            const btn = document.querySelector('.btn-premium');
            btn.innerHTML = \<span class="material-symbols-outlined animate-spin">sync</span> Updating...\;
            btn.style.opacity = '0.8';
            btn.disabled = true;
            
            const res = await window.parent.APP.changePassword(curr, newP);

            if (res.success) {
                localStorage.setItem('tpr_password', newP);
                btn.innerHTML = \<span class="material-symbols-outlined text-emerald-600">check_circle</span> <span class="text-emerald-700">Password Updated</span>\;
                btn.style.background = 'rgba(209, 250, 229, 0.9)';
                btn.style.borderColor = '#34d399';
                btn.style.opacity = '1';
                
                setTimeout(() => {
                    window.parent.loadPage('security_glass/code.html', null);
                }, 1000);
            } else {
                btn.innerHTML = \Update Password <span class="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>\;
                btn.style.opacity = '1';
                btn.disabled = false;

                if (res.error && res.error.toLowerCase().includes('current')) {
                    showInlineError('currPass', res.error);
                } else {
                    showInlineError('currPass', res.error || 'Failed to update password');
                }
            }
        }
    </script>
</body>
</html>;

fs.writeFileSync('public/security_change_password/code.html', html);
console.log('Fixed completely');
