const fs = require('fs');
const path = require('path');

// 1. Update index.html
let indexFile = 'public/index.html';
let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace(
    '<header id="global-header" class="absolute top-0 left-0 w-full z-50">',
    '<header id="global-header" class="relative w-full z-50 shrink-0">'
);
fs.writeFileSync(indexFile, indexContent);
console.log('Updated index.html header to relative');

// 2. Remove padding-top from all subpages
function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html') && fullPath !== path.normalize('public/index.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            // Remove pt-[60px], pt-[64px], pt-[81px], pt-[82px] etc from body
            content = content.replace(/pt-\[\d+px\]/g, '');
            // Also just in case, clean up double spaces
            content = content.replace(/class="([^"]*)"/g, (match, p1) => {
                return 'class="' + p1.replace(/\s+/g, ' ').trim() + '"';
            });
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Removed top padding from:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('DONE');
