const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

// 1. Update the instruction text HTML
content = content.replace(
    'Send exactly <strong class="text-[#ea580c]">৳<span id="display-amount">1000</span></strong> to the <span id="instruction-app" class="font-bold">bKash</span> number below.',
    'Please <strong class="text-slate-900" id="instruction-action">Send Money</strong> exactly <strong class="text-[#ea580c]">৳<span id="display-amount">1000</span></strong> to the <span id="instruction-app" class="font-bold">bKash</span> number below.'
);

// 2. Update the number field HTML to have data-number
content = content.replace(
    '<span id="admin-number" class="text-[15px] font-semibold text-slate-800">01870161106</span>',
    '<span id="admin-number" data-number="01870161106" class="text-[15px] font-semibold text-slate-800 tracking-wider">01*******06</span>'
);

// 3. Update proceedToStep2 Javascript
const oldProceed = `
            if(selectedMethod === 'bkash') {
                instructionApp.innerText = 'bKash';
                numberField.innerText = adminNumber;
            } else if(selectedMethod === 'nagad') {
                instructionApp.innerText = 'Nagad';
                numberField.innerText = adminNumber;
            } else if(selectedMethod === 'binance') {
                instructionApp.innerText = 'Binance (USDT TRC20)';
                numberField.innerText = binanceAddress;
            }
`;

const newProceed = `
            const instructionAction = document.getElementById('instruction-action');
            if(selectedMethod === 'bkash') {
                instructionApp.innerText = 'bKash';
                numberField.innerText = adminNumber.substring(0,2) + '*******' + adminNumber.substring(adminNumber.length-2);
                numberField.setAttribute('data-number', adminNumber);
                if(instructionAction) instructionAction.innerText = 'Send Money';
            } else if(selectedMethod === 'nagad') {
                instructionApp.innerText = 'Nagad';
                numberField.innerText = adminNumber.substring(0,2) + '*******' + adminNumber.substring(adminNumber.length-2);
                numberField.setAttribute('data-number', adminNumber);
                if(instructionAction) instructionAction.innerText = 'Send Money';
            } else if(selectedMethod === 'binance') {
                instructionApp.innerText = 'Binance (USDT TRC20)';
                // Basic mask for Binance address (e.g. TCx...123)
                numberField.innerText = binanceAddress.substring(0,3) + '**********' + binanceAddress.substring(binanceAddress.length-3);
                numberField.setAttribute('data-number', binanceAddress);
                if(instructionAction) instructionAction.innerText = 'Transfer';
            }
`;
content = content.replace(oldProceed, newProceed);

// 4. Update copyNumber to use data-number instead of innerText
content = content.replace(
    "const number = document.getElementById('admin-number').innerText;",
    "const number = document.getElementById('admin-number').getAttribute('data-number');"
);

// We should also replace binanceAddress placeholder to be a realistic length so masking looks good
content = content.replace(
    "const binanceAddress = 'TCx... (USDT TRC20 Address)';",
    "const binanceAddress = 'TCxYourRealBinanceAddressHere123';"
);


fs.writeFileSync(f, content);
console.log('Fixed masking and send money instructions');
