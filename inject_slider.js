const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<!-- Ad Banner Space -->[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/m;

const bannerSliderHtml = `<!-- Premium Banners Carousel -->
        <div class="mt-4 mb-2 px-1">
            <div class="relative overflow-hidden rounded-[20px] shadow-[0_8px_25px_rgba(0,0,0,0.1)] w-full aspect-[2/1] sm:aspect-[21/9]">
                <!-- Track -->
                <div id="promo-banner-track" class="flex w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]">
                    <img src="/assets/banners/deposit.jpg" class="w-full h-full object-cover shrink-0" alt="First Deposit Bonus">
                    <img src="/assets/banners/vip.jpg" class="w-full h-full object-cover shrink-0" alt="VIP Upgrade">
                    <img src="/assets/banners/referral.jpg" class="w-full h-full object-cover shrink-0" alt="Referral Bonus">
                </div>
                <!-- Indicators -->
                <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                    <button class="promo-dot w-4 h-1.5 rounded-full bg-white transition-all duration-300"></button>
                    <button class="promo-dot w-1.5 h-1.5 rounded-full bg-white/50 transition-all duration-300"></button>
                    <button class="promo-dot w-1.5 h-1.5 rounded-full bg-white/50 transition-all duration-300"></button>
                </div>
            </div>
        </div>

        <script>
            // Banner Slider Logic
            document.addEventListener('DOMContentLoaded', () => {
                const track = document.getElementById('promo-banner-track');
                if(!track) return;
                const dots = document.querySelectorAll('.promo-dot');
                let currentIdx = 0;
                setInterval(() => {
                    currentIdx = (currentIdx + 1) % 3;
                    track.style.transform = \`translateX(-\${currentIdx * 100}%)\`;
                    dots.forEach((dot, i) => {
                        if(i === currentIdx) {
                            dot.classList.remove('w-1.5', 'bg-white/50');
                            dot.classList.add('w-4', 'bg-white');
                        } else {
                            dot.classList.remove('w-4', 'bg-white');
                            dot.classList.add('w-1.5', 'bg-white/50');
                        }
                    });
                }, 3500);
            });
        </script>`;

if (content.match(regex)) {
    content = content.replace(regex, bannerSliderHtml);
    fs.writeFileSync(file, content);
    console.log('Successfully injected the promo banners slider into the dashboard');
} else {
    console.log('Regex did not match for replacing the ad space');
}
