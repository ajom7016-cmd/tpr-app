const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

const oldLogic = `if (activePage.title === 'PROFILE') {
                  topNavContainer.classList.remove('gap-4', 'gap-3');
                  topNavContainer.classList.add('gap-5');
              } else {
                  topNavContainer.classList.remove('gap-5');
                  topNavContainer.classList.add('gap-4');
              }`;
              
const newLogic = `if (activePage.title === 'PROFILE' || activePage.title === 'PLAN') {
                  topNavContainer.classList.remove('gap-4', 'gap-3', 'gap-5');
                  topNavContainer.classList.add('gap-6'); // 24px gap
              } else {
                  topNavContainer.classList.remove('gap-6', 'gap-5');
                  topNavContainer.classList.add('gap-5'); // 20px gap for everything else
              }`;

text = text.replace(oldLogic, newLogic);

fs.writeFileSync(file, text);
console.log('Increased gaps for PROFILE and PLAN');
