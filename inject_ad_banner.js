const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /(<div class="flex flex-col items-center gap-2 cursor-pointer searchable-item" onclick="window\.parent\.loadPage\('refer_glass\/code\.html', null\)">[\s\S]*?<\/div>\s*<\/div>)\s*<!-- Recent Earnings Grid \(Dynamic\) -->/m;

const adBannerHtml = `$1

        <!-- Ad Banner Space -->
        <div class="mt-4 mb-2 px-1">
            <div class="relative overflow-hidden bg-white/40 backdrop-blur-[20px] rounded-[24px] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-6 cursor-pointer group transition-all duration-300 hover:bg-white/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                
                <!-- Ad tag badge -->
                <div class="absolute top-3 left-4 px-2 py-0.5 rounded-full bg-slate-900/10 text-[9px] font-black tracking-widest uppercase text-slate-500">
                    ADVERTISEMENT
                </div>
                
                <!-- Decorative Elements -->
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-orange-400/10 rounded-full blur-[30px] pointer-events-none"></div>
                <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-sky-400/10 rounded-full blur-[30px] pointer-events-none"></div>

                <!-- Main Content -->
                <div class="w-12 h-12 rounded-[16px] bg-white/80 shadow-sm border border-white flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                    <span class="material-symbols-outlined text-[28px] text-slate-400" style="font-variation-settings: 'FILL' 1;">ad_units</span>
                </div>
                <h4 class="text-[16px] font-black text-slate-800 tracking-tight text-center">Place Banner Ad Here</h4>
                <p class="text-[12px] font-medium text-slate-500 mt-1 text-center max-w-[200px]">Optimal space for a 320x100 or native banner ad integration.</p>
            </div>
        </div>

        <!-- Recent Earnings Grid (Dynamic) -->`;

if (content.match(regex)) {
    content = content.replace(regex, adBannerHtml);
    fs.writeFileSync(file, content);
    console.log('Ad banner space injected into the dashboard below the icon grid.');
} else {
    console.log('Regex did not match.');
}
