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
            if (content.includes('right: -2px; /* Center over the 8px scrollbar */')) {
                content = content.replace('right: -2px; /* Center over the 8px scrollbar */', 'right: -4px; /* Exactly centered over the 8px scrollbar */');
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Moved arrows 2px more to the right');
