const fs = require('fs');
const path = require('path');

const scrollbarCSS = `<style id="custom-global-scrollbar">
  /* Thin scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); border-radius: 8px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }
  * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.25) transparent; }

  /* Floating scroll arrows - flush right next to scrollbar */
  .scroll-arrow {
    position: fixed;
    right: 0;
    width: 8px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
    opacity: 0.8;
    pointer-events: auto;
  }
  .scroll-arrow:hover { opacity: 1; }
  .scroll-arrow svg { width: 8px; height: 8px; }
  .scroll-arrow-up { top: 0; }
  .scroll-arrow-down { bottom: 0; }
</style>
<div class="scroll-arrow scroll-arrow-up" onclick="window.scrollBy({top:-150,behavior:'smooth'})">
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><polygon points="5,2 1,8 9,8" fill="#ea580c"/></svg>
</div>
<div class="scroll-arrow scroll-arrow-down" onclick="window.scrollBy({top:150,behavior:'smooth'})">
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><polygon points="5,8 1,2 9,2" fill="#ea580c"/></svg>
</div>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('id="custom-global-scrollbar"')) {
                content = content.replace(/<style id="custom-global-scrollbar">[\s\S]*?<\/style>(\s*<div class="scroll-arrow[\s\S]*?<\/div>\s*<div class="scroll-arrow[\s\S]*?<\/div>)?/, scrollbarCSS);
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('DONE - arrows positioned flush with scrollbar');
