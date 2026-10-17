const fs = require('fs');
const path = require('path');

const perfectCSS = `<style id="custom-global-scrollbar">
  /* Smooth, native-feeling scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); border-radius: 8px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }

  /* Perfectly aligned scrollbar buttons (Gray Triangles) */
  ::-webkit-scrollbar-button:single-button {
    background-color: transparent;
    display: block;
    height: 14px;
    width: 8px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 8px 8px;
  }
  
  /* Top Gray Triangle */
  ::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScxLDggOSw4IDUsMycgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
  }
  
  /* Bottom Gray Triangle */
  ::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgOSwzIDUsOCcgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
  }
</style>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('id="custom-global-scrollbar"')) {
                // Replace CSS
                content = content.replace(/<style id="custom-global-scrollbar">[\s\S]*?<\/style>/, perfectCSS);
                
                // Remove HTML floating arrows if they exist
                content = content.replace(/<div class="scroll-arrow[\s\S]*?<\/div>\s*/g, '');
                
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Restored perfect gray SVG triangles and removed HTML arrows');
