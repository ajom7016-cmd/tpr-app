const fs = require('fs');

let f = 'public/glassmorphic_1/code.html';
let s = fs.readFileSync(f, 'utf8');

const oldCode = `window.addEventListener('scroll', () => {
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'scroll',
                        scrollY: window.scrollY
                    }, '*');
                }
            });`;

const newCode = `let scrollTicking = false;
            window.addEventListener('scroll', () => {
                if (!scrollTicking && window.parent) {
                    window.requestAnimationFrame(() => {
                        window.parent.postMessage({
                            type: 'scroll',
                            scrollY: window.scrollY
                        }, '*');
                        scrollTicking = false;
                    });
                    scrollTicking = true;
                }
            }, { passive: true });`;

// Replace normalizing whitespace
s = s.replace(/window\.addEventListener\('scroll',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);/, newCode);
fs.writeFileSync(f, s, 'utf8');
console.log('Successfully patched scroll listener in glassmorphic_1/code.html');
