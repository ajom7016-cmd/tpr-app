const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldNavCSSRegex = /\.bottom-nav\s*\{[\s\S]*?box-shadow:\s*0\s*-5px\s*20px\s*rgba\(0,0,0,0\.03\);\s*\}/;
const newNavCSS = `.bottom-nav {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 92%;
        max-width: 400px;
        display: flex;
        justify-content: space-between;
        padding: 14px 24px;
        z-index: 100;
        background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 15px 35px rgba(0,0,0,0.05), inset 0 0 20px rgba(255,255,255,0.3);
        border-radius: 30px;
    }`;

text = text.replace(oldNavCSSRegex, newNavCSS);

// Make sure the active pill has a nice style
text = text.replace(/\.nav-item\.active\s*\{[\s\S]*?\}\s*\.nav-item\.active \.material-symbols-outlined\s*\{[\s\S]*?\}/, `.nav-item.active {
        background: linear-gradient(135deg, #ff4d4d 0%, #ff8a3d 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        box-shadow: 0 4px 10px rgba(255, 77, 77, 0.3);
        flex-direction: row;
        gap: 6px;
    }
    .nav-item.active .material-symbols-outlined {
        color: white;
        font-variation-settings: 'FILL' 1;
    }`);

fs.writeFileSync(file, text);
console.log('Restored the floating Macbook/iPhone dock style for the bottom nav');
