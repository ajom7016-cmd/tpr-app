const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the specific PROFILE gap logic with just setting gap-3
const oldLogic = `// If we are on the PROFILE page, shrink gaps and side items to prevent cut-off
            if (activePage.title === 'PROFILE') {
                topNavContainer.classList.remove('gap-4');
                topNavContainer.classList.add('gap-1.5');
            } else {
                topNavContainer.classList.remove('gap-1.5');
                topNavContainer.classList.add('gap-2');
            }`;
            
const newLogic = `// Uniform gap for all pages
            topNavContainer.classList.remove('gap-1.5', 'gap-2', 'gap-4');
            topNavContainer.classList.add('gap-3');`;

text = text.replace(oldLogic, newLogic);

fs.writeFileSync(file, text);
console.log('Removed special profile gap logic');
