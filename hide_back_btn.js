const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

// Add an ID to the global back button container
content = content.replace(
    '<div class="mb-1 -ml-2 flex-none">',
    '<div id="global-back-btn" class="mb-1 -ml-2 flex-none">'
);

// Hide it in proceedToStep2
content = content.replace(
    "step1.classList.add('hidden');",
    "step1.classList.add('hidden');\n            document.getElementById('global-back-btn').classList.add('hidden');"
);

// Show it in goBackToStep1
content = content.replace(
    "step1.classList.remove('hidden');",
    "step1.classList.remove('hidden');\n            document.getElementById('global-back-btn').classList.remove('hidden');"
);

fs.writeFileSync(f, content);
console.log('Fixed back button visibility on Step 2');
