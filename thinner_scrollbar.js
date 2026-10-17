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
            if (content.includes('width: 8px;')) {
                // Change 8px to 7.5px for scrollbar width, border-radius, button width, and background-size
                content = content.replace(/::-webkit-scrollbar\s*\{\s*width:\s*8px;/g, '::-webkit-scrollbar { width: 7.5px;');
                content = content.replace(/border-radius:\s*8px;/g, 'border-radius: 7.5px;');
                content = content.replace(/width:\s*8px;/g, 'width: 7.5px;');
                content = content.replace(/background-size:\s*8px\s*8px;/g, 'background-size: 7.5px 7.5px;');
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Made scrollbar 0.5px thinner (7.5px)');
