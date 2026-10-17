const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/margin-top: 65px !important;/g, "margin-top: 70px !important;");
text = text.replace(/margin-bottom: 90px !important;/g, "margin-bottom: 95px !important;");

fs.writeFileSync(file, text);
console.log('Made scrollbar 10px shorter (height)');
