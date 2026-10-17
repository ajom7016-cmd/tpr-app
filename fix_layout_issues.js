const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// 1. Fix the top nav text cut off (reduce font sizes and gaps)
text = text.replace(/let activeSize = 'text-\[13px\]';/g, "let activeSize = 'text-[12px]';");
text = text.replace(/let inactiveSize = activePage\.title === 'PROFILE' \? 'text-\[10px\]' : 'text-\[12px\]';/g, "let inactiveSize = 'text-[9px]';");

// The flex container has gap-4, change to gap-2
text = text.replace(/topNavContainer\.classList\.add\('gap-4'\);/g, "topNavContainer.classList.add('gap-2');");
text = text.replace(/topNavContainer\.classList\.remove\('gap-4'\);/g, "topNavContainer.classList.remove('gap-4');");

// Make the nav-links container allow slight overflow or just ensure it flexes better
text = text.replace(/<div id="nav-links" class="absolute inset-0 w-full h-full flex items-center/g, 
    '<div id="nav-links" class="absolute inset-0 w-full h-full flex items-center justify-center overflow-visible');


// 2. Fix the bottom nav (make it smaller, move it up, and make it absolute to the device mockup)
const oldNavCSSRegex = /\.bottom-nav\s*\{[\s\S]*?border-radius:\s*30px;\s*\}/;
const newNavCSS = `.bottom-nav {
        position: absolute; /* Absolute to device-mockup instead of fixed to window */
        bottom: 35px; /* Moved up */
        left: 50%;
        transform: translateX(-50%);
        width: 85%; /* Slightly smaller width */
        max-width: 360px;
        display: flex;
        justify-content: space-between;
        padding: 10px 20px; /* Smaller padding */
        z-index: 100;
        background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 15px 35px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.5);
        border-radius: 25px; /* Smaller radius */
    }`;

text = text.replace(oldNavCSSRegex, newNavCSS);

// Make the nav icons a bit smaller to fit the smaller bar
text = text.replace(/text-\[24px\]/g, "text-[22px]");
text = text.replace(/font-size:\s*11px;/g, "font-size: 10px;");

fs.writeFileSync(file, text);
console.log('Fixed top nav text cut off and bottom nav sizing/position');
