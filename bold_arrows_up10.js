const fs = require('fs');
const path = require('path');

const newArrowCSS = `  /* Floating scroll arrows - bigger, bolder, moved up */
  .scroll-arrow {
    position: fixed;
    right: -2px; /* Center over the 8px scrollbar */
    width: 16px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
    opacity: 0.9;
    pointer-events: auto;
  }
  .scroll-arrow:hover { opacity: 1; transform: scale(1.1); transition: 0.2s; }
  .scroll-arrow svg { width: 14px; height: 14px; }
  .scroll-arrow-up { top: 2px; }
  .scroll-arrow-down { bottom: 20px; }
</style>
<div class="scroll-arrow scroll-arrow-up" onclick="window.scrollBy({top:-200,behavior:'smooth'})">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ea580c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15l8-8 8 8"/></svg>
</div>
<div class="scroll-arrow scroll-arrow-down" onclick="window.scrollBy({top:200,behavior:'smooth'})">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ea580c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l8 8 8-8"/></svg>
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
                // Find the start of .scroll-arrow in the CSS and replace everything until the end of the file/divs
                const regex = /\/\* Floating scroll arrows[\s\S]*?<\/div>/;
                content = content.replace(regex, newArrowCSS);
                fs.writeFileSync(fullPath, content);
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDir('public');
console.log('Made arrows bigger, thicker, and moved down arrow up another 10px');
