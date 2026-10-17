const fs = require('fs');
const path = require('path');

const globalScrollbarCSS = `
<style id="custom-global-scrollbar">
html { overflow: hidden !important; height: 100% !important; }
body { 
    height: 100% !important; 
    max-height: 100vh !important; 
    overflow-y: auto !important; 
    overflow-x: hidden !important; 
    margin: 0 !important; 
}
body::-webkit-scrollbar { width: 8px !important; display: block !important; }
body::-webkit-scrollbar-track { 
    background: transparent !important; 
    margin-top: 80px !important; 
    margin-bottom: 110px !important; 
}
body::-webkit-scrollbar-thumb { 
    background-color: rgba(100, 110, 120, 0.5) !important; 
    border-radius: 10px !important; 
}
/* UP ARROW */
body::-webkit-scrollbar-button:vertical:decrement {
    display: block !important;
    height: 12px !important;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><polygon points='1,8 9,8 5,3' fill='%23555555'/></svg>");
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 8px 8px;
}
/* DOWN ARROW */
body::-webkit-scrollbar-button:vertical:increment {
    display: block !important;
    height: 12px !important;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><polygon points='1,3 9,3 5,8' fill='%23555555'/></svg>");
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 8px 8px;
}
</style>
`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html') && !fullPath.endsWith('index.html') && !fullPath.includes('admin') && !fullPath.includes('login') && !fullPath.includes('oauth')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/<style id="custom-global-scrollbar">[\s\S]*?<\/style>/g, '');
            if (content.includes('</head>')) {
                content = content.replace('</head>', globalScrollbarCSS + '</head>');
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

processDir('public');
console.log('Fixed SVGs for scrollbar arrows');
