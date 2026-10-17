const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const fixRegex = /\/\/ Set username dynamically for the new VIP card[\s\S]*?function startTask\(taskId\) \{/m;

const correctBlock = `// Set username dynamically for the new VIP card
    try {
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
    } catch(e) {}
    
    function startTask(taskId) {`;

if (content.match(fixRegex)) {
    content = content.replace(fixRegex, correctBlock);
    fs.writeFileSync(file, content);
    console.log('Fixed syntax error in glassmorphic_2 JS by cleaning up duplicated blocks');
} else {
    console.log('Could not match the broken block');
}
