const fs = require('fs');
let html = fs.readFileSync('public/security_change_pin/code.html', 'utf8');

// Update text descriptions
html = html.replace('4-digit PIN for withdrawals', '6-digit PIN for withdrawals');
html = html.replace(/Enter 4-digit/g, 'Enter 6-digit');
html = html.replace(/Confirm 4-digit/g, 'Confirm 6-digit');

// Update length checks
html = html.replace(/length < 4/g, 'length < 6');

// Update maxlength
html = html.replace(/maxlength="4"/g, 'maxlength="6"');

fs.writeFileSync('public/security_change_pin/code.html', html);
console.log('Fixed UI for 6 digits');
