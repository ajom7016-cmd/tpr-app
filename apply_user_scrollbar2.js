const fs = require('fs');
const path = require('path');

const newScrollbarCSS = `<style id="custom-global-scrollbar">
  html { overflow: hidden !important; height: 100% !important; }
  body { 
      height: 100% !important; 
      max-height: 100vh !important; 
      overflow-y: auto !important; 
  }
  
  ::-webkit-scrollbar {
    width: 12px !important;
  }
  ::-webkit-scrollbar-track {
    background: transparent !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #3f3f46 !important;
    border-radius: 10px !important;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #52525b !important;
  }
  ::-webkit-scrollbar-button:single-button {
    background-color: transparent !important;
    display: block !important;
    height: 12px !important;
    width: 12px !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    background-size: 8px !important;
  }
  ::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371717a'%3E%3Cpath d='M12 8l-6 6h12z'/%3E%3C/svg%3E") !important;
  }
  ::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371717a'%3E%3Cpath d='M12 16l-6-6h12z'/%3E%3C/svg%3E") !important;
  }
  ::-webkit-scrollbar-button:single-button:hover {
    background-color: rgba(0,0,0,0.05) !important;
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
                content = content.replace(regex, newScrollbarCSS);
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

processDir('public');
console.log('Updated to exactly use universal selector for scrollbar');
