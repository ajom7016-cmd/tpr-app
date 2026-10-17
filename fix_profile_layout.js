const fs = require('fs');

let file = 'public/user_profile_premium_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// 1. Add back the .list-btn CSS
const listBtnCSS = `
        .list-btn {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%);
            backdrop-filter: blur(40px) saturate(150%);
            -webkit-backdrop-filter: blur(40px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.7);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.03), inset 0 2px 10px rgba(255,255,255,0.4);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            position: relative;
            overflow: hidden;
        }

        .list-btn:hover {`;

text = text.replace(/\.list-btn:hover\s*\{/, listBtnCSS);

// 2. Add an onerror fallback to the avatar image
text = text.replace(/<img src="https:\/\/i.pravatar.cc\/300\?u=a042581f4e29026704d" alt="User" id="prof-avatar" class="w-full h-full object-cover rounded-full">/g, 
    `<img src="https://i.pravatar.cc/300?u=a042581f4e29026704d" alt="User" id="prof-avatar" class="w-full h-full object-cover rounded-full" onerror="this.onerror=null; this.src='https://i.pravatar.cc/300?u=a042581f4e29026704d'; localStorage.removeItem('userProfilePic');">`);


fs.writeFileSync(file, text);
console.log('Fixed profile page CSS and avatar fallback');
