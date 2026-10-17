const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/glassmorphic_1/code.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Clean style tag
const oldStyleStart = '/* Authentic Always-Running Continuous Marquee Ticker */';
const oldStyleEnd = '.notice-glass-bar {';

const newStyle = `/* Pure Hardware-Accelerated Marquee Track */
    .notice-marquee-track {
        display: inline-flex !important;
        width: max-content !important;
        white-space: nowrap !important;
        will-change: transform;
    }

    `;

const sStart = content.indexOf(oldStyleStart);
const sEnd = content.indexOf(oldStyleEnd);
if (sStart !== -1 && sEnd !== -1) {
    content = content.slice(0, sStart) + newStyle + content.slice(sEnd);
}

// 2. Clean HTML container: remove mask-image
const oldHtmlContainer = `<div class="relative overflow-hidden w-full select-none" style="mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);">
                    <div id="notice-marquee-track" class="notice-marquee-track whitespace-nowrap">
                        <!-- Populated dynamically -->
                    </div>
                </div>`;

const newHtmlContainer = `<div class="relative overflow-hidden w-full select-none">
                    <div id="notice-marquee-track" class="notice-marquee-track whitespace-nowrap">
                        <!-- Populated dynamically -->
                    </div>
                </div>`;

if (content.includes(oldHtmlContainer)) {
    content = content.replace(oldHtmlContainer, newHtmlContainer);
} else {
    // Regex replace if slight whitespace difference
    content = content.replace(
        /<div class="relative overflow-hidden w-full select-none"[^>]*>\s*<div id="notice-marquee-track"[^>]*>[\s\S]*?<\/div>\s*<\/div>/,
        newHtmlContainer
    );
}

// 3. Bulletproof JS Ticker
const oldScriptStart = 'let currentNoticeText = ';
const oldScriptEnd = 'function showNoticeModal() {';

const newScript = `let currentNoticeText = '';
        let marqueeRaf = null;
        let marqueeOffset = 0;

        function startNoticeTicker() {
            const track = document.getElementById('notice-marquee-track');
            if (!track) return;
            if (marqueeRaf) {
                cancelAnimationFrame(marqueeRaf);
                marqueeRaf = null;
            }
            marqueeOffset = 0;
            const speed = 1.0; // Buttery-smooth 60fps ticker
            
            function step() {
                marqueeOffset -= speed;
                const halfWidth = track.scrollWidth / 2;
                if (halfWidth > 0 && Math.abs(marqueeOffset) >= halfWidth) {
                    marqueeOffset = 0;
                }
                track.style.transform = 'translate3d(' + marqueeOffset + 'px, 0, 0)';
                track.style.webkitTransform = 'translate3d(' + marqueeOffset + 'px, 0, 0)';
                marqueeRaf = requestAnimationFrame(step);
            }
            marqueeRaf = requestAnimationFrame(step);
        }

        function setupNotice(text) {
            if (!text || !text.trim()) {
                const container = document.getElementById('notice-container');
                if (container) container.classList.add('hidden');
                return;
            }
            currentNoticeText = text.trim();
            const container = document.getElementById('notice-container');
            const track = document.getElementById('notice-marquee-track');
            const modalText = document.getElementById('notice-modal-text');
            if (modalText) modalText.innerText = currentNoticeText;
            if (container && track) {
                const itemHtml = \`<div class="inline-flex items-center gap-4 shrink-0 pr-8"><span class="text-[13.5px] font-bold text-slate-800 tracking-tight whitespace-nowrap">\${currentNoticeText}</span><span class="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-sm"></span></div>\`;
                track.innerHTML = itemHtml.repeat(4);
                container.classList.remove('hidden');
                // Start ticker immediately
                startNoticeTicker();
            }
        }

        `;

const jsStart = content.indexOf(oldScriptStart);
const jsEnd = content.indexOf(oldScriptEnd);
if (jsStart !== -1 && jsEnd !== -1) {
    content = content.slice(0, jsStart) + newScript + content.slice(jsEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully installed 100% bulletproof JS RAF Marquee Ticker!');
