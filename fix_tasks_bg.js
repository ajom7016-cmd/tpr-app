const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<body class="bg-premium-mesh min-h-screen pb-32">/, '<body class="min-h-screen pb-32" style="background-color: transparent !important;">');

fs.writeFileSync(file, content);
console.log('Made body transparent in tasks page');
