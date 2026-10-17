const fs = require('fs');

let file = 'public/profile_settings_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const newLoadData = `async function loadData() {
            try {
                let token = getToken();
                
                if(!token) {
                    window.parent.location.href = '/login.html';
                    return;
                }

                const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                if(res.ok) {
                    currentProfile = await res.json();
                    document.getElementById('prof-name').value = currentProfile.name || 'No Name';
                    document.getElementById('prof-email').value = currentProfile.email || 'No Email';
                    document.getElementById('prof-phone').value = currentProfile.phone || 'No Phone';
                    
                    const headerName = document.getElementById('header-name');
                    if (headerName && currentProfile.name) {
                        headerName.innerText = currentProfile.name;
                    }
                    
                    checkLock();
                } else if (res.status === 401 || res.status === 403) {
                    // Token expired or invalid
                    try { window.parent.localStorage.removeItem('userToken'); } catch(e) {}
                    try { localStorage.removeItem('userToken'); } catch(e) {}
                    window.parent.location.href = '/login.html';
                } else {
                    document.getElementById('prof-name').value = 'API Error: ' + res.status;
                }
            } catch(e) {
                console.error("Profile load error:", e);
            }
        }`;

content = content.replace(/async function loadData\(\) \{[\s\S]*?\} catch\(e\) \{\n\s*document\.getElementById\('prof-name'\)[\s\S]*?\n\s*\}\n\s*\}/, newLoadData);

fs.writeFileSync(file, content);
console.log('Fixed profile loading to auto-logout on 403/401');
