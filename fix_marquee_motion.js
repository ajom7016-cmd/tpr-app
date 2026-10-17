const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/glassmorphic_1/code.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace Animation CSS (Always running, 14s speed, no pause on hover/touch)
const oldAnimMarker = '/* Authentic GPU-Accelerated True Glassmorphism Notice Styles */';
const oldAnimEndMarker = '.notice-glass-bar {';

const newAnimCss = `/* Authentic Always-Running Continuous Marquee Ticker */
    @-webkit-keyframes continuousMarquee {
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
        will-change: transform !important;
        -webkit-transform: translate3d(0, 0, 0) !important;
        transform: translate3d(0, 0, 0) !important;
        -webkit-animation: continuousMarquee 14s linear infinite !important;
        animation: continuousMarquee 14s linear infinite !important;
    }
    @media (prefers-reduced-motion: reduce) {
        .notice-marquee-track {
            -webkit-animation: continuousMarquee 14s linear infinite !important;
            animation: continuousMarquee 14s linear infinite !important;
        }
    }

    `;

const startIdx = content.indexOf(oldAnimMarker);
const endIdx = content.indexOf(oldAnimEndMarker);
if (startIdx !== -1 && endIdx !== -1) {
    content = content.slice(0, startIdx) + newAnimCss + content.slice(endIdx);
}

// 2. Clean HTML track classes
content = content.replace(
    'class="notice-marquee-track flex whitespace-nowrap gap-8"',
    'class="notice-marquee-track whitespace-nowrap"'
);

// 3. Update setupNotice itemHtml with clean spacing and seamless loop
const newItemHtml = 'const itemHtml = `<div class="inline-flex items-center gap-4 shrink-0 pr-6"><span class="text-[13.5px] font-bold text-slate-800 tracking-tight whitespace-nowrap">${currentNoticeText}</span><span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-sm"></span></div>`;';

content = content.replace(
    /const itemHtml = `.*?`;/s,
    newItemHtml
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated code.html with non-stop continuous marquee animation!');
