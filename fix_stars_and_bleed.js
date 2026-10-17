const fs = require('fs');

function updateFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Fix the border wrap bleeding outside by setting inset to 0
    content = content.replace(/inset:\s*-1\.5px;/g, 'inset: 0;');
    content = content.replace(/border-radius:\s*17\.5px;/g, 'border-radius: 16px;');
    
    // Fix the orange drop shadow bleeding outside
    content = content.replace(/box-shadow:\s*0\s+6px\s+12px\s+rgba\(234,\s*88,\s*12,\s*0\.08\);/g, 'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); overflow: hidden;');

    // Make stars larger and more visible
    // From: .badge-42-glass .b42-star { font-size: 8px; color: #fbbf24; font-variation-settings: 'FILL' 1; filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.4)); margin: 0 -1.5px; }
    const oldStarCss = /\.badge-42-glass \.b42-star\s*\{[^}]*\}/;
    const newStarCss = `.badge-42-glass .b42-star { font-size: 10px; color: #fbbf24; font-variation-settings: 'FILL' 1; filter: drop-shadow(0 1px 2px rgba(234, 88, 12, 0.5)); margin: 0 -1px; }`;
    
    if (content.match(oldStarCss)) {
        content = content.replace(oldStarCss, newStarCss);
    }
    
    // Also move the border-wrap BEHIND the glass? No, if it's inset: 0, it overlaps the glass.
    // Actually, if it's on top (z-index 3), it will cover the edges of the glass, which is correct for a border.
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
}

updateFile('public/glassmorphic_2/code.html');
updateFile('public/investment_premium_glass/vip.html');
