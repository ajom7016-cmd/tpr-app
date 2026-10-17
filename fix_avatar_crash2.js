const fs = require('fs');
let file = 'public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /const savedPic = localStorage\.getItem\('userProfilePic'\);\s*if \(savedPic\) \{[\s\S]*?document\.getElementById\('default-avatar'\)\.classList\.add\('hidden'\);\s*\}/;

const newCode = `const savedPic = localStorage.getItem('userProfilePic');
        if (savedPic) {
            const userAvatar = document.getElementById('user-avatar');
            const defaultAvatar = document.getElementById('default-avatar');
            if (userAvatar) {
                userAvatar.src = savedPic;
                userAvatar.classList.remove('hidden');
            }
            if (defaultAvatar) {
                defaultAvatar.classList.add('hidden');
            }
        }`;

if (regex.test(content)) {
    content = content.replace(regex, newCode);
    fs.writeFileSync(file, content);
    console.log('Successfully replaced the avatar logic using Regex!');
} else {
    console.log('Regex did not match!');
}
