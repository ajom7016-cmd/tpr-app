const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/glassmorphic_1/code.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the blocking !important transforms in CSS
const oldCssBlock = `    .notice-marquee-track {
        display: inline-flex !important;
        width: max-content !important;
        white-space: nowrap !important;
        will-change: transform !important;
        -webkit-transform: translate3d(0, 0, 0) !important;
        transform: translate3d(0, 0, 0) !important;
        -webkit-animation: continuousMarquee 14s linear infinite !important;
        animation: continuousMarquee 14s linear infinite !important;
    }`;

const newCssBlock = `    @-webkit-keyframes continuousMarquee {
        0% { -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); }
        100% { -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); }
    }
    @keyframes continuousMarquee {
        0% { -webkit-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); }
        100% { -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); }
    }
    .notice-marquee-track {
        display: inline-flex !important;
        width: max-content !important;
        white-space: nowrap !important;
        will-change: transform;
        -webkit-animation: continuousMarquee 12s linear infinite !important;
        animation: continuousMarquee 12s linear infinite !important;
    }`;

// Replace in content
if (content.includes('transform: translate3d(0, 0, 0) !important;')) {
    const startIdx = content.indexOf('@-webkit-keyframes continuousMarquee');
    const endIdx = content.indexOf('@media (prefers-reduced-motion', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
        content = content.slice(0, startIdx) + newCssBlock + '\n    ' + content.slice(endIdx);
    }
}

// 2. Enhance setupNotice with smooth infinite scroll and JS animation check
const oldSetupMarker = 'function setupNotice(text) {';
const oldSetupEndMarker = 'function showNoticeModal() {';

const newSetupCode = `function setupNotice(text) {
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
                const itemHtml = \`<div class="inline-flex items-center gap-4 shrink-0 pr-6"><span class="text-[13.5px] font-bold text-slate-800 tracking-tight whitespace-nowrap">\${currentNoticeText}</span><span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-sm"></span></div>\`;
                track.innerHTML = itemHtml.repeat(4);
                container.classList.remove('hidden');

                // Check if CSS animation is actively moving after 500ms; if not, kickstart JS ticker
                setTimeout(() => {
                    let prevTransform = window.getComputedStyle(track).transform;
                    setTimeout(() => {
                        let currentTransform = window.getComputedStyle(track).transform;
                        if (prevTransform === currentTransform && prevTransform !== 'none') {
                            // CSS animation did not move, start JS smooth ticker
                            let pos = 0;
                            const step = () => {
                                pos -= 1.2;
                                if (Math.abs(pos) >= (track.scrollWidth / 2)) {
                                    pos = 0;
                                }
                                track.style.transform = \`translate3d(\${pos}px, 0, 0)\`;
                                requestAnimationFrame(step);
                            };
                            requestAnimationFrame(step);
                        }
                    }, 400);
                }, 300);
            }
        }

        `;

const sIdx = content.indexOf(oldSetupMarker);
const eIdx = content.indexOf(oldSetupEndMarker);
if (sIdx !== -1 && eIdx !== -1) {
    content = content.slice(0, sIdx) + newSetupCode + content.slice(eIdx);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully unlocked marquee animation with CSS + JS fallback!');
