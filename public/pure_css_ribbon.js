const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

const oldImgRegex = /<img src="\.\.\/assets\/vip_badge_3d\.png" class="absolute -top-4 -left-3 w-28 h-auto z-20 drop-shadow-xl rounded-\[16px\] border border-white\/20" alt="VIP Badge">/g;

const pureCSSBadge = `
<div class="absolute -top-5 left-4 z-30 flex flex-col items-center drop-shadow-2xl">
    <!-- Glass strap -->
    <div class="w-8 h-12 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md border border-white/40 rounded-t-xl rounded-b-3xl shadow-inner relative flex justify-center items-end pb-1.5 z-0">
        <div class="w-3 h-3 rounded-full bg-slate-900/40 shadow-inner mb-1"></div>
        <div class="absolute -bottom-2 w-5 h-6 rounded-full border-[3px] border-yellow-400 shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-10" style="border-top-color: transparent;"></div>
    </div>
    
    <!-- Main Ribbon -->
    <div class="relative -mt-3 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-slate-900 rounded-tl-xl rounded-br-[25px] rounded-tr-[6px] rounded-bl-[6px] p-2.5 pt-4 pb-2.5 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-white/30 border-t-yellow-300/40" style="min-width: 75px;">
        
        <!-- Crown SVG -->
        <svg viewBox="0 0 24 24" fill="url(#gold-gradient)" class="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-0.5" style="filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.5));">
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
          </defs>
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
        </svg>
        
        <!-- VIP Text -->
        <span class="text-[22px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600" style="line-height: 1; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.8));">VIP</span>
        
        <!-- 3D Ribbon Fold (Right) -->
        <div class="absolute -right-2 top-3 w-4 h-10 bg-slate-800 rounded-r-lg -z-10 skew-y-[25deg] shadow-inner border-r border-t border-slate-600/50"></div>
        <!-- 3D Ribbon Fold (Left) -->
        <div class="absolute -left-2 bottom-2 w-4 h-8 bg-orange-800 rounded-l-lg -z-10 -skew-y-[25deg] shadow-inner border-l border-b border-orange-600/50"></div>
    </div>
</div>
`;

html = html.replace(oldImgRegex, pureCSSBadge);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('Pure CSS 3D Badge applied successfully');
