const fs = require('fs');

let file = 'public/deposit_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div id="global-back-btn" class="mb-4 mt-2 ml-2 flex-none relative z-50">/;
if (content.match(regex)) {
    content = content.replace(regex, '<div id="global-back-btn" class="mb-4 mt-2 flex-none relative z-50" style="margin-left: 5px;">');
    fs.writeFileSync(file, content);
    console.log('Moved deposit back button left by 3px (8px -> 5px)');
} else {
    console.log('Could not match button');
}
