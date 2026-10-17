const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Fix the scroll listener
content = content.replace(/window\.addEventListener\('scroll', \(\) => \{\s*if \(window\.parent\) \{\s*window\.parent\.postMessage\(\{\s*type: 'scroll',\s*scrollY: window\.scrollY\s*\}, '\*'\);\s*\}\s*\)\(\);/g, `window.addEventListener('scroll', () => {
                if (window.parent) {
                    window.parent.postMessage({
                        type: 'scroll',
                        scrollY: window.scrollY
                    }, '*');
                }
            });`);

fs.writeFileSync(file, content);
console.log('Fixed the scroll event listener syntax error.');
