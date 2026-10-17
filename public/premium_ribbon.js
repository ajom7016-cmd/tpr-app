const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// 1. Add the CSS for the premium ribbon
if (!html.includes('.vip-ribbon')) {
    const cssToAdd = `
        /* Premium VIP Ribbon */
        .vip-ribbon {
            position: absolute;
            top: -10px;
            left: -10px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 6px 24px;
            font-weight: 900;
            font-size: 14px;
            letter-spacing: 2px;
            box-shadow: 4px 4px 15px rgba(234, 88, 12, 0.4), inset 1px 1px 3px rgba(255,255,255,0.5);
            border-radius: 8px 8px 8px 0;
            z-index: 20;
            border: 1px solid rgba(255,255,255,0.2);
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .vip-ribbon::before {
            content: '';
            position: absolute;
            bottom: -10px;
            left: -1px;
            border-top: 10px solid #9a3412;
            border-left: 11px solid transparent;
        }
    `;
    
    html = html.replace('</style>', cssToAdd + '\n    </style>');
}

// 2. Replace the current badge with the new ribbon
const searchRegex = /<div class="absolute -top-6 left-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-\[16px\] font-black tracking-widest px-6 py-1 rounded-\[10px\] shadow-lg border border-slate-700 z-20">VIP<\/div>/g;

const replaceString = `<div class="vip-ribbon"><span class="material-symbols-outlined" style="font-size: 16px; color: #fef08a;">workspace_premium</span> VIP</div>`;

html = html.replace(searchRegex, replaceString);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Premium VIP Ribbon applied');
