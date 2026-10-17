const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/featured_seasonal_and_gifts/g, "card_giftcard");

fs.writeFileSync(file, text);
console.log('Changed Rewards icon to card_giftcard');
