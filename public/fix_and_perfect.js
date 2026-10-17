const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Step 1: Remove the old SVG badge wrapper completely
const oldSvgRegex = /<div class="absolute -top-5 left-2 z-30">[\s\S]*?<\/svg>\s*<\/div>/g;
html = html.replace(oldSvgRegex, '');

// Step 2: Remove the leftover "Main Ribbon" garbage which includes TWO closing divs
const oldRibbonRegex = /\s*<!-- Main Ribbon -->[\s\S]*?<!-- 3D Ribbon Fold \(Left\) -->[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(oldRibbonRegex, '');

// Step 3: Now we inject the beautiful new SVG badge right after `<div class="flex justify-between items-start mb-6 relative z-10">`
const targetPoint = /<div class="flex justify-between items-start mb-6 relative z-10">/g;

const perfectSvgBadge = `<div class="flex justify-between items-start mb-6 relative z-10">
                
<div class="absolute -top-3 -left-1 z-30 group">
    <svg viewBox="0 0 120 130" class="w-[90px] h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300">
      <defs>
        <!-- Intense Neon Glow Filter -->
        <filter id="ultra-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur1"/>
          <feGaussianBlur stdDeviation="5" result="coloredBlur2"/>
          <feMerge>
            <feMergeNode in="coloredBlur2"/>
            <feMergeNode in="coloredBlur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>

      <!-- Glass Shield Base (Outer Bevel Effect) -->
      <polygon points="60,2 118,32 118,92 60,122 2,92 2,32" 
               fill="#0f172a" 
               stroke="#475569" 
               stroke-width="1.5" />
               
      <polygon points="60,6 114,34 114,90 60,118 6,90 6,34" 
               fill="url(#shield-grad)" 
               stroke="#334155" 
               stroke-width="2" />

      <!-- Neon Glowing Inner Shield Line -->
      <polygon points="60,16 104,39 104,85 60,108 16,85 16,39" 
               fill="none" 
               stroke="#ff5e00" 
               stroke-width="3.5" 
               filter="url(#ultra-glow)" />
               
      <polygon points="60,16 104,39 104,85 60,108 16,85 16,39" 
               fill="none" 
               stroke="#ffedd5" 
               stroke-width="1" />

      <!-- VIP Text Glowing -->
      <text x="60" y="72" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="34" 
            fill="#ff5e00" 
            letter-spacing="1"
            text-anchor="middle" 
            filter="url(#ultra-glow)">VIP</text>
            
      <text x="60" y="72" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="34" 
            fill="#fff7ed" 
            letter-spacing="1"
            text-anchor="middle">VIP</text>

      <!-- Glowing Star -->
      <g filter="url(#ultra-glow)" transform="translate(10, 15)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff5e00" />
      </g>
      <g transform="translate(10, 15)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#fff7ed" />
      </g>
    </svg>
</div>`;

html = html.replace(targetPoint, perfectSvgBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Fixed broken card layouts and applied perfect ultra glow SVG');
