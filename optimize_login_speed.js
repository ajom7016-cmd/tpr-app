const fs = require('fs');
const path = require('path');

// 1. UPDATE SERVER.JS
const serverPath = path.join(__dirname, 'server.js');
let serverCode = fs.readFileSync(serverPath, 'utf8');

const oldInsertUser = `        function insertUser() {
            db.run(\`INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)\`, [name, phone, email, hashedPassword], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
            });
        }`;

const newInsertUser = `        function insertUser() {
            db.run(\`INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)\`, [name, phone, email, hashedPassword], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                const userId = this.lastID;
                const token = jwt.sign({ id: userId, phone: phone, role: 'user' }, SECRET_KEY, { expiresIn: '24h' });
                
                const ua = req.headers['user-agent'] || '';
                let deviceName = "Unknown Device";
                if(ua.includes("Windows")) deviceName = "Windows PC";
                else if(ua.includes("Mac")) deviceName = "Mac OS";
                else if(ua.includes("iPhone") || ua.includes("iPad")) deviceName = "Apple iOS Device";
                else if(ua.includes("Android")) deviceName = "Android Device";
                const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP';

                db.run("INSERT INTO user_devices (user_id, token, device_name, ip_address) VALUES (?, ?, ?, ?)", [userId, token, deviceName, ip], () => {
                    res.status(201).json({ message: 'User registered successfully', token, user: { id: userId, name, phone, email, balance: 0, role: 'user' } });
                });
            });
        }`;

if (serverCode.replace(/\r\n/g, '\n').includes(oldInsertUser.replace(/\r\n/g, '\n'))) {
    serverCode = serverCode.replace(/\r\n/g, '\n').replace(oldInsertUser.replace(/\r\n/g, '\n'), newInsertUser);
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log("server.js updated with instant-token on register!");
} else {
    console.log("Notice: server.js insertUser pattern not matched directly.");
}

// 2. UPDATE PUBLIC/JS/APP.JS
const appJsPath = path.join(__dirname, 'public', 'js', 'app.js');
let appJsCode = fs.readFileSync(appJsPath, 'utf8');
const oldRegister = `            const data = await res.json();
            if (res.ok) return { success: true };
            return { success: false, error: data.error };`;
const newRegister = `            const data = await res.json();
            if (res.ok) return { success: true, data, token: data.token };
            return { success: false, error: data.error };`;

if (appJsCode.replace(/\r\n/g, '\n').includes(oldRegister.replace(/\r\n/g, '\n'))) {
    appJsCode = appJsCode.replace(/\r\n/g, '\n').replace(oldRegister.replace(/\r\n/g, '\n'), newRegister);
    fs.writeFileSync(appJsPath, appJsCode, 'utf8');
    console.log("public/js/app.js updated with token passthrough!");
}

// 3. UPDATE PUBLIC/LOGIN.HTML
const loginPath = path.join(__dirname, 'public', 'login.html');
let loginCode = fs.readFileSync(loginPath, 'utf8');

// A. Insert Global Loader HTML before </body>
const loaderHtml = `
    <!-- High-End Glassmorphic Global Transition Loader -->
    <div id="global-login-loader" class="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-xl transition-all duration-300 opacity-0 pointer-events-none">
        <div class="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-[280px] w-full text-center">
            <div class="relative flex items-center justify-center w-16 h-16">
                <div class="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-ping"></div>
                <div class="w-12 h-12 rounded-full border-[3px] border-t-orange-500 border-r-orange-400 border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <div class="flex flex-col items-center gap-1">
                <h4 class="text-white text-base font-bold tracking-tight" id="global-login-msg">প্রবেশ করা হচ্ছে...</h4>
                <p class="text-white/60 text-xs font-medium">অনুগ্রহ করে একটু অপেক্ষা করুন</p>
            </div>
        </div>
    </div>

    <script>
        function showGlobalLoginLoader(msg) {
            const el = document.getElementById('global-login-loader');
            if (el) {
                if (msg) document.getElementById('global-login-msg').innerText = msg;
                el.classList.remove('opacity-0', 'pointer-events-none');
                el.classList.add('opacity-100', 'pointer-events-auto');
            }
        }
        function hideGlobalLoginLoader() {
            const el = document.getElementById('global-login-loader');
            if (el) {
                el.classList.remove('opacity-100', 'pointer-events-auto');
                el.classList.add('opacity-0', 'pointer-events-none');
            }
        }
    </script>
`;

if (!loginCode.includes('id="global-login-loader"')) {
    loginCode = loginCode.replace('</body>', loaderHtml + '\n</body>');
    console.log("Added global loader HTML & JS to login.html.");
}

// B. Remove artificial setTimeout(1000) delays
loginCode = loginCode.replace(/await new Promise\(r => setTimeout\(r, 1000\)\);/g, '');
loginCode = loginCode.replace(/,\s*new Promise\(r => setTimeout\(r, 1000\)\)/g, '');
console.log("Removed artificial 1000ms delays from login.html.");

