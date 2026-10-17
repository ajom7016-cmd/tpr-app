const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

// Reduce body padding to exactly what's needed for the global header (82px)
content = content.replace(/px-4 pt-\[85px\] pb-24/g, 'px-4 pt-[82px] pb-24');

// Remove margin from the back button container
content = content.replace('mb-2 pl-1 flex-none', 'mb-1 pl-1 flex-none');

// Remove margin-top and reduce padding on step-1 and step-2
content = content.replace('p-5 fade-in w-full max-w-[400px] mx-auto', 'p-4 fade-in w-full max-w-[400px] mx-auto');
content = content.replace('p-5 hidden fade-in w-full max-w-[360px] mx-auto mt-0', 'p-4 hidden fade-in w-full max-w-[360px] mx-auto');

fs.writeFileSync(f, content);
console.log('Gaps minimized to the absolute minimum required');
