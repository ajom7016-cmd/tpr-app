const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/glassmorphic_1/code.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix old typos in code.html
content = content.replace('box-shadow: 0 15px৳5px', 'box-shadow: 0 15px 35px');
content = content.replace('box-shadow: 0 10px৳0px', 'box-shadow: 0 10px 20px');
content = content.replaceAll("'wght'৳00;", "'wght' 600;");

// 2. Pure True Glassmorphism CSS
const trueGlassCss = `    /* Authentic GPU-Accelerated True Glassmorphism Notice Styles */
    @keyframes marqueeScroll {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-50%, 0, 0); }
    }
    .notice-marquee-track {
        display: inline-flex;
        width: max-content;
        will-change: transform;
        transform: translate3d(0, 0, 0);
        animation: marqueeScroll 24s linear infinite;
    }
    .notice-glass-bar:hover .notice-marquee-track,
    .notice-glass-bar:active .notice-marquee-track {
        animation-play-state: paused;
    }

    .notice-glass-bar {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.45) 100%);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1.5px solid rgba(255, 255, 255, 0.9);
        border-bottom: 1.5px solid rgba(255, 255, 255, 0.5);
        border-right: 1.5px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.02);
        border-radius: 18px;
        transform: translateZ(0);
    }

    .notice-modal-glass {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.82) 100%);
        backdrop-filter: blur(30px) saturate(180%);
        -webkit-backdrop-filter: blur(30px) saturate(180%);
        border: 1.5px solid rgba(255, 255, 255, 0.95);
        border-bottom: 1.5px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25), inset 0 2px 5px rgba(255, 255, 255, 0.9);
        border-radius: 28px;
        transform: translateZ(0);
    }`;

// Replace CSS section
const cssStartMarker = '/* Lightweight Zero-Lag GPU Glassmorphic Notice Styles */';
const cssEndMarker = '</style>';
const cssStart = content.indexOf(cssStartMarker);
if (cssStart !== -1) {
    const cssEnd = content.indexOf(cssEndMarker, cssStart);
    content = content.slice(0, cssStart) + trueGlassCss + '\n    ' + content.slice(cssEnd);
}

// 3. True Glass Notice Ticker HTML
const oldTickerStart = '<!-- Dynamic Official Notice Ticker -->';
const oldTickerEnd = '<!-- Recent Earnings Grid (Dynamic) -->';

const trueGlassTicker = `<!-- Dynamic Official Notice Ticker -->
        <div id="notice-container" class="mt-2.5 mb-1 px-1 hidden transition-all duration-300">
            <div class="notice-glass-bar flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer active:scale-[0.99] transition-all" onclick="showNoticeModal()">
                <div class="flex items-center justify-center w-7 h-7 rounded-[11px] bg-gradient-to-tr from-amber-500 to-orange-500 text-white shrink-0 shadow-[0_3px_10px_rgba(245,158,11,0.35)]">
                    <span class="material-symbols-outlined text-[17px]">campaign</span>
                </div>
                <div class="relative overflow-hidden w-full select-none" style="mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);">
                    <div id="notice-marquee-track" class="notice-marquee-track flex whitespace-nowrap gap-8">
                        <!-- Populated dynamically -->
                    </div>
                </div>
                <div class="shrink-0 text-slate-400 pl-0.5">
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
            </div>
        </div>

        `;

const tStart = content.indexOf(oldTickerStart);
const tEnd = content.indexOf(oldTickerEnd);
if (tStart !== -1 && tEnd !== -1) {
    content = content.slice(0, tStart) + trueGlassTicker + content.slice(tEnd);
}

// 4. True Glass Modal HTML
const oldMStart = '<!-- Notice Detail Modal -->';
const oldMEnd = '<script>\n        let currentNoticeText';
const oldMEndCrlf = '<script>\r\n        let currentNoticeText';

const trueGlassModal = `<!-- Notice Detail Modal -->
    <div id="notice-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300" onclick="if(event.target === this) closeNoticeModal()">
        <div class="notice-modal-glass p-6 w-full max-w-sm transform scale-95 transition-all duration-300" id="notice-modal-card">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-[0_3px_12px_rgba(245,158,11,0.35)]">
                        <span class="material-symbols-outlined text-[24px]">campaign</span>
                    </div>
                    <div>
                        <h3 class="text-[17px] font-black text-slate-900 tracking-tight">জরুরি নোটিশ</h3>
                        <p class="text-[11px] text-slate-500 font-bold">অফিসিয়াল বার্তা</p>
                    </div>
                </div>
                <button onclick="closeNoticeModal()" class="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white shadow-sm flex items-center justify-center text-slate-600 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
            <div class="bg-white/60 border border-white/80 rounded-2xl p-4 my-3 max-h-[50vh] overflow-y-auto shadow-inner">
                <p id="notice-modal-text" class="text-slate-800 text-[14px] leading-relaxed whitespace-pre-wrap font-bold"></p>
            </div>
            <button onclick="closeNoticeModal()" class="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white font-bold text-[14px] shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform">
                বুঝেছি
            </button>
        </div>
    </div>

    `;

const mStart = content.indexOf(oldMStart);
let mEnd = content.indexOf(oldMEnd);
if (mEnd === -1) mEnd = content.indexOf(oldMEndCrlf);

if (mStart !== -1 && mEnd !== -1) {
    content = content.slice(0, mStart) + trueGlassModal + content.slice(mEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied authentic true glassmorphism to code.html!');
