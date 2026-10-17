const fs = require('fs');

let file = 'public/refer_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// The current header looks like this:
/*
<body class="pt-[90px] pb-24" style="background-color: transparent;">
<div class="max-w-[400px] mx-auto px-6 relative z-10 space-y-6">
        <div class="flex items-center justify-center mb-2">
            <h1 class="text-[24px] font-black tracking-tight text-slate-800">My Team</h1>
        </div>
        
        <div class="glass-card mb-6 flex flex-col items-center relative overflow-hidden p-6 w-full text-center">
*/

const btnStr = `
    <!-- Back Button (Floating) -->
    <div class="absolute z-50 pl-1" style="top: 60px; left: 20px;">
        <button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center p-2 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('user_profile_premium_glass/code.html', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>
    
`;

if (!text.includes('Back Button (Floating)')) {
    text = text.replace('<body class="pt-[90px] pb-24" style="background-color: transparent;">', '<body class="pt-[72px] pb-24" style="background-color: transparent;">' + btnStr);
}

// And inject the QR code
const qrStr = `
            <div class="qr-wrapper mb-6">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tpr.app/ref/ofuptt" alt="QR Code" class="w-[120px] h-[120px]">
            </div>
`;

if (!text.includes('qr-wrapper mb')) {
    text = text.replace('<div class="w-full text-left">', qrStr + '            <div class="w-full text-left">');
}

fs.writeFileSync(file, text);
console.log('Fixed refer_glass qr and button');
