const fs = require('fs');
const path = require('path');

// 1. Remove the onload style injection from index.html
let indexFile = 'public/index.html';
let indexText = fs.readFileSync(indexFile, 'utf8');

const onloadRegex = /const s=d\.createElement\('style'\);[\s\S]*?d\.head\.appendChild\(s\);/g;
indexText = indexText.replace(onloadRegex, '');
fs.writeFileSync(indexFile, indexText);

// 2. The CSS to inject into all subpages
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
body::-webkit-scrollbar-button:vertical:decrement {
    display: block !important;
    height: 14px !important;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23646e78'><path d='M7 14l5-5 5 5z'/></svg>");
    background-repeat: no-repeat;
    background-position: center center;
}
body::-webkit-scrollbar-button:vertical:increment {
    display: block !important;
    height: 14px !important;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23646e78'><path d='M7 10l5 5 5-5z'/></svg>");
    background-repeat: no-repeat;
    background-position: center center;
}
</style>
`;

// Function to recursively find HTML files and inject CSS
function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html') && !fullPath.endsWith('index.html') && !fullPath.includes('admin') && !fullPath.includes('login') && !fullPath.includes('oauth')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Remove previous injections if any
            content = content.replace(/<style id="custom-global-scrollbar">[\s\S]*?<\/style>/g, '');
            
            // Inject new CSS right before </head>
            if (content.includes('</head>')) {
                content = content.replace('</head>', globalScrollbarCSS + '</head>');
                fs.writeFileSync(fullPath, content);
                console.log('Injected to ' + fullPath);
            }
        }
    }
}

processDir('public');
console.log('Done injecting scrollbar CSS globally to prevent jumping and add arrows!');
