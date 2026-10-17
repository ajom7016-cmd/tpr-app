const fs = require('fs');

const css = `
        /* White True Glassmorphic Spinning Badge */
        .badge-42-wrap {
            position: relative;
            width: 72px; height: 32px; border-radius: 16px;
            box-shadow: 0 6px 12px rgba(234, 88, 12, 0.08);
            z-index: 1;
        }
        
        /* The Glass Core (White Glassmorphism) */
        .badge-42-glass {
            position: absolute;
            inset: 0;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.45); /* White glass tint */
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1.5px solid rgba(255, 255, 255, 0.6);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 2;
        }
        
        /* The Masked Border Wrapper (Prevents bleeding into center) */
        .badge-42-border-wrap {
            position: absolute;
            inset: -1.5px;
            border-radius: 17.5px;
            padding: 1.5px; /* Border thickness */
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            z-index: 3;
            overflow: hidden;
            pointer-events: none;
        }
        
        /* The Spinning Gradient */
        .badge-42-border {
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: conic-gradient(from 0deg, transparent 0%, transparent 20%, #ea580c 30%, transparent 40%, transparent 70%, #fbbf24 80%, transparent 90%);
            animation: spin-border 2.5s linear infinite;
        }
        
        .badge-42-glass .vip-txt { font-weight: 900; font-size: 11px; color: #ea580c; letter-spacing: 1px; line-height: 1; margin-bottom: 1px; margin-top: 2px; position: relative;}
        .badge-42-glass .b42-star { font-size: 8px; color: #fbbf24; font-variation-settings: 'FILL' 1; filter: drop-shadow(0 1px 2px rgba(251, 191, 36, 0.4)); margin: 0 -1.5px; }
        .star-row { display: flex; align-items: center; justify-content: center; position: relative; }
        @keyframes spin-border { 100% { transform: rotate(360deg); } }
`;

// 1. Update glassmorphic_2/code.html
let codeHtml = fs.readFileSync('public/glassmorphic_2/code.html', 'utf8');

const cssRegexCode = /@property --angle\s*\{[\s\S]*?@keyframes spin-angle\s*\{[\s\S]*?\}/;
if (codeHtml.match(cssRegexCode)) {
    codeHtml = codeHtml.replace(cssRegexCode, css.trim());
}

const jsReplacement = '<div class="badge-42-wrap">' +
                      '  <div class="badge-42-glass">' +
                      '      <span class="vip-txt">VIP</span>' +
                      '      <div class="star-row">${starHtml}</div>' +
                      '  </div>' +
                      '  <div class="badge-42-border-wrap">' +
                      '      <div class="badge-42-border"></div>' +
                      '  </div>' +
                      '</div>';

codeHtml = codeHtml.replace(/<div class="badge-42">[\s\S]*?<\/div>\s*<\/div>/g, jsReplacement);
codeHtml = codeHtml.replace(/`<div class="badge-42">[\s\S]*?<\/div>`/g, '`' + jsReplacement + '`');

fs.writeFileSync('public/glassmorphic_2/code.html', codeHtml);
console.log('Updated code.html');

// 2. Update investment_premium_glass/vip.html
let vipHtml = fs.readFileSync('public/investment_premium_glass/vip.html', 'utf8');
const cssRegexVip = /@property --angle\s*\{[\s\S]*?@keyframes spin-angle\s*\{[\s\S]*?\}/;
if (vipHtml.match(cssRegexVip)) {
    vipHtml = vipHtml.replace(cssRegexVip, css.trim());
}

vipHtml = vipHtml.replace(/<div class="badge-42">\s*<span class="vip-txt">VIP<\/span>\s*<div class="star-row">([\s\S]*?)<\/div>\s*<\/div>/g, function(match, p1) {
    return '<div class="badge-42-wrap">' +
           '    <div class="badge-42-glass">' +
           '        <span class="vip-txt">VIP</span>' +
           '        <div class="star-row">' + p1 + '</div>' +
           '    </div>' +
           '    <div class="badge-42-border-wrap">' +
           '        <div class="badge-42-border"></div>' +
           '    </div>' +
           '</div>';
});

fs.writeFileSync('public/investment_premium_glass/vip.html', vipHtml);
console.log('Updated vip.html');
