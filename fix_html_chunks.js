const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Font
content = content.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Material+="stylesheet"/>',
    '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24" rel="stylesheet"/>'
);

// 2. Fix Top Triangle
content = content.replace(
    'background-image: url("data:image/svg+=");',
    'background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDE3IDE5LDE3IDEwLDUnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=");'
);

// 3. Fix Bottom Triangle
content = content.replace(
    'background-image: url("data:image/svg+==");',
    'background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgMTksMyAxMCwxNScgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");'
);

// 4. Fix Balance Section
const brokenBalance = `<span class="text-[13px] font-bold">+=\\"text-[34px] font-black tracking-tight text-slate-900 mb-7\\"> 3 <span id=\\"user-balance\\">0.00<\\/span><\\/h2>`;
// Wait, the regex replace messed it up. Let's just use string replace for exactly what is there.
const badHTMLChunk1 = `<span class="text-[13px] font-bold">+=\"text-[34px] font-black tracking-tight text-slate-900 mb-7\"> 3 <span id=\"user-balance\">0.00</span></h2>`;
const fixedHTMLChunk1 = `<span class="text-[13px] font-bold">+ 5.8%</span>
                  </div>
                  <!-- Navigates to Invest page / VIP page on click -->
                  <button class="btn-deposit" onclick="window.parent.loadPage('deposit_glass/code.html', this)">
                    Deposit <span class="material-symbols-outlined text-[16px] font-bold">add</span>
                  </button>
              </div>
              
              <h2 class="text-[34px] font-black tracking-tight text-slate-900 mb-7">৳ <span id="user-balance">0.00</span></h2>`;

content = content.replace(/<span class="text-\[13px\] font-bold">\+="text-\[34px\] font-black tracking-tight text-slate-900 mb-7"> 3 <span id="user-balance">0\.00<\/span><\/h2>/, fixedHTMLChunk1);
// Because of the weird  3 character, I should match carefully
content = content.replace(/<span class="text-\[13px\] font-bold">\+="text-\[34px\] font-black tracking-tight text-slate-900 mb-7">.*?<span id="user-balance">0\.00<\/span><\/h2>/, fixedHTMLChunk1);

// 5. Fix Earnings Card
const badHTMLChunk2 = `<p class="text-[12px] font-bold text-green-600">\+="glass-card p-4">
                  <p class="text-[12px] font-medium text-slate-700 mb-1">Invested Capital</p>
                  <h3 class="text-[18px] font-black text-slate-900 mb-1"> 3 <span id="user-invested">0.00</span></h3>
                <p class="text-[12px] font-bold text-green-600">\+="flex justify-between items-center w-full pt-2 pb-4 px-1">`;
const fixedHTMLChunk2 = `<p class="text-[12px] font-bold text-green-600">+ 7.2%</p>
              </div>
              <div class="glass-card p-4">
                  <p class="text-[12px] font-medium text-slate-700 mb-1">Invested Capital</p>
                  <h3 class="text-[18px] font-black text-slate-900 mb-1">৳ <span id="user-invested">0.00</span></h3>
                  <p class="text-[12px] font-bold text-green-600">+ 4.1%</p>
              </div>
          </div>
          
          <div class="flex justify-between items-center w-full pt-2 pb-4 px-1">`;

content = content.replace(/<p class="text-\[12px\] font-bold text-green-600">\+="glass-card p-4">[\s\S]*?<p class="text-\[12px\] font-bold text-green-600">\+="flex justify-between items-center w-full pt-2 pb-4 px-1">/, fixedHTMLChunk2);


fs.writeFileSync(file, content);
console.log('Restored broken HTML parts in glassmorphic_1');
