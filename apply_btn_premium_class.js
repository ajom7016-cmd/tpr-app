const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// The CSS for .btn-premium was injected successfully previously.
// Now, let's fix the HTML class on the button itself.
content = content.replace(
    /id="submit-btn" class="btn-theme[^"]+"/g,
    'id="submit-btn" class="btn-premium w-full py-4 rounded-full font-black text-[18px] tracking-wide flex items-center justify-center gap-2"'
);

fs.writeFileSync(file, content);
console.log('Successfully applied btn-premium class to the Withdraw button');
