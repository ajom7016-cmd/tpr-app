const fs = require('fs');

let file = 'public/profile_settings_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const newScript = `        // Load Profile Data
        async function loadData() {
            try {
                let token = null;
                try {
                    token = window.parent.localStorage.getItem('userToken');
                } catch (e) {
                    // Ignore cross-origin or security errors
                }
                if (!token) {
                    try {
                        token = localStorage.getItem('userToken');
                    } catch (e) { }
                }

                if(!token) {
                    return; // No token, let it stay loading or maybe we should redirect.
                }

                const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                if(res.ok) {
                    currentProfile = await res.json();
                    document.getElementById('prof-name').value = currentProfile.name || '';
                    document.getElementById('prof-email').value = currentProfile.email || '';
                    document.getElementById('prof-phone').value = currentProfile.phone || '';
                    checkLock(); // Enforce 3-day lock if applicable
                }
            } catch(e) {
                console.error("Profile load error:", e);
            }
        }`;

content = content.replace(/async function loadData\(\) \{[\s\S]*?\} catch\(e\) \{\n\s*setFallback\(\);\n\s*\}\n\s*\}/, newScript);
content = content.replace(/function setFallback\(\) \{[\s\S]*?\}/, ''); // Remove the fallback function entirely

fs.writeFileSync(file, content);
console.log('Fixed token access in profile settings');
