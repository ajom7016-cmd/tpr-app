const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldCSS = /\.nav-item\.active\s*\{[\s\S]*?\}\s*\.nav-item\.active \.material-symbols-outlined\s*\{[\s\S]*?\}/;
const newCSS = `.nav-item.active {
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
    }`;

text = text.replace(oldCSS, newCSS);

// Let's also adjust the text sizes of the nav items to be smaller since the pill is horizontal
text = text.replace(/\.nav-item\s*\{[\s\S]*?\}/, `.nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #64748b;
        text-decoration: none;
        font-size: 11px;
        font-weight: 600;
        transition: all 0.3s ease;
    }`);

fs.writeFileSync(file, text);
console.log('Fixed index.html bottom nav CSS');
