const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldCSSRegex = /body::-webkit-scrollbar \{ width: 5px !important; display: block !important; \} body::-webkit-scrollbar-track \{ background: transparent !important; margin-top: 80px !important; margin-bottom: 110px !important; \} body::-webkit-scrollbar-thumb \{ background-color: rgba\(100, 110, 120, 0\.5\) !important; border-radius: 10px !important; \} body::-webkit-scrollbar-button \{ display: none !important; width: 0 !important; height: 0 !important; \}/g;

const newCSS = `body::-webkit-scrollbar { width: 6px !important; display: block !important; } body::-webkit-scrollbar-track { background: transparent !important; margin-top: 80px !important; margin-bottom: 110px !important; } body::-webkit-scrollbar-thumb { background-color: rgba(100, 110, 120, 0.5) !important; border-radius: 10px !important; } body::-webkit-scrollbar-button { display: block !important; background-color: transparent !important; height: 12px !important; }`;

text = text.replace(oldCSSRegex, newCSS);

fs.writeFileSync(file, text);
console.log('Made scrollbar 1px thicker and re-enabled buttons (arrows)');
