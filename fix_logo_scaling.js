const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /logoHtml = `<img src="\.\.\/assets\/bkash\.png" \/>`;/,
    'logoHtml = `<img src="../assets/bkash.png" style="transform: scale(0.75);" />`;'
);

content = content.replace(
    /logoHtml = `<img src="\.\.\/assets\/nagad\.png" \/>`;/,
    'logoHtml = `<img src="../assets/nagad.png" style="transform: scale(1.15);" />`;'
);

content = content.replace(
    /logoHtml = `<img src="\.\.\/assets\/binance\.png" \/>`;/,
    'logoHtml = `<img src="../assets/binance.png" style="transform: scale(0.9);" />`;'
);

fs.writeFileSync(file, content);
console.log('Fixed logo sizes by scaling them individually');
