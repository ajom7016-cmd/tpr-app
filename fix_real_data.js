const fs = require('fs');

let file = 'public/profile_settings_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldLoadData = /async function loadData\(\) \{[\s\S]*?\} catch\(e\) \{\n\s*console\.error\("Profile load error:", e\);\n\s*\}\n\s*\}/;

const newLoadData = `async function loadData() {
            try {
                // If the app.js is loaded in the parent, we can use it to fetch the profile
                if (window.parent && window.parent.APP && window.parent.APP.getProfile) {
                    currentProfile = await window.parent.APP.getProfile();
                } else if (window.APP && window.APP.getProfile) {
                    currentProfile = await window.APP.getProfile();
                } else {
                    // Fallback to fetch directly
                    const token = getToken();
                    if(!token) return;
                    
                    const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': \`Bearer \${token}\` }
                    });
                    if(res.ok) {
                        currentProfile = await res.json();
                    }
                }

                if(currentProfile) {
                    document.getElementById('prof-name').value = currentProfile.name || '';
                    document.getElementById('prof-email').value = currentProfile.email || '';
                    document.getElementById('prof-phone').value = currentProfile.phone || '';
                    
                    // Set Profile Header Image/Name if needed
                    const headerName = document.getElementById('header-name');
                    if (headerName && currentProfile.name) {
                        headerName.innerText = currentProfile.name;
                    }
                    
                    checkLock(); // Enforce 3-day lock if applicable
                }
            } catch(e) {
                console.error("Profile load error:", e);
            }
        }`;

content = content.replace(oldLoadData, newLoadData);

fs.writeFileSync(file, content);
console.log('Fixed loadData to properly get profile from server');
