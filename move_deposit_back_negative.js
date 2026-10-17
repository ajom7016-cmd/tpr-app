const fs = require('fs');

let file = 'public/deposit_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div id="global-back-btn" class="mb-4 mt-2 flex-none relative z-50" style="margin-left: 3px;">/;
if (content.match(regex)) {
    content = content.replace(regex, '<div id="global-back-btn" class="mb-4 mt-2 flex-none relative z-50" style="margin-left: -10px;">');
    fs.writeFileSync(file, content);
    console.log('Moved deposit back button significantly left (to -10px)');
} else {
    console.log('Could not match button');
}
