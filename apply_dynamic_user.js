const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add the img tag to the user avatar circle
const oldAvatarRegex = /<div class="w-6 h-6 rounded-full bg-white\/10 overflow-hidden flex items-center justify-center border border-white\/20">\s*<span class="material-symbols-outlined text-white text-\[16px\]">person<\/span>\s*<\/div>/;

const newAvatarHtml = `<div class="w-6 h-6 rounded-full bg-white/10 overflow-hidden flex items-center justify-center border border-white/20 relative">
                        <img id="vip-user-pic" src="" class="w-full h-full object-cover hidden absolute inset-0 z-10" alt="Profile">
                        <span class="material-symbols-outlined text-white text-[16px] relative z-0">person</span>
                    </div>`;

if (content.match(oldAvatarRegex)) {
    content = content.replace(oldAvatarRegex, newAvatarHtml);
} else {
    console.log('Could not match avatar HTML block');
}

// 2. Update the Javascript to load the profile picture
const oldJsRegex = /\/\/ Set username dynamically for the new VIP card\s*try {[\s\S]*?document\.getElementById\('vip-user-name'\)\.innerText = mainUser\.name\.split\(' '\)\[0\];\s*}\s*} catch\(e\) {}/m;

const newJs = `// Set username dynamically for the new VIP card
    try {
        const userData = JSON.parse(localStorage.getItem('userVIP')) || {};
        let mainUser = {};
        try { mainUser = JSON.parse(window.parent.localStorage.getItem('user')); } catch(e) { mainUser = JSON.parse(localStorage.getItem('user')); }
        if (mainUser && mainUser.name) {
            document.getElementById('vip-user-name').innerText = mainUser.name.split(' ')[0];
        }
        
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
} else {
    console.log('Could not match JS block');
}

fs.writeFileSync(file, content);
console.log('Applied dynamic user name and profile picture to VIP card');
