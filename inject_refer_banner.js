const fs = require('fs');

let file = 'public/refer_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /(<h1 class="text-\[24px\] font-black tracking-tight text-slate-800">My Team<\/h1>\s*<\/div>)/;

const injectHtml = `$1
        
        <!-- Promo Banner (Referral) -->
        <div class="w-full relative overflow-hidden rounded-[20px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] mb-2 aspect-[21/9]">
            <img src="/assets/banners/referral.jpg" class="w-full h-full object-cover" alt="10% Referral Bonus">
        </div>`;

if (content.match(regex)) {
    content = content.replace(regex, injectHtml);
    fs.writeFileSync(file, content);
    console.log('Successfully injected referral banner into the refer page.');
} else {
    console.log('Regex did not match in refer page.');
}
