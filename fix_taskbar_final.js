const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldNavCSSRegex = /\.bottom-nav\s*\{[\s\S]*?border-radius:\s*25px;\s*\/\*\s*Smaller radius\s*\*\/\s*\}/;
const newNavCSS = `.bottom-nav {
        position: absolute; /* Relative to device-mockup */
        bottom: 6px; /* Exactly 6px from the bottom as requested */
        left: 50%;
        transform: translateX(-50%);
        width: 92%; /* App's original measure */
        max-width: 400px;
        display: flex;
        justify-content: space-between;
        padding: 14px 24px; /* Original padding */
        z-index: 100;
        
        /* True Glassmorphism */
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%);
        backdrop-filter: blur(40px) saturate(150%);
        -webkit-backdrop-filter: blur(40px) saturate(150%);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 30px rgba(0,0,0,0.08), inset 0 2px 15px rgba(255,255,255,0.6);
        border-radius: 28px;
    }`;

text = text.replace(oldNavCSSRegex, newNavCSS);

// Revert the nav icons and fonts back to the original size
text = text.replace(/text-\[22px\]/g, "text-[24px]");
text = text.replace(/font-size:\s*10px;/g, "font-size: 11px;");

fs.writeFileSync(file, text);
console.log('Fixed bottom nav size, position (6px from bottom) and true glassmorphism');
