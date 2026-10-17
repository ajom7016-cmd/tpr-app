const fs = require('fs');

let file1 = 'public/profile_settings_glass/code.html';
let text1 = fs.readFileSync(file1, 'utf8');

// Remove floating button
text1 = text1.replace(/<!-- Back Button \(Floating\) -->[\s\S]*?<\/div>/, '');

// Restore header-btn
const oldHeaderRegex = /<div class="px-6 mb-8 flex items-center relative z-10">\s*<h1 class="text-\[20px\] font-black text-slate-800 tracking-tight text-center w-full">Edit Profile<\/h1>\s*<\/div>/;

const newHeader = `<div class="px-6 mb-8 flex items-center justify-between relative z-10">
            <button class="header-btn" onclick="window.parent.loadPage('user_profile_premium_glass/code.html', null)">
                <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
            </button>
            <h1 class="text-[20px] font-black text-slate-800 tracking-tight pr-10">Edit Profile</h1>
        </div>`;

text1 = text1.replace(oldHeaderRegex, newHeader);

fs.writeFileSync(file1, text1);
console.log('Fixed profile settings inline button');
