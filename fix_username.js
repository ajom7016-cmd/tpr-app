const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldJsRegex = /\/\/ Set username dynamically for the new VIP card[\s\S]*?\} catch\(e\) \{\}/m;

const newJs = `// Set username dynamically for the new VIP card
    try {
        // Fetch real name from backend via global APP object
        const fetchAndSetName = async () => {
            try {
                let appRef = window.APP;
                if (!appRef && window.parent && window.parent.APP) {
                    appRef = window.parent.APP;
                }
                if (appRef && appRef.getProfile) {
                    const profile = await appRef.getProfile();
                    if (profile && profile.name) {
                        const nameEl = document.getElementById('vip-user-name');
                        if (nameEl) {
                            nameEl.innerText = profile.name.split(' ')[0];
                        }
                    }
                }
            } catch(e) {}
        };
        fetchAndSetName();
        
        // Add Profile Pic Logic
        let profilePic = null;
        try { profilePic = window.parent.localStorage.getItem('userProfilePic'); } catch(e) { profilePic = localStorage.getItem('userProfilePic'); }
        if (!profilePic) {
            try { profilePic = localStorage.getItem('userProfilePic'); } catch(e) {}
        }
        
        if (profilePic) {
            const picEl = document.getElementById('vip-user-pic');
            if (picEl) {
                picEl.src = profilePic;
                picEl.classList.remove('hidden');
            }
        }
        
        // Listen for profile pic updates from parent frame
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'profilePicUpdated') {
                let newPic = null;
                try { newPic = window.parent.localStorage.getItem('userProfilePic'); } catch(e) { newPic = localStorage.getItem('userProfilePic'); }
                if (newPic) {
                    const picEl = document.getElementById('vip-user-pic');
                    if (picEl) {
                        picEl.src = newPic;
                        picEl.classList.remove('hidden');
                    }
                }
            }
        });
    } catch(e) {}`;

if (content.match(oldJsRegex)) {
    content = content.replace(oldJsRegex, newJs);
    fs.writeFileSync(file, content);
    console.log('Fixed dynamic username fetching from API');
} else {
    console.log('Could not match JS block');
}
