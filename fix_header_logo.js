const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the image logo with the TPR CSS logo box
const oldLogoRegex = /<!-- App Logo -->\s*<img src="\/assets\/app-icon\.svg" alt="App Logo" class="w-11 h-11 shrink-0 rounded-\[12px\] ml-0\.5 object-contain shadow-sm border border-white\/50">/;

const newLogoHTML = `<!-- App Logo (Authentic TPR Box) -->
                <div class="tpr-logo-box w-[42px] h-[42px] shrink-0 rounded-[14px] ml-0.5 flex flex-col items-center justify-center relative overflow-hidden">
                    <span class="tpr-logo-text text-white font-black text-[15px] tracking-tighter leading-none z-10">TPR</span>
                    <div class="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent z-0"></div>
                </div>`;

text = text.replace(oldLogoRegex, newLogoHTML);

fs.writeFileSync(file, text);
console.log('Restored the TPR text logo box in the header');
