const fs = require('fs');

// 1. Fix Support Page
let supportFile = 'public/support_glass/code.html';
let supportContent = fs.readFileSync(supportFile, 'utf8');

const supportRegex = /<div class="absolute z-50 pl-1" style="top: 60px;">/;
if (supportContent.match(supportRegex)) {
    supportContent = supportContent.replace(supportRegex, '<div class="mb-1 -ml-2 mt-2 flex-none relative z-50" style="padding-left: 1.25rem;">');
    fs.writeFileSync(supportFile, supportContent);
    console.log('Fixed support_glass back button');
}

// 2. Fix Transaction History Page
let txFile = 'public/glassmorphic_3/code.html';
let txContent = fs.readFileSync(txFile, 'utf8');

const txRegex = /<div class="mb-4 mt-2 ml-2 flex-none relative z-50">/;
if (txContent.match(txRegex)) {
    // Match deposit_glass spacing exactly
    txContent = txContent.replace(txRegex, '<div class="mb-1 -ml-2 mt-2 flex-none relative z-50">');
    
    // Reduce the excessive top padding on the container below it
    txContent = txContent.replace(/<div class="max-w-\[400px\] mx-auto relative z-10 space-y-6 pt-6">/, '<div class="max-w-[400px] mx-auto relative z-10 space-y-6 pt-1">');
    
    fs.writeFileSync(txFile, txContent);
    console.log('Fixed glassmorphic_3 back button and spacing');
}
