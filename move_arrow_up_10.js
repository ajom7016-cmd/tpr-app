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
            if (content.includes('.scroll-arrow-down { bottom: 1px; }')) {
                content = content.replace('.scroll-arrow-down { bottom: 1px; }', '.scroll-arrow-down { bottom: 10px; }');
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Moved down arrow up by 10px');
