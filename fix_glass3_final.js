const fs = require('fs');
let t = fs.readFileSync('public/glassmorphic_3/code.html', 'utf8');
if (!t.includes('switchTab')) {
    const inject = `<div class="max-w-[400px] mx-auto relative z-10 space-y-6 pt-6">
        <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full mb-6">Transaction History</h1>
        
        <div class="tabs-container px-2 pb-2">
            <button class="tab-btn active" onclick="switchTab('all', this)">All</button>
            <button class="tab-btn" onclick="switchTab('Deposit', this)">Deposits</button>
            <button class="tab-btn" onclick="switchTab('Withdraw', this)">Withdraws</button>
            <button class="tab-btn" onclick="switchTab('Task', this)">Tasks</button>
            <button class="tab-btn" onclick="switchTab('Referral', this)">Referrals</button>
        </div>

        <div id="loading-state" class="flex flex-col items-center justify-center mt-10">
            <div class="spinner mb-4"></div>
            <p class="text-[14px] font-semibold text-slate-400 tracking-wide">Loading records...</p>
        </div>`;
    t = t.replace('<p class="text-[14px] font-semibold text-slate-400 tracking-wide">Loading records...</p>', inject);
    fs.writeFileSync('public/glassmorphic_3/code.html', t);
    console.log('Fixed glassmorphic_3');
}
