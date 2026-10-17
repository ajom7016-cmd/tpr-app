const fs = require('fs');

let indexFile = 'public/index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// Replace bottom-nav CSS
const oldCSS = `.bottom-nav {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(calc(-50% - 1px));`;

const newCSS = `.bottom-nav {
        position: relative;
        margin: 0 auto 12px auto;`;

if (content.includes('position: absolute;\n        bottom: 12px;\n        left: 50%;')) {
    content = content.replace(oldCSS, newCSS);
    fs.writeFileSync(indexFile, content);
    console.log('Updated bottom-nav to relative in index.html');
} else {
    console.log('Could not find exact CSS string. Here is the bottom-nav block:');
    const match = content.match(/\.bottom-nav\s*\{[^}]*\}/);
    if(match) console.log(match[0]);
}
