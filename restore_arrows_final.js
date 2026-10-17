const fs = require('fs');
const path = require('path');

const arrowScrollbarCSS = `<style id="custom-global-scrollbar">
  html { overflow: hidden !important; height: 100% !important; }
  body { 
      height: 100% !important; 
      max-height: 100vh !important; 
      overflow-y: auto !important; 
  }
  
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.4);
  }
  
  ::-webkit-scrollbar-button:single-button {
    background-color: transparent;
    display: block;
    height: 16px;
    width: 12px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 10px;
  }
  
  /* UP ARROW (ORANGE) */
  ::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'%3E%3Cpath d='M12 6l-8 8h16z'/%3E%3C/svg%3E");
  }
  
  /* DOWN ARROW (ORANGE) */
  ::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'%3E%3Cpath d='M12 18l-8-8h16z'/%3E%3C/svg%3E");
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
                content = content.replace(regex, arrowScrollbarCSS);
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

processDir('public');
console.log('Restored arrows to scrollbar (Orange)');
