const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

// The global header is actually only ~58px tall, not 80px!
// Change pt-[81px] to pt-[60px] to actually leave a 1px gap.
content = content.replace(/pt-\[81px\]/g, 'pt-[60px]');

// Move back button left by another 4px (total -8px margin-left = -ml-2)
content = content.replace('mb-1 -ml-1 flex-none', 'mb-1 -ml-2 flex-none');

fs.writeFileSync(f, content);
console.log('Fixed real 1px gap and back button margin');
