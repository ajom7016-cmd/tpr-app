const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

content = content.replace(
    '<img src="../assets/nagad.png" alt="Nagad">', 
    '<img src="../assets/nagad.png" alt="Nagad" style="transform: scale(1.4);">'
);

content = content.replace(
    '<img src="../assets/binance.png" alt="Binance">', 
    '<img src="../assets/binance.png" alt="Binance" style="transform: scale(1.25);">'
);

content = content.replace(
    '<img src="../assets/bkash.png" alt="bKash">', 
    '<img src="../assets/bkash.png" alt="bKash" style="transform: scale(1.15);">'
);

// Also need to do the same for step-2 logo image which gets set via javascript!
// Wait, in step 2: `<img src="../assets/bkash.png" alt="Logo">`
// Let's just apply it via CSS!

let cssAdd = `
        /* Scale logos so they match in visual size */
        img[src*="nagad.png"] { transform: scale(1.4); }
        img[src*="binance.png"] { transform: scale(1.25); }
        img[src*="bkash.png"] { transform: scale(1.15); }
`;
if(!content.includes('img[src*="nagad.png"]')) {
    content = content.replace('</style>', cssAdd + '</style>');
}

fs.writeFileSync(f, content);
console.log('Fixed logo scales');
