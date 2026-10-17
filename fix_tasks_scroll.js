const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Fix Body
content = content.replace(
    '<body class="min-h-screen pb-32"',
    '<body class="pb-32"'
);

// Fix Main
content = content.replace(
    '<main class="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10 pb-32">',
    '<main class="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-4">'
);

// Fix Tasks Container margin bottom
content = content.replace(
    'id="tasks-container" class="max-w-3xl mx-auto flex flex-col gap-4 mb-10"',
    'id="tasks-container" class="max-w-3xl mx-auto flex flex-col gap-4 mb-2"'
);

fs.writeFileSync(file, content);
console.log('Fixed Tasks Page padding/scrolling issue!');
