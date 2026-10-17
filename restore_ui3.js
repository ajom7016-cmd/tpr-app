const fs = require('fs');
let file = 'public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /appendMessage\("Network error: " \+ err\.message \+ " \| " \+ err\.stack, false\);/;
if (regex.test(content)) {
    content = content.replace(regex, 'appendMessage("Network error. Please check your connection.", false);');
    fs.writeFileSync(file, content);
    console.log('Restored UI string successfully');
} else {
    console.log('UI string not found');
}
