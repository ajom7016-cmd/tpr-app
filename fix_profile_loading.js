const fs = require('fs');

let file = 'public/profile_settings_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// We need to add a fallback in loadData() so it doesn't get stuck on Loading...
const newScript = `        // Load Profile Data
        async function loadData() {
            try {
                const token = window.parent.localStorage.getItem('userToken') || localStorage.getItem('userToken');
                if(!token) {
                    setFallback();
                    return;
                }

                const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                if(res.ok) {
                    currentProfile = await res.json();
                    document.getElementById('prof-name').value = currentProfile.name || 'User';
                    document.getElementById('prof-email').value = currentProfile.email || 'user@example.com';
                    document.getElementById('prof-phone').value = currentProfile.phone || '01XXXXXXXXX';
                    checkLock(); // Enforce 3-day lock if applicable
                } else {
                    setFallback();
                }
            } catch(e) {
                setFallback();
            }
        }
        
        function setFallback() {
            document.getElementById('prof-name').value = 'Alexander Chen';
            document.getElementById('prof-email').value = 'alexander.chen@example.com';
            document.getElementById('prof-phone').value = '01870161106';
        }`;

content = content.replace(/async function loadData\(\) \{[\s\S]*?\} catch\(e\) \{\}\n\s*\}/, newScript);

fs.writeFileSync(file, content);
console.log('Added fallback to Edit Profile page to prevent stuck on Loading');
