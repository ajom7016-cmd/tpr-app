const fs = require('fs');

let file = 'public/js/app.js';
let content = fs.readFileSync(file, 'utf8');

const brokenLogout = `    // Logout
    logout: function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tpr_pin');
    setWithdrawPin: async function(currentPin, newPin) {`;

const fixedLogout = `    // Logout
    logout: function() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tpr_pin');
        try { window.parent.localStorage.removeItem('userToken'); } catch(e) {}
        window.parent.location.href = '/login.html';
    },

    setWithdrawPin: async function(currentPin, newPin) {`;

content = content.replace(brokenLogout, fixedLogout);

fs.writeFileSync(file, content);
console.log('Fixed app.js syntax error!');
