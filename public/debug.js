const fs = require('fs');
const html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');
const lines = html.split('\n');

for (let i = 270; i < 330; i++) {
    console.log(i + 1 + ': ' + lines[i]);
}
