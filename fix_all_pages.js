const fs = require('fs');

const floatingBtnTemplate = (backUrl) => `
    <!-- Back Button (Floating) -->
    <div class="absolute z-50 pl-1" style="top: 60px; left: 20px;">
        <button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center p-2 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('${backUrl}', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>
    `;

// 1. BANK DETAILS
let file1 = 'public/bank_details_glass/code.html';
let text1 = fs.readFileSync(file1, 'utf8');

// Ensure floating button is present, if not, add it to body
if (!text1.includes('Back Button (Floating)')) {
    text1 = text1.replace(/<body[^>]*>/, (m) => m + floatingBtnTemplate('user_profile_premium_glass/code.html'));
}

// Replace header with perfectly centered text
text1 = text1.replace(/<div class="flex items-center justify-between mb-8">[\s\S]*?<\/div>\s*<p[^>]*>.*?<\/p>/, 
    `<div class="flex flex-col items-center justify-center mb-6 w-full">
        <h1 class="text-[24px] font-black text-slate-800 tracking-tight text-center mb-1">Bank Details</h1>
        <p class="text-[13px] font-bold text-slate-500 text-center">Add your bKash, Nagad or Bank account</p>
    </div>`);

// Shrink button
text1 = text1.replace(/padding: 18px;/g, 'padding: 14px;');
text1 = text1.replace(/font-size: 16px;/g, 'font-size: 14px;');
text1 = text1.replace(/border-radius: 20px;/g, 'border-radius: 14px;');

fs.writeFileSync(file1, text1);


// 2. PROFILE SETTINGS
let file2 = 'public/profile_settings_glass/code.html';
let text2 = fs.readFileSync(file2, 'utf8');

// Ensure floating button is present
if (!text2.includes('Back Button (Floating)')) {
    text2 = text2.replace(/<body[^>]*>/, (m) => m + floatingBtnTemplate('user_profile_premium_glass/code.html'));
}

// Fix header
text2 = text2.replace(/<div class="px-6 mb-8 flex items-center justify-between relative z-10">[\s\S]*?<\/div>/, 
    `<div class="px-6 mb-8 flex items-center justify-center relative z-10 w-full">
        <h1 class="text-[24px] font-black text-slate-800 tracking-tight text-center">Edit Profile</h1>
    </div>`);

// Fix broken image
text2 = text2.replace(/\/assets\/profile-default\.jpg/g, 'https://i.pravatar.cc/300?u=a042581f4e29026704d');

fs.writeFileSync(file2, text2);

console.log('Fixed bank details and profile settings');
