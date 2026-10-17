const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

const searchRegex = /<div class="vip-ribbon"><span class="material-symbols-outlined" style="font-size: 16px; color: #fef08a;">workspace_premium<\/span> VIP<\/div>/g;
const replaceString = `<img src="../assets/vip_badge_3d.png" class="absolute -top-4 -left-3 w-28 h-auto z-20 drop-shadow-xl rounded-[16px] border border-white/20" alt="VIP Badge">`;

html = html.replace(searchRegex, replaceString);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP image injected');
