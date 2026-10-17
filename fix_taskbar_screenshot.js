const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the bottom-nav CSS completely
const oldNavCSSRegex = /\.bottom-nav\s*\{[\s\S]*?border-radius:\s*28px;\s*\}/;
const newNavCSS = `.bottom-nav {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 92%;
        max-width: 400px;
        display: flex;
        justify-content: space-between;
        padding: 12px 28px;
        z-index: 100;
        
        /* Exact Glassmorphism from Screenshot */
        background: rgba(245, 247, 250, 0.85); /* Milky frosted white */
        backdrop-filter: blur(24px) saturate(120%);
        -webkit-backdrop-filter: blur(24px) saturate(120%);
        border: 1px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 2px 10px rgba(255, 255, 255, 0.5);
        border-radius: 30px;
    }`;

text = text.replace(oldNavCSSRegex, newNavCSS);

// Replace nav-item text styles
text = text.replace(/\.nav-item\s*\{[\s\S]*?text-decoration:\s*none;\s*\}/, `.nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #5b6982; /* Deep slate gray */
        text-decoration: none;
        font-family: 'Outfit', sans-serif;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
    }`);

// Replace nav-item active text styles
text = text.replace(/\.nav-item\.active\s*\{[\s\S]*?\}\s*\.nav-item\.active \.material-symbols-outlined\s*\{[\s\S]*?\}/, `.nav-item.active {
        color: #ff5454; /* Vibrant coral red */
    }
    .nav-item.active .material-symbols-outlined {
        color: #ff5454;
        font-variation-settings: 'FILL' 1;
    }`);

// Replace icon sizes in HTML
text = text.replace(/text-\[24px\]/g, "text-[26px]");

fs.writeFileSync(file, text);
console.log('Fixed bottom nav to match the exact screenshot');
