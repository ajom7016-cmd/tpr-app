const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Update bottom-nav CSS to make it float over the iframe
content = content.replace(
    /position: relative;\s*margin: 0 auto 12px auto;/g,
    `position: absolute;
        bottom: 12px;
        left: 0;
        right: 0;
        margin: 0 auto;`
);

fs.writeFileSync(file, content);
console.log('Made bottom-nav absolute to float over content');
