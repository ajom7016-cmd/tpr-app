const fs = require('fs');
const file = 'public/glassmorphic_3/code.html';
if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    const match = '<p class="text-[14px] font-semibold text-slate-400 tracking-wide">Loading records...</p>';
    if (text.includes(match) && !text.includes('tabs-container')) {
        const inject = `<div class="max-w-[400px] mx-auto relative z-10 space-y-6">
        <h1 class="text-[24px] font-black text-slate-800 tracking-tight pl-2 mb-2 text-center">Transaction History</h1>
        
        <div class="tabs-container px-2 pb-2">
            <button class="tab-btn active" onclick="switchTab('all', this)">All</button>
            <button class="tab-btn" onclick="switchTab('Deposit', this)">Deposits</button>
            <button class="tab-btn" onclick="switchTab('Withdraw', this)">Withdraws</button>
            <button class="tab-btn" onclick="switchTab('Task', this)">Tasks</button>
            <button class="tab-btn" onclick="switchTab('Referral', this)">Referrals</button>
        </div>

        <div id="loading-state" class="flex flex-col items-center justify-center mt-10">
            <div class="spinner mb-4"></div>`;
        text = text.replace('<p class="text-[14px] font-semibold text-slate-400 tracking-wide">Loading records...</p>', inject + '\n            ' + match);
        fs.writeFileSync(file, text);
        console.log('Restored ' + file);
    }
}
