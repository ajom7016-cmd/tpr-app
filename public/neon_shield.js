const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

const regex = /<div class="absolute -top-5 left-4 z-30 flex flex-col items-center drop-shadow-2xl">[\s\S]*?<\/div>\s*<\/div>/g;

const svgBadge = `
<div class="absolute -top-5 left-2 z-30">
    <svg viewBox="0 0 100 115" class="w-[85px] h-auto drop-shadow-2xl">
      <defs>
        <!-- Neon Glow Filter -->
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="neon-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Glass Shield Base (Outer Bevel Effect) -->
      <polygon points="50,2 96,27 96,87 50,112 4,87 4,27" 
               fill="#0f172a" 
               stroke="#334155" 
               stroke-width="1" />
               
      <polygon points="50,5 93,29 93,85 50,109 7,85 7,29" 
               fill="#1e293b" 
               stroke="#475569" 
               stroke-width="2" />

      <!-- Neon Glowing Inner Shield -->
      <polygon points="50,12 85,32 85,81 50,100 15,81 15,32" 
               fill="none" 
               stroke="#ff5e00" 
               stroke-width="2.5" 
               filter="url(#neon-glow-strong)" />
               
      <!-- Core bright line for inner shield -->
      <polygon points="50,12 85,32 85,81 50,100 15,81 15,32" 
               fill="none" 
               stroke="#ffedd5" 
               stroke-width="1" />

      <!-- VIP Text Glowing -->
      <text x="50" y="65" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="34" 
            fill="#ff5e00" 
            letter-spacing="1"
            text-anchor="middle" 
            filter="url(#neon-glow)">VIP</text>
            
      <!-- Core bright text -->
      <text x="50" y="65" 
            font-family="Inter, sans-serif" 
            font-weight="900" 
            font-size="34" 
            fill="#ffedd5" 
            letter-spacing="1"
            text-anchor="middle">VIP</text>

      <!-- Glowing Star -->
      <g filter="url(#neon-glow)" transform="translate(0, 10)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ff5e00" />
      </g>
      <!-- Core bright star -->
      <g transform="translate(0, 10)">
          <polygon points="50,68 52,73 57,73 53,76 54,81 50,78 46,81 47,76 43,73 48,73" fill="#ffedd5" />
      </g>
    </svg>
</div>
`;

html = html.replace(regex, svgBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Neon Shield VIP Badge applied');
