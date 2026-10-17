const fs = require('fs');
const path = require('path');

const oldTop = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScxLDggOSw4IDUsMycgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==';
const newTop = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScwLDkgMTAsOSA1LDInIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=';

const oldBottom = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgOSwzIDUsOCcgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==';
const newBottom = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScwLDEgMTAsMSA1LDgnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(oldTop)) {
                content = content.replace(oldTop, newTop);
                content = content.replace(oldBottom, newBottom);
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Made triangles thicker to match scrollbar width');
