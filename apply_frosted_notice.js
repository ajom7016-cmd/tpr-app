const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/glassmorphic_1/code.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update CSS
const oldCssMarker = `    /* Notice Marquee Animation */
    @keyframes marqueeScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }
    .notice-marquee-track {
        display: inline-flex;
        width: max-content;
        animation: marqueeScroll 24s linear infinite;
    }
    .notice-card:hover .notice-marquee-track,
    .notice-card:active .notice-marquee-track {
        animation-play-state: paused;
    }`;

const newCss = `    /* Lightweight Zero-Lag GPU Glassmorphic Notice Styles */
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
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.12) 100%);
        backdrop-filter: blur(24px) saturate(160%);
        -webkit-backdrop-filter: blur(24px) saturate(160%);
        border: 1px solid rgba(255, 255, 255, 0.75);
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        border-right: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03), inset 0 1px 4px rgba(255, 255, 255, 0.4);
        border-radius: 20px;
        transform: translateZ(0);
    }

    .notice-icon-box {
        background: linear-gradient(135deg, rgba(255, 149, 0, 0.25) 0%, rgba(255, 77, 77, 0.18) 100%);
        border: 1px solid rgba(255, 149, 0, 0.35);
        color: #ea580c;
        border-radius: 12px;
        box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
    }

    .notice-glass-modal {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0.25) 100%);
        backdrop-filter: blur(32px) saturate(170%);
        -webkit-backdrop-filter: blur(32px) saturate(170%);
        border: 1.5px solid rgba(255, 255, 255, 0.85);
        border-bottom: 1.5px solid rgba(255, 255, 255, 0.35);
        border-right: 1.5px solid rgba(255, 255, 255, 0.35);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12), inset 0 2px 10px rgba(255, 255, 255, 0.5);
        border-radius: 28px;
        transform: translateZ(0);
    }`;

// Replace CSS
if (content.includes('.notice-card:hover .notice-marquee-track')) {
    const startIdx = content.indexOf('/* Notice Marquee Animation */');
    const endIdx = content.indexOf('</style>', startIdx);
    content = content.slice(0, startIdx) + newCss + '\n    ' + content.slice(endIdx);
}

// 2. Replace Notice Bar HTML
const oldNoticeBarStart = '<!-- Dynamic Official Notice Ticker -->';
const oldNoticeBarEnd = '<!-- Recent Earnings Grid (Dynamic) -->';

const newNoticeBar = `<!-- Dynamic Official Notice Ticker -->
        <div id="notice-container" class="mt-2.5 mb-1 px-1 hidden transition-all duration-300">
            <div class="notice-glass-bar flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer active:scale-[0.99] transition-all" onclick="showNoticeModal()">
                <div class="notice-icon-box flex items-center justify-center w-7 h-7 shrink-0">
                    <span class="material-symbols-outlined text-[17px]">campaign</span>
                </div>
                <div class="relative overflow-hidden w-full select-none" style="mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);">
                    <div id="notice-marquee-track" class="notice-marquee-track flex whitespace-nowrap gap-8">
                        <!-- Populated dynamically -->
                    </div>
                </div>
                <div class="shrink-0 text-slate-500 pl-0.5">
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
            </div>
        </div>

        `;

const nBarIdx = content.indexOf(oldNoticeBarStart);
const regIdx = content.indexOf(oldNoticeBarEnd);
if (nBarIdx !== -1 && regIdx !== -1) {
    content = content.slice(0, nBarIdx) + newNoticeBar + content.slice(regIdx);
}

// 3. Replace Notice Modal HTML
const oldModalStart = '<!-- Notice Detail Modal -->';
const oldModalEnd = '<script>\n        let currentNoticeText';
const oldModalEndCrlf = '<script>\r\n        let currentNoticeText';

const newModal = `<!-- Notice Detail Modal -->
    <div id="notice-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300" onclick="if(event.target === this) closeNoticeModal()">
        <div class="notice-glass-modal p-6 w-full max-w-sm transform scale-95 transition-all duration-300" id="notice-modal-card">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="notice-icon-box w-10 h-10 flex items-center justify-center rounded-2xl">
                        <span class="material-symbols-outlined text-[24px]">campaign</span>
                    </div>
                    <div>
                        <h3 class="text-[17px] font-extrabold text-slate-900 tracking-tight">জরুরি নোটিশ</h3>
                        <p class="text-[11px] text-slate-500 font-semibold">অফিসিয়াল বার্তা</p>
                    </div>
                </div>
                <button onclick="closeNoticeModal()" class="w-8 h-8 rounded-full bg-white/40 hover:bg-white/70 border border-white/60 backdrop-blur-md flex items-center justify-center text-slate-600 transition-colors shadow-sm">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
            <div class="max-h-[55vh] overflow-y-auto pr-1 my-2">
                <p id="notice-modal-text" class="text-slate-800 text-[14px] leading-relaxed whitespace-pre-wrap font-semibold"></p>
            </div>
            <button onclick="closeNoticeModal()" class="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-white font-bold text-[14px] shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-transform">
                বুঝেছি
            </button>
        </div>
    </div>

    `;

const mIdx = content.indexOf(oldModalStart);
let sIdx = content.indexOf(oldModalEnd);
if (sIdx === -1) sIdx = content.indexOf(oldModalEndCrlf);

if (mIdx !== -1 && sIdx !== -1) {
    content = content.slice(0, mIdx) + newModal + content.slice(sIdx);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully converted notice bar & modal to pure, lightweight glassmorphism!');
