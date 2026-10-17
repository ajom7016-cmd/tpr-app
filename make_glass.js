const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/background:\s*rgba\(245,\s*247,\s*250,\s*0\.85\);\s*\/\*\s*Milky frosted white\s*\*\//g, 'background: rgba(255, 255, 255, 0.45); /* True transparent glass */');
text = text.replace(/backdrop-filter:\s*blur\(24px\)\s*saturate\(120%\);/g, 'backdrop-filter: blur(35px) saturate(150%);');
text = text.replace(/-webkit-backdrop-filter:\s*blur\(24px\)\s*saturate\(120%\);/g, '-webkit-backdrop-filter: blur(35px) saturate(150%);');
text = text.replace(/border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.9\);/g, 'border: 1px solid rgba(255, 255, 255, 0.7);\n          border-bottom: 1px solid rgba(255, 255, 255, 0.3);');
text = text.replace(/box-shadow:\s*0\s*8px\s*32px\s*rgba\(0,\s*0,\s*0,\s*0\.08\),\s*inset\s*0\s*2px\s*10px\s*rgba\(255,\s*255,\s*255,\s*0\.5\);/g, 'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), inset 0 2px 15px rgba(255, 255, 255, 0.6);');

fs.writeFileSync(file, text);
console.log('Made the task bar more like glass by reducing opacity and enhancing blur/shadows');
