const fs = require('fs');
let file = 'public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /appendMessage\("Error: " \+ err\.message \+ " \| Stack: " \+ err\.stack, false\);/g,
    'appendMessage("Network error. Please check your connection.", false);'
);

fs.writeFileSync(file, content);
console.log('Restored original UI error message');
