const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Replace the old diamond SVG badge with the flat-top shield SVG badge
const targetRegex = /<div class="absolute -top-4 -left-2 z-30 group">[\s\S]*?<\/svg>\s*<\/div>/g;

const perfectSvgBadge = `<div class="absolute -top-4 -left-2 z-30 group">
    <svg viewBox="0 0 120 145" class="w-[82px] h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300">
      <defs>
        <!-- Intense Neon Glow Filter -->
        <filter id="ultra-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur1"/>
          <feGaussianBlur stdDeviation="7" result="coloredBlur2"/>
          <feMerge>
            <feMergeNode in="coloredBlur2"/>
            <feMergeNode in="coloredBlur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#020617" />
        </linearGradient>
      </defs>

      <!-- Flat-Top Shield Base -->
      <polygon points="30,5 90,5 115,55 60,135 5,55" 
               fill="#0f172a" 
               stroke="#3b4b61" 
               stroke-width="1.5" />
               
      <polygon points="31,7 89,7 113,56 60,133 7,56" 
               fill="url(#shield-grad)" 
               stroke="#0f172a" 
               stroke-width="2" />

      <!-- Neon Glowing Inner Shield Line -->
      <polygon points="34,13 86,13 108,58 60,126 12,58" 
               fill="none" 
               stroke="#ff4500" 
               stroke-width="4.5" 
               filter="url(#ultra-glow)" />
               
      <polygon points="34,13 86,13 108,58 60,126 12,58" 
               fill="none" 
               stroke="#fed7aa" 
               stroke-width="1.5" />

      <!-- VIP Text - Orange Glow with touch of white core -->
      <text x="60" y="78" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="36" 
            fill="#ff4500" 
            letter-spacing="1.5"
            text-anchor="middle" 
            filter="url(#ultra-glow)">VIP</text>
            
      <text x="60" y="78" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="36" 
            fill="#ffedd5" 
            letter-spacing="1.5"
            text-anchor="middle">VIP</text>

      <!-- Glowing Star -->
      <g filter="url(#ultra-glow)" transform="translate(10, 30)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff4500" />
      </g>
      <g transform="translate(10, 30)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#fed7aa" />
      </g>
    </svg>
</div>`;

html = html.replace(targetRegex, perfectSvgBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Applied flat-top shield shape');
