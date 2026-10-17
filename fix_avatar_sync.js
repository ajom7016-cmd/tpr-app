const fs = require('fs');

const updateAvatarScript = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const savedPic = localStorage.getItem('userProfilePic');
        const profAvatar = document.getElementById('prof-avatar');
        if (savedPic && profAvatar) {
            profAvatar.src = savedPic;
        }
    });

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVATAR') {
            const profAvatar = document.getElementById('prof-avatar');
            if (profAvatar) {
                profAvatar.src = event.data.src;
            }
        }
    });
</script>
`;

// 1. profile_settings_glass
let file1 = 'public/profile_settings_glass/code.html';
let text1 = fs.readFileSync(file1, 'utf8');

// Remove camera icon
text1 = text1.replace(/<div class="avatar-edit shadow-md"[^>]*>[\s\S]*?<\/div>/, '');
text1 = text1.replace(/<input type="file" id="avatar-upload"[^>]*>/, '');
text1 = text1.replace(/<p class="text-\[12px\] font-bold text-slate-400">Tap to change photo<\/p>/, '');

if (!text1.includes('UPDATE_AVATAR')) {
    text1 = text1.replace('</body>', updateAvatarScript + '\n</body>');
}
fs.writeFileSync(file1, text1);


// 2. user_profile_premium_glass
let file2 = 'public/user_profile_premium_glass/code.html';
let text2 = fs.readFileSync(file2, 'utf8');

text2 = text2.replace('<img src="https://i.pravatar.cc/300?u=a042581f4e29026704d" alt="User" class="w-full h-full object-cover rounded-full">',
    '<img src="https://i.pravatar.cc/300?u=a042581f4e29026704d" alt="User" id="prof-avatar" class="w-full h-full object-cover rounded-full">');

if (!text2.includes('UPDATE_AVATAR')) {
    text2 = text2.replace('</body>', updateAvatarScript + '\n</body>');
}
fs.writeFileSync(file2, text2);

console.log('Fixed profile picture sync and removed edit icon');
