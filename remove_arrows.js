const fs = require('fs');
const path = require('path');

const noArrowsScrollbar = `<style id="custom-global-scrollbar">
  html { overflow: hidden !important; height: 100% !important; }
  body { 
      height: 100% !important; 
      max-height: 100vh !important; 
      overflow-y: auto !important; 
  }
  
  ::-webkit-scrollbar {
    width: 6px !important;
  }
  ::-webkit-scrollbar-track {
    background: transparent !important;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2) !important;
    border-radius: 10px !important;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.4) !important;
  }
  
  /* REMOVE ALL BUTTONS (ARROWS) */
  ::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
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
                const regex = /<style id="custom-global-scrollbar">[\s\S]*?<\/style>/;
                content = content.replace(regex, noArrowsScrollbar);
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

processDir('public');
console.log('Removed all arrows from scrollbars');
