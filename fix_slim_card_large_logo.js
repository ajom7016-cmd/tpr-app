const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// Make the logo-box small again to slim down the card
content = content.replace(
    /class="logo-box w-12 h-12"/g,
    'class="logo-box w-10 h-10"'
);

// Scale up the logos inside the smaller box so they look big
content = content.replace(
    /style="transform: scale\(0\.75\);"/g,
    'style="transform: scale(0.95);"' // bKash (0.75 -> 0.95)
);

content = content.replace(
    /style="transform: scale\(1\.15\);"/g,
    'style="transform: scale(1.4);"' // Nagad (1.15 -> 1.4)
);

content = content.replace(
    /style="transform: scale\(0\.9\);"/g,
    'style="transform: scale(1.1);"' // Binance (0.9 -> 1.1)
);

fs.writeFileSync(file, content);
console.log('Made card slim and scaled up logos');
