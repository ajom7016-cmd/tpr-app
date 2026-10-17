const fs = require('fs');
let html = fs.readFileSync('public/security_change_pin/code.html', 'utf8');

html = html.replace(/<input type="password" id="currPin" class="custom-input"/g, '<input type="password" id="currPin" class="custom-input" oninput="clearError(this.id)"');
html = html.replace(/<input type="password" id="newPin" class="custom-input"/g, '<input type="password" id="newPin" class="custom-input" oninput="clearError(this.id)"');
html = html.replace(/<input type="password" id="confPin" class="custom-input"/g, '<input type="password" id="confPin" class="custom-input" oninput="clearError(this.id)"');

fs.writeFileSync('public/security_change_pin/code.html', html);
console.log('Fixed PIN inline oninput');
