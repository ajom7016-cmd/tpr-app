const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const brokenTopCard = `<div class="glass-card p-5 relative overflow-hidden flex justify-between items-center mb-4">
              <h2 class="text-[34px] font-black tracking-tight text-slate-900 m-0">&#2547; <span id="user-balance">0.00</span></h2>
                <button class="btn-deposit" onclick="window.parent.loadPage('deposit_glass/code.html', this)">
                    Deposit <span class="material-symbols-outlined text-[16px] font-bold">add</span>
                </button>
            </div>`;

// Or in case of minor whitespace differences, regex it:
const brokenTopCardRegex = /<div class="glass-card p-5 relative overflow-hidden flex justify-between items-center mb-4">[\s\S]*?<\/button>\s*<\/div>/;

const perfectTopCard = `<div class="glass-card p-5 relative overflow-hidden mb-4">
              <div class="flex justify-between items-center w-full mb-1">
                  <p class="text-[13px] font-medium text-slate-700">Total Portfolio Value</p>
                  <div class="flex items-center gap-0.5 text-green-600">
                      <span class="material-symbols-outlined text-[14px]">arrow_upward</span>
                      <span class="text-[13px] font-bold">+ 5.8%</span>
                  </div>
              </div>
              <h2 class="text-[34px] font-black tracking-tight text-slate-900 mb-6">৳ <span id="user-balance">0.00</span></h2>
              <div class="flex justify-between items-end w-full">
                  <div>
                      <p class="text-[13px] font-medium text-slate-700 mb-1">Available Balance</p>
                      <h3 class="text-[20px] font-black text-slate-900">৳ <span id="today-income">0.00</span></h3>
                  </div>
                  <button class="btn-deposit" onclick="window.parent.loadPage('deposit_glass/code.html', this)">
                      Deposit <span class="material-symbols-outlined text-[16px] font-bold">add</span>
                  </button>
              </div>
          </div>`;

if (content.match(brokenTopCardRegex)) {
    content = content.replace(brokenTopCardRegex, perfectTopCard);
} else {
    // try literal if it fails
    content = content.replace(brokenTopCard, perfectTopCard);
}

// Restore JS
const brokenJS = `// Available Balance (using today_income for visual variety, or standard balance)
                    

                    // Total Earnings`;
const fixedJS = `// Available Balance (using today_income for visual variety, or standard balance)
                    const available = balance * 0.2; // Mock calculation based on total for design variety
                    document.getElementById('today-income').innerText = available.toLocaleString('en-IN', {minimumFractionDigits: 2});

                    // Total Earnings`;

content = content.replace(brokenJS, fixedJS);

// Ensure the other taka symbols are clean
content = content.replace(/&#2547;/g, '৳');

fs.writeFileSync(file, content);
console.log('Restored top card and javascript');
