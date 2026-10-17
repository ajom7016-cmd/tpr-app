const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div class="w-12 h-12 rounded-\[18px\] bg-white\/20 border border-white\/30 flex items-center justify-center shadow-inner relative overflow-hidden">\s*<span class="material-symbols-outlined text-white text-\[24px\]">workspace_premium<\/span>\s*<img id="vip-user-pic" src="" class="w-full h-full object-cover hidden absolute inset-0 z-20">\s*<\/div>/;

if (content.match(regex)) {
    content = content.replace(regex, '${vipBadgeHtml}');
    fs.writeFileSync(file, content);
    console.log('Successfully injected vipBadgeHtml into the template string.');
} else {
    console.log('Regex did not match. Trying manual split/replace.');
    // fallback brute force
    const startStr = '<!-- Top Row -->\n                        <div class="flex justify-between items-start mb-3">';
    const endStr = '                            <div class="bg-white/10 border border-white/20 rounded-full py-1 px-2.5 flex items-center gap-1.5">';
    
    if (content.includes(startStr) && content.includes(endStr)) {
        const p1 = content.split(startStr)[0];
        const p2 = content.split(endStr)[1];
        
        content = p1 + startStr + '\n                            ${vipBadgeHtml}\n' + endStr + p2;
        fs.writeFileSync(file, content);
        console.log('Successfully injected vipBadgeHtml using brute force.');
    } else {
        console.log('Failed completely.');
    }
}
