const fs = require('fs');
const path = require('path');

// Much more visible scrollbar - solid colors, wider
const scrollbarCSS = `<style id="custom-global-scrollbar">
  html { overflow: hidden !important; height: 100% !important; }
  body { 
      height: 100% !important; 
      max-height: 100vh !important; 
      overflow-y: auto !important; 
  }
  /* Visible scrollbar - 8px wide, solid dark thumb */
  body::-webkit-scrollbar { width: 8px; }
  body::-webkit-scrollbar-track { background: rgba(0,0,0,0.08); border-radius: 8px; }
  body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.35); border-radius: 8px; }
  body::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.5); }

  /* Arrow buttons - orange, clearly visible */
  body::-webkit-scrollbar-button:vertical:decrement { display: block; height: 14px; width: 8px; background-color: transparent; background-repeat: no-repeat; background-position: center; background-size: 8px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolygon points='5,2 1,8 9,8' fill='%23ea580c'/%3E%3C/svg%3E"); }
  body::-webkit-scrollbar-button:vertical:increment { display: block; height: 14px; width: 8px; background-color: transparent; background-repeat: no-repeat; background-position: center; background-size: 8px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolygon points='5,8 1,2 9,2' fill='%23ea580c'/%3E%3C/svg%3E"); }

  /* Firefox */
  * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.35) rgba(0,0,0,0.08); }
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
                content = content.replace(/<style id="custom-global-scrollbar">[\s\S]*?<\/style>/, scrollbarCSS);
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('DONE');
