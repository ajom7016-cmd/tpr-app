const fs = require('fs');
const path = require('path');

const cssToReplace = `.scroll-arrow {
    position: fixed;
    right: -4px; /* Exactly centered over the 8px scrollbar */
    width: 16px;
    height: 24px;`;

const newCSS = `.scroll-arrow {
    position: fixed;
    right: 0px; 
    width: 8px;
    height: 24px;`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('right: -4px;')) {
                // Also need to make sure we replace the width to 8px
                let newContent = content.replace(/right: -4px;[\s\S]*?width: 16px;/, 'right: 0px;\n    width: 8px;');
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Set width to 8px and right to 0px');
