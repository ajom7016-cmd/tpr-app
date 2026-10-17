const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Replace the old SVG badge with the new diamond-shield pure neon badge
const targetRegex = /<div class="absolute -top-3 -left-1 z-30 group">[\s\S]*?<\/svg>\s*<\/div>/g;

const perfectSvgBadge = `<div class="absolute -top-4 -left-2 z-30 group">
    <svg viewBox="0 0 120 145" class="w-[82px] h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300">
      <defs>
        <!-- Intense Pure Neon Glow Filter (NO WHITE) -->
        <filter id="ultra-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur1"/>
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

      <!-- Sharp Diamond/Shield Base -->
      <polygon points="60,2 118,38 118,98 60,140 2,98 2,38" 
               fill="#0f172a" 
               stroke="#334155" 
               stroke-width="1.5" />
               
      <polygon points="60,8 113,41 113,95 60,134 7,95 7,41" 
               fill="url(#shield-grad)" 
               stroke="#1e293b" 
               stroke-width="2" />

      <!-- Pure Orange Neon Glowing Inner Shield Line -->
      <polygon points="60,19 103,47 103,89 60,123 17,89 17,47" 
               fill="none" 
               stroke="#ff4500" 
               stroke-width="4" 
               filter="url(#ultra-glow)" />
               
      <polygon points="60,19 103,47 103,89 60,123 17,89 17,47" 
               fill="none" 
               stroke="#ff6a00" 
               stroke-width="1.5" />

      <!-- VIP Text - Pure Orange Neon -->
      <text x="60" y="80" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="34" 
            fill="#ff4500" 
            letter-spacing="1.5"
            text-anchor="middle" 
            filter="url(#ultra-glow)">VIP</text>
            
      <text x="60" y="80" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="34" 
            fill="#ff8c00" 
            letter-spacing="1.5"
            text-anchor="middle">VIP</text>

      <!-- Glowing Star - Pure Orange -->
      <g filter="url(#ultra-glow)" transform="translate(10, 25)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff4500" />
      </g>
      <g transform="translate(10, 25)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff8c00" />
      </g>
    </svg>
</div>`;

html = html.replace(targetRegex, perfectSvgBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Applied diamond shape and pure orange neon glow');
