const fs = require('fs');

const css = `
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .badge-42 {
            display: inline-flex; flex-direction: column; align-items: center; justify-content: center;
            width: 72px; height: 32px; border-radius: 16px; position: relative;
            background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px);
            box-shadow: 0 6px 12px rgba(234, 88, 12, 0.08);
            z-index: 1;
        }
        .badge-42::before {
            content: ''; position: absolute; inset: -1.5px; border-radius: 17.5px; padding: 1.5px;
            background: conic-gradient(from var(--angle), transparent 0%, transparent 20%, #ea580c 30%, transparent 40%, transparent 70%, #fbbf24 80%, transparent 90%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: spin-angle 2.5s linear infinite; z-index: -1; pointer-events: none;
        }
        .badge-42::after { display: none; }
        .badge-42 .vip-txt { font-weight: 900; font-size: 11px; color: #ea580c; letter-spacing: 1px; line-height: 1; margin-bottom: 1px; margin-top: 2px; z-index: 10; position: relative;}
        .badge-42 .b42-star { font-size: 8px; color: #fbbf24; font-variation-settings: 'FILL' 1; filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.4)); margin: 0 -1.5px; }
        .star-row { display: flex; align-items: center; justify-content: center; z-index: 10; position: relative; }
        @keyframes spin-angle { to { --angle: 360deg; } }
`;

function updateFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace the block from .badge-42 { down to @keyframes spin-border { ... }
    const regex = /\.badge-42\s*\{[\s\S]*?@keyframes spin-border\s*\{[\s\S]*?\}/;
    if (content.match(regex)) {
        content = content.replace(regex, css.trim());
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    } else {
        console.log('Regex failed for ' + file);
    }
}

updateFile('public/glassmorphic_2/code.html');
updateFile('public/investment_premium_glass/vip.html');
