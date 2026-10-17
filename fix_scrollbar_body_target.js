const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldCSSRegex = /const s=d\.createElement\('style'\); s\.textContent='html \{[\s\S]*?d\.head\.appendChild\(s\);/g;

const newCSS = `const s=d.createElement('style'); s.textContent='html { overflow: hidden !important; height: 100% !important; } body { height: 100% !important; max-height: 100vh !important; overflow-y: auto !important; overflow-x: hidden !important; margin: 0 !important; } body::-webkit-scrollbar { width: 5px !important; display: block !important; } body::-webkit-scrollbar-track { background: transparent !important; margin-top: 80px !important; margin-bottom: 110px !important; } body::-webkit-scrollbar-thumb { background-color: rgba(100, 110, 120, 0.5) !important; border-radius: 10px !important; } body::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; }'; d.head.appendChild(s);`;

text = text.replace(oldCSSRegex, newCSS);

fs.writeFileSync(file, text);
console.log('Fixed scrollbar targeting body element specifically');
