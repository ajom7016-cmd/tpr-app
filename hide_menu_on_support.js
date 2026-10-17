const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Hide MENU toggle button on support page
content = content.replace(
    /if \(toggleBtn\) \{\s*toggleBtn\.style\.display = 'flex';/g,
    `if (toggleBtn) {
                  if (url.includes('support')) {
                      toggleBtn.style.display = 'none';
                  } else {
                      toggleBtn.style.display = 'flex';
                  }`
);

fs.writeFileSync(file, content);
console.log('Hidden MENU button on support page');
