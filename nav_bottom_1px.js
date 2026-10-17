const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Update bottom-nav CSS to sit 1px from the bottom
content = content.replace(
    /position: absolute;\s*bottom: 12px;/g,
    `position: absolute;
        bottom: 1px;`
);

fs.writeFileSync(file, content);
console.log('Moved bottom-nav to 1px from bottom');
