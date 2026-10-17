const fs = require('fs');

// 1. Fix bank_details_glass
let file1 = 'public/bank_details_glass/code.html';
let text1 = fs.readFileSync(file1, 'utf8');

// Remove floating button
text1 = text1.replace(/<!-- Back Button \(Floating\) -->[\s\S]*?<\/div>/, '');

// Restore header-btn
const oldHeaderRegex = /<div class="flex items-center justify-between mb-6">[\s\S]*?<h1 class="text-\[24px\] font-black text-slate-800 tracking-tight text-right w-full">Bank Details<\/h1>\s*<\/div>/;

const newHeader = `<div class="flex items-center justify-between mb-8">
                <button class="header-btn" onclick="window.parent.loadPage('user_profile_premium_glass/code.html', null)">
                    <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
                </button>
                <h1 class="text-[20px] font-black text-slate-800 tracking-tight">Bank Details</h1>
            </div>`;

text1 = text1.replace(oldHeaderRegex, newHeader);

// Restore button size
text1 = text1.replace(/padding: 14px;/g, 'padding: 18px;');
text1 = text1.replace(/border-radius: 16px;/g, 'border-radius: 20px;');

fs.writeFileSync(file1, text1);

// 2. Fix refer_glass QR code dynamic generation
let file2 = 'public/refer_glass/code.html';
let text2 = fs.readFileSync(file2, 'utf8');

// Add ID to QR code image
text2 = text2.replace('<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tpr.app/ref/ofuptt" alt="QR Code" class="w-[120px] h-[120px]">', '<img id="qr-code-img" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tpr.app/ref/ofuptt" alt="QR Code" class="w-[120px] h-[120px]">');

// Update JS to set QR code source
const jsOld = `document.getElementById('ref-link-text').innerText = shareUrl;`;
const jsNew = `document.getElementById('ref-link-text').innerText = shareUrl;
        const qrImg = document.getElementById('qr-code-img');
        if (qrImg) qrImg.src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent(shareUrl)}\`;`;

if (text2.includes(jsOld) && !text2.includes('qrImg.src')) {
    text2 = text2.replace(jsOld, jsNew);
}

fs.writeFileSync(file2, text2);

console.log('Fixed bank details and refer QR');
