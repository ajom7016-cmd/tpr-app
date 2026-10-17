const fs = require('fs');

let file = 'public/js/app.js';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('logout: function() {')) {
        // We found logout!
        // We know that `setWithdrawPin` is a few lines down.
        // We just need to insert the missing lines before `setWithdrawPin`
        let j = i;
        while (!lines[j].includes('setWithdrawPin:')) {
            j++;
        }
        // Insert right before j
        lines.splice(j, 0, "        try { window.parent.localStorage.removeItem('userToken'); } catch(e){}");
        lines.splice(j+1, 0, "        window.parent.location.href = '/login.html';");
        lines.splice(j+2, 0, "    },");
        lines.splice(j+3, 0, "");
        break;
    }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed app.js logout array splice!');