// C. Update Google Login Callback
const oldGoogleCallback = `                    callback: (response) => {
                        if (response && response.access_token) {
                            const mainBtn = document.querySelector('#login-container button.btn-premium');
                            if (mainBtn) {
                                mainBtn.innerHTML = '<div class="bouncing-dots"><div></div><div></div><div></div></div>';
                            }
                            
                            // Fetch user details from Google
                            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: \`Bearer \${response.access_token}\` }
                            })
                            .then(res => res.json())
                            .then(userInfo => {
                                // Send to our backend to create/login user
                                fetch('/api/google-login', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: userInfo.email, name: userInfo.name })
                                })
                                .then(res2 => res2.json())
                                .then(data => {
                                    if(data.token) {
                                        localStorage.setItem('userToken', data.token);
                                        localStorage.setItem('tpr_auth_provider', 'google');
                                        window.location.href = '/index.html';
                                    } else {
                                        showToast('Google login failed', 'error');
                                        if (mainBtn) mainBtn.innerHTML = 'LOG IN';
                                    }
                                }).catch(err => {
                                    showToast('Server error', 'error');
                                    if (mainBtn) mainBtn.innerHTML = 'LOG IN';
                                });
                            });
                        } else {
                            showToast('Google login failed or cancelled', 'error');
                        }
                    },`;

const newGoogleCallback = `                    callback: (response) => {
                        if (response && response.access_token) {
                            showGlobalLoginLoader('গুগল একাউন্টে প্রবেশ করা হচ্ছে...');
                            
                            // Fetch user details from Google
                            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: \`Bearer \${response.access_token}\` }
                            })
                            .then(res => res.json())
                            .then(userInfo => {
                                fetch('/api/google-login', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: userInfo.email, name: userInfo.name })
                                })
                                .then(res2 => res2.json())
                                .then(data => {
                                    if(data.token) {
                                        localStorage.setItem('userToken', data.token);
                                        localStorage.setItem('tpr_auth_provider', 'google');
                                        window.location.replace('/index.html');
                                    } else {
                                        hideGlobalLoginLoader();
                                        showToast('Google login failed', 'error');
                                    }
                                }).catch(err => {
                                    hideGlobalLoginLoader();
                                    showToast('Server error', 'error');
                                });
                            }).catch(err => {
                                hideGlobalLoginLoader();
                                showToast('Google auth error', 'error');
                            });
                        } else {
                            showToast('Google login cancelled', 'error');
                        }
                    },`;

if (loginCode.replace(/\r\n/g, '\n').includes(oldGoogleCallback.replace(/\r\n/g, '\n'))) {
    loginCode = loginCode.replace(/\r\n/g, '\n').replace(oldGoogleCallback.replace(/\r\n/g, '\n'), newGoogleCallback);
    console.log("Updated Google callback with instant loader & replace()!");
}

// D. Update finalizeRegistration to use instant token
const oldFinalizeReg = `        async function finalizeRegistration() {
            if (!pendingRegistrationData) return;
            const { name, phone, email, password } = pendingRegistrationData;
            const res = await window.APP.register(name, phone, email, password);
            if (res.success) {
                // Clear any old withdrawal PIN from local storage
                localStorage.removeItem('tpr_pin');
                
                // Auto-login the user
                const loginRes = await window.APP.login(email, password);
                if (loginRes.success) {
                    window.location.href = '/index.html';
                } else {
                    switchView('login-container');
                    document.getElementById('login-contact').value = email;
                    document.getElementById('login-password').value = password;
                }
            } else {
                showToast('Registration failed: ' + res.error, 'error');
            }
        }`;

const newFinalizeReg = `        async function finalizeRegistration() {
            if (!pendingRegistrationData) return;
            showGlobalLoginLoader('একাউন্ট তৈরি ও লগইন হচ্ছে...');
            const { name, phone, email, password } = pendingRegistrationData;
            const res = await window.APP.register(name, phone, email, password);
            if (res.success) {
                localStorage.removeItem('tpr_pin');
                if (res.token || (res.data && res.data.token)) {
                    localStorage.setItem('userToken', res.token || res.data.token);
                    localStorage.setItem('tpr_auth_provider', 'email');
                    window.location.replace('/index.html');
                    return;
                }
                const loginRes = await window.APP.login(email, password);
                if (loginRes.success) {
                    window.location.replace('/index.html');
                } else {
                    hideGlobalLoginLoader();
                    switchView('login-container');
                    document.getElementById('login-contact').value = email;
                    document.getElementById('login-password').value = password;
                }
            } else {
                hideGlobalLoginLoader();
                showToast('Registration failed: ' + res.error, 'error');
            }
        }`;

if (loginCode.replace(/\r\n/g, '\n').includes(oldFinalizeReg.replace(/\r\n/g, '\n'))) {
    loginCode = loginCode.replace(/\r\n/g, '\n').replace(oldFinalizeReg.replace(/\r\n/g, '\n'), newFinalizeReg);
    console.log("Updated finalizeRegistration with 1-shot login!");
}

// E. Update handleLogin with instant replace() and global loader
loginCode = loginCode.replace("window.location.href = '/index.html';", "window.location.replace('/index.html');");

fs.writeFileSync(loginPath, loginCode, 'utf8');
console.log("login.html optimizations complete!");
