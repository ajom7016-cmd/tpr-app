const fs = require('fs');

let file = 'public/profile_settings_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the buggy script block with just let currentProfile = null;
const badCodeRegex = /\/\/ Load Avatar from localStorage[\s\S]*?document\.getElementById\('avatar-upload'\)\.addEventListener\('change', function\(e\) \{[\s\S]*?\}\);/g;

text = text.replace(badCodeRegex, '');

fs.writeFileSync(file, text);
console.log('Fixed profile settings JS errors');
