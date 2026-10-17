const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Update bottom-nav CSS to sit 5px from the bottom
content = content.replace(
    /position: absolute;\s*bottom: 1px;/g,
    `position: absolute;
        bottom: 5px;`
);

fs.writeFileSync(file, content);
console.log('Moved bottom-nav up by another 4px (total 5px)');
