const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTabsAndStyles() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // 1. ADD MISSING CONTENT DIVS right before </main>
    const settingsContent = `
        <!-- Deposit Requests -->
        <section id="tab-deposit" class="tab-content hide">
            <h2 class="text-3xl font-black text-slate-800 mb-8">ডিপোজিট রিকোয়েস্ট</h2>
            <div class="glass-3d rounded-[32px] overflow-hidden p-2">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th class="p-6 font-bold">তারিখ</th>
                            <th class="p-6 font-bold">ইউজার</th>
                            <th class="p-6 font-bold">মেথড ও TxID</th>
                            <th class="p-6 font-bold">অ্যামাউন্ট</th>
                            <th class="p-6 font-bold text-right">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody id="deposit-table">
                        <tr><td colspan="5" class="p-8 text-center font-bold text-slate-400">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Settings -->
        <section id="tab-settings" class="tab-content hide">
            <h2 class="text-3xl font-black text-slate-800 mb-8">অ্যাপ সেটিংস</h2>
            <div class="glass-3d rounded-[32px] p-8 max-w-2xl bg-white/40">
                <div class="space-y-6">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">অ্যাপের নাম</label>
                        <input type="text" id="set_app_name" class="w-full bg-white/60 border border-white/60 rounded-2xl px-4 py-3 font-bold text-slate-800 shadow-sm focus:outline-none focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">বিকাশ নাম্বার (ডিপোজিট)</label>
                        <input type="text" id="set_bkash" class="w-full bg-white/60 border border-white/60 rounded-2xl px-4 py-3 font-bold text-slate-800 shadow-sm focus:outline-none focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">নগদ নাম্বার (ডিপোজিট)</label>
                        <input type="text" id="set_nagad" class="w-full bg-white/60 border border-white/60 rounded-2xl px-4 py-3 font-bold text-slate-800 shadow-sm focus:outline-none focus:border-orange-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">হোমপেজ নোটিশ</label>
                        <textarea id="set_notice" class="w-full bg-white/60 border border-white/60 rounded-2xl px-4 py-3 font-bold text-slate-800 shadow-sm focus:outline-none focus:border-orange-500" rows="3"></textarea>
                    </div>
                    <button onclick="saveSettings()" class="w-full btn-gradient text-white font-black py-4 rounded-2xl shadow-[0_8px_20px_rgba(234,88,12,0.3)] active:scale-95 transition-transform tracking-widest mt-4">সেটিংস সেভ করুন</button>
                </div>
            </div>
        </section>
    `;
    
    if (!code.includes('id="tab-settings"')) {
        code = code.replace('</main>', settingsContent + '\n    </main>');
    }
    
    // 2. RE-ADD MISSING .active-nav CSS CLASS
    const activeNavStyle = `
        .active-nav { background-color: rgba(255, 237, 213, 0.8) !important; color: #ea580c !important; }
        .glass-3d { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.6); }
    </style>`;
    if (!code.includes('.active-nav {')) {
        code = code.replace('</style>', activeNavStyle);
    }
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
    console.log("Fixed missing content sections and missing active-nav styles!");
    ssh.dispose();
}
fixTabsAndStyles().catch(console.error);
