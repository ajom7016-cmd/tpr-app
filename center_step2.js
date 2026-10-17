const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

// Center step-2 vertically
content = content.replace(
    'id="step-2" class="glass-panel p-4 hidden fade-in w-full max-w-[360px] mx-auto"',
    'id="step-2" class="glass-panel p-4 hidden fade-in w-full max-w-[360px] mx-auto my-auto"'
);

fs.writeFileSync(f, content);
console.log('Centered step-2 vertically');
