const fs = require('fs');
const file = 'public/user_profile_premium_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// Remove the floating back button block
text = text.replace(/<!-- Back Button \(Floating\) -->[\s\S]*?<\/div>\s*<\/div>/, ''); // handle multiple divs if any
// A safer regex for just the button block:
text = text.replace(/<!-- Back Button \(Floating\) -->\s*<div class="absolute z-50 pl-1" style="top: 60px; left: 20px;">\s*<button[^>]*>[\s\S]*?<\/button>\s*<\/div>/, '');

fs.writeFileSync(file, text);
console.log('Removed back button from main profile page');
