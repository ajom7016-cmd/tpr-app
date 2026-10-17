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
body::-webkit-scrollbar-button:single-button {
    display: block !important;
    height: 14px !important;
    background-color: transparent !important;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 6px 6px;
}
/* UP ARROW */
body::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScxLDggOSw4IDUsMycgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
}
/* DOWN ARROW */
body::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgOSwzIDUsOCcgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
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
console.log('Fixed SVGs using Base64 encoding');
