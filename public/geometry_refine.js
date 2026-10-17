const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Aggressive regex to match the wrapper and the entire SVG inside it
const targetRegex = /<div class="absolute[^>]*z-30[^>]*group">[\s\S]*?<\/svg>\s*<\/div>/g;

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

      <!-- Refined 7-Sided Crest Base -->
      <polygon points="35,5 85,5 110,50 100,90 60,135 20,90 10,50" 
               fill="#0f172a" 
               stroke="#3b4b61" 
               stroke-width="1.5" />
               
      <!-- Inner Bevel -->
      <polygon points="38,8 82,8 106,51 97,87 60,129 23,87 14,51" 
               fill="url(#shield-grad)" 
               stroke="#0f172a" 
               stroke-width="2" />

      <!-- Neon Glowing Inner Shield Line -->
      <polygon points="40,15 80,15 101,53 93,85 60,122 27,85 19,53" 
               fill="none" 
               stroke="#ff4500" 
               stroke-width="4.5" 
               filter="url(#ultra-glow)" />
               
      <!-- White-hot inner core line -->
      <polygon points="40,15 80,15 101,53 93,85 60,122 27,85 19,53" 
               fill="none" 
               stroke="#fed7aa" 
               stroke-width="1.5" />

      <!-- VIP Text - Orange Glow -->
      <text x="60" y="66" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="32" 
            fill="#ff4500" 
            letter-spacing="1.5"
            text-anchor="middle" 
            filter="url(#ultra-glow)">VIP</text>
            
      <!-- VIP Text - Touch of white core -->
      <text x="60" y="66" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="32" 
            fill="#ffedd5" 
            letter-spacing="1.5"
            text-anchor="middle">VIP</text>

      <!-- Glowing Star - Orange Glow -->
      <g filter="url(#ultra-glow)" transform="translate(10, 16)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff4500" />
      </g>
      <!-- Glowing Star - White core -->
      <g transform="translate(10, 16)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#fed7aa" />
      </g>
    </svg>
</div>`;

const matches = html.match(targetRegex);
console.log('Found badges to update:', matches ? matches.length : 0);

html = html.replace(targetRegex, perfectSvgBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Successfully updated badges with refined geometry!');
