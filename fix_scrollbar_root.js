const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldCSSRegex = /const s=d\.createElement\('style'\); s\.textContent='::-webkit-scrollbar[\s\S]*?d\.head\.appendChild\(s\);/g;

const newCSS = `const s=d.createElement('style'); s.textContent='html { overflow: hidden !important; } body { height: 100vh !important; overflow-y: auto !important; overflow-x: hidden !important; margin: 0; } ::-webkit-scrollbar { width: 6px !important; display: block !important; } ::-webkit-scrollbar-track { background: transparent !important; margin-top: 80px !important; margin-bottom: 110px !important; } ::-webkit-scrollbar-thumb { background-color: rgba(100, 110, 120, 0.5) !important; border-radius: 10px !important; border-right: 2px solid transparent !important; background-clip: padding-box !important; } ::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; } * { scrollbar-width: thin; scrollbar-color: rgba(100,110,120,0.5) transparent; }'; d.head.appendChild(s);`;

text = text.replace(oldCSSRegex, newCSS);

fs.writeFileSync(file, text);
console.log('Fixed scrollbar root issue so margins actually work');
