const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

const targetRegex = /<div class="absolute[^>]*z-30[^>]*group">[\s\S]*?<\/svg>\s*<\/div>/g;

const perfectSvgBadge = `<div class="absolute -top-4 -left-2 z-30 group">
    <svg viewBox="0 0 120 125" class="w-[82px] h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300">
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
        <!-- Glass Edge Highlight Gradient -->
        <linearGradient id="glass-edge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1" />
          <stop offset="30%" stop-color="#475569" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
      </defs>

      <!-- 7-Sided Crest Base (Final Match to Reference) -->
      <polygon points="32,10 88,10 112,40 90,88 60,112 30,88 8,40" 
               fill="#0f172a" 
               stroke="url(#glass-edge)" 
               stroke-width="1.5" />
               
      <!-- Inner Bevel -->
      <polygon points="34,13 86,13 109,41 88,86 60,109 32,86 11,41" 
               fill="url(#shield-grad)" 
               stroke="#0f172a" 
               stroke-width="2" />

      <!-- Neon Glowing Inner Shield Line -->
      <polygon points="37,17 83,17 104,43 84,84 60,104 36,84 16,43" 
               fill="none" 
               stroke="#ff4500" 
               stroke-width="4.5" 
               filter="url(#ultra-glow)" />
               
      <!-- White-hot inner core line -->
      <polygon points="37,17 83,17 104,43 84,84 60,104 36,84 16,43" 
               fill="none" 
               stroke="#fed7aa" 
               stroke-width="1.5" />

      <!-- VIP Text - Orange Glow -->
      <text x="60" y="62" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="30" 
            fill="#ff4500" 
            letter-spacing="1.5"
            text-anchor="middle" 
            filter="url(#ultra-glow)">VIP</text>
            
      <!-- VIP Text - Touch of white core -->
      <text x="60" y="62" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="30" 
            fill="#ffedd5" 
            letter-spacing="1.5"
            text-anchor="middle">VIP</text>

      <!-- Glowing Star - Orange Glow -->
      <g filter="url(#ultra-glow)" transform="translate(10, 12)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff4500" />
      </g>
      <!-- Glowing Star - White core -->
      <g transform="translate(10, 12)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#fed7aa" />
      </g>
    </svg>
</div>`;

const matches = html.match(targetRegex);
console.log('Found badges to update:', matches ? matches.length : 0);

html = html.replace(targetRegex, perfectSvgBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Successfully applied final reference geometry!');
