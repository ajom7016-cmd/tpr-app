const fs = require('fs');
const path = require('path');

// Let the default iframe scroll work - just style it
const scrollbarCSS = `<style id="custom-global-scrollbar">
  /* Thin scrollbar with arrows */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 8px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.5); }

  /* Arrow buttons */
  ::-webkit-scrollbar-button:vertical:decrement { display: block; height: 14px; background: transparent no-repeat center / 8px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolygon points='5,2 1,8 9,8' fill='%23ea580c'/%3E%3C/svg%3E"); }
  ::-webkit-scrollbar-button:vertical:increment { display: block; height: 14px; background: transparent no-repeat center / 8px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpolygon points='5,8 1,2 9,2' fill='%23ea580c'/%3E%3C/svg%3E"); }

  /* Firefox */
  * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.3) transparent; }
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
console.log('DONE - removed html/body overrides, styling default iframe scroll');
