const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldCardRegex = /<div class="w-full max-w-5xl mx-auto mb-8 px-1 sm:px-2">/;
const newCardContainer = '<div class="w-full max-w-5xl mx-auto mb-8" style="padding-left: 3px; padding-right: 3px;">';

if (content.match(oldCardRegex)) {
    content = content.replace(oldCardRegex, newCardContainer);
    fs.writeFileSync(file, content);
    console.log('Increased width by exactly 1px on left and 1px on right (reduced padding from 4px to 3px)');
} else {
    console.log('Could not match the container div in glassmorphic_2');
}
