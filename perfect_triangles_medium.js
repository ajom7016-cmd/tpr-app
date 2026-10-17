const fs = require('fs');
const path = require('path');

const currentTop = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScwLDkgMTAsOSA1LDInIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=';
const currentBottom = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScwLDEgMTAsMSA1LDgnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=';

const newTop = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDE3IDE5LDE3IDEwLDUnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=';
const newBottom = 'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgMTksMyAxMCwxNScgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(currentTop)) {
                content = content.replace(currentTop, newTop);
                content = content.replace(currentBottom, newBottom);
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Made triangles slightly thinner (90% of scrollbar width)');
