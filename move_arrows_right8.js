const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('right: 0px;')) {
                content = content.replace('right: 0px;', 'right: -8px;');
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Moved arrows 8px to the right');
