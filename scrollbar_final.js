const fs = require('fs');
const path = require('path');

// Thin scrollbar (6px) with proper body-scoped arrows
const scrollbarCSS = `<style id="custom-global-scrollbar">
  html { overflow: hidden !important; height: 100% !important; }
  body { 
      height: 100% !important; 
      max-height: 100vh !important; 
      overflow-y: auto !important; 
  }
  /* Thin scrollbar */
  body::-webkit-scrollbar { width: 6px; }
  body::-webkit-scrollbar-track { background: transparent; }
  body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 10px; }
  body::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.35); }

  /* Arrow buttons */
  body::-webkit-scrollbar-button { display: block; height: 14px; width: 6px; background-color: transparent; background-repeat: no-repeat; background-position: center; background-size: 6px 6px; }
  body::-webkit-scrollbar-button:vertical:decrement { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolygon points='5,2 1,8 9,8' fill='%23ea580c'/%3E%3C/svg%3E"); }
  body::-webkit-scrollbar-button:vertical:increment { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolygon points='5,8 1,2 9,2' fill='%23ea580c'/%3E%3C/svg%3E"); }

  /* Firefox */
  * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.18) transparent; }
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
console.log('DONE - thin scrollbar with orange arrows applied');
