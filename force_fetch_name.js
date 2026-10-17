const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldJsRegex = /const fetchAndSetName = async \(\) => \{[\s\S]*?\}\s*catch\(e\) \{\}\s*\};\s*fetchAndSetName\(\);/m;

const newJs = `const fetchAndSetName = async () => {
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    
                    if (res.ok) {
                        const profile = await res.json();
                        if (profile && profile.name) {
                            const nameEl = document.getElementById('vip-user-name');
                            if (nameEl) {
                                nameEl.innerText = profile.name.split(' ')[0];
                            }
                        }
                    }
                }
            } catch(e) {
                console.error("Error fetching username:", e);
            }
        };
        fetchAndSetName();`;

if (content.match(oldJsRegex)) {
    content = content.replace(oldJsRegex, newJs);
    fs.writeFileSync(file, content);
    console.log('Replaced username fetching logic with direct fetch using userToken');
} else {
    console.log('Could not match fetchAndSetName block');
}
