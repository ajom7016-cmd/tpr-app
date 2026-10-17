const fs = require('fs');
const content = \<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TPR Settings</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24" rel="stylesheet" />
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            color: #111827;
            -webkit-tap-highlight-color: transparent;
        }

        /* Glass Panel Group */
        .glass-group {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%);
            backdrop-filter: blur(40px) saturate(150%);
            -webkit-backdrop-filter: blur(40px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 10px 30px rgba(0,0,0,0.02), inset 0 2px 10px rgba(255,255,255,0.5);
            border-radius: 24px;
            overflow: hidden;
        }

        .input-row {
            padding: 18px 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            position: relative;
        }
        .input-row:last-child { border-bottom: none; }
        
        .input-label {
            width: 100px;
            font-size: 14px;
            font-weight: 700;
            color: #64748b;
        }
        
        .input-field {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            font-size: 15px;
            font-weight: 700;
            color: #1e293b;
            font-family: 'Outfit', sans-serif;
        }
        
        .header-btn {
            width: 44px;
            height: 44px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.8);
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            color: #1e293b;
        }
        
        .btn-save {
            background: #1e293b;
            color: white;
            border-radius: 20px;
            padding: 16px;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(30,41,59,0.2);
            transition: transform 0.2s;
            width: 100%;
        }
        .btn-save:active { transform: scale(0.96); }

        .avatar-edit {
            position: absolute;
            bottom: 2px;
            right: 6px;
            background: #1e293b;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .avatar-container {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            border: 4px solid rgba(255,255,255,0.9);
            box-shadow: 0 8px 25px rgba(0,0,0,0.06);
            padding: 2px;
            background: white;
        }

        /* Error/Success Messages */
        .inline-msg {
            font-size: 11px;
            font-weight: 700;
            margin-top: 4px;
            position: absolute;
            bottom: 2px;
            right: 20px;
        }
        .error-shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
            40%, 60% { transform: translate3d(3px, 0, 0); }
        }
    </style>
</head>
<body class="pt-6 pb-24" style="background-color: transparent;">

    <!-- Header -->
    <div class="px-5 mb-8 flex items-center relative z-10">
        <button class="header-btn absolute" onclick="window.parent.loadPage('user_profile_premium_glass/code.html', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>

    <div class="max-w-[400px] mx-auto px-5 relative z-10 space-y-10">
        
        <!-- Avatar Area -->
        <div class="flex justify-center mt-4">
            <div class="relative w-[110px] h-[110px]">
                <div class="avatar-container">
                    <img src="" id="avatar-img" class="w-full h-full object-cover rounded-full bg-slate-100">
                </div>
                <div class="avatar-edit" onclick="triggerProfileUpload()">
                    <span class="material-symbols-outlined text-[14px]">edit</span>
                </div>
            </div>
        </div>
        
        <!-- Personal Info -->
        <div>
            <p class="text-[12px] font-black text-slate-500 uppercase tracking-[0.15em] pl-4 mb-3">Personal Information</p>
            <div class="glass-group">
                <div class="input-row" id="row-name">
                    <span class="input-label">Full Name</span>
                    <input type="text" id="input-name" class="input-field" placeholder="Loading...">
                </div>
                <div class="input-row" id="row-email">
                    <span class="input-label">Email</span>
                    <input type="email" id="input-email" class="input-field" placeholder="Loading...">
                </div>
                <div class="input-row">
                    <span class="input-label">Phone</span>
                    <input type="tel" id="input-phone" class="input-field text-slate-400" placeholder="Loading..." disabled>
                    <span class="material-symbols-outlined text-emerald-500 text-[20px]" style="font-variation-settings: 'FILL' 0;">verified</span>
                </div>
            </div>
        </div>

        <button class="btn-save mt-6" id="save-btn" onclick="saveProfile()">Save Changes</button>

    </div>

    <script>
        // Trigger parent frame photo upload
        function triggerProfileUpload() {
            try {
                window.parent.document.getElementById('profile-pic-upload').click();
            } catch(e) {
                console.error("Cannot access parent frame");
            }
        }

        // Listen for photo updates
        window.addEventListener('message', function(event) {
            if(event.data && event.data.type === 'profilePicUpdated') {
                const savedPic = localStorage.getItem('userProfilePic');
                if (savedPic) {
                    document.getElementById('avatar-img').src = savedPic;
                }
            }
        });

        // Load Initial Data
        async function loadData() {
            const savedPic = localStorage.getItem('userProfilePic');
            if (savedPic) {
                document.getElementById('avatar-img').src = savedPic;
            } else {
                document.getElementById('avatar-img').src = 'https://i.pravatar.cc/300?u=a042581f4e29026704d';
            }

            try {
                if(!window.parent.APP.getProfile) {
                    setTimeout(loadData, 100);
                    return;
                }
                const user = await window.parent.APP.getProfile();
                if(user) {
                    document.getElementById('input-name').value = user.name || '';
                    document.getElementById('input-email').value = user.email || '';
                    document.getElementById('input-phone').value = user.phone || '';
                }
            } catch(e) {}
        }
        loadData();

        function showInlineError(inputId, msg) {
            const row = document.getElementById(\ow-\\\\);
            row.classList.add('error-shake');
            
            const oldMsgs = row.querySelectorAll('.inline-msg');
            for(let i=0; i<oldMsgs.length; i++) {
                oldMsgs[i].parentNode.removeChild(oldMsgs[i]);
            }
            
            const span = document.createElement('span');
            span.className = 'inline-msg text-red-500';
            span.innerText = msg;
            row.appendChild(span);
            
            setTimeout(() => {
                row.classList.remove('error-shake');
            }, 500);
        }

        function clearErrors() {
            const msgs = document.querySelectorAll('.inline-msg');
            for(let i=0; i<msgs.length; i++) {
                msgs[i].parentNode.removeChild(msgs[i]);
            }
        }

        document.getElementById('input-name').addEventListener('input', clearErrors);
        document.getElementById('input-email').addEventListener('input', clearErrors);

        // Save Changes
        async function saveProfile() {
            clearErrors();
            const btn = document.getElementById('save-btn');
            const name = document.getElementById('input-name').value.trim();
            const email = document.getElementById('input-email').value.trim();

            if(!name) return showInlineError('name', 'Name is required');
            if(!email) return showInlineError('email', 'Email is required');
            if(!email.includes('@')) return showInlineError('email', 'Invalid email address');

            btn.innerHTML = '<span class="material-symbols-outlined animate-spin align-middle">progress_activity</span>';
            btn.style.pointerEvents = 'none';

            try {
                const res = await window.parent.APP.updateProfile(name, email);
                if(res && res.success) {
                    btn.innerHTML = 'Saved Successfully';
                    btn.style.background = '#059669'; // Emerald-600
                    
                    if(window.parent.APP.getProfile) await window.parent.APP.getProfile();

                    setTimeout(() => {
                        btn.innerHTML = 'Save Changes';
                        btn.style.background = '#1e293b';
                        btn.style.pointerEvents = 'auto';
                    }, 2000);
                } else {
                    btn.innerHTML = 'Save Changes';
                    btn.style.pointerEvents = 'auto';
                    if(res && res.error && res.error.toLowerCase().includes('email')) {
                        showInlineError('email', res.error);
                    } else {
                        showInlineError('name', res.error || 'Failed to update');
                    }
                }
            } catch(e) {
                btn.innerHTML = 'Save Changes';
                btn.style.pointerEvents = 'auto';
                showInlineError('name', 'Network error');
            }
        }
    </script>
</body>
</html>\;

fs.writeFileSync('public/profile_settings_glass/code.html', content);
