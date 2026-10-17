const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceInjectTabs() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // 1. INJECT SIDEBAR TABS
    // Find the end of the nav block
    const navEnd = '</nav>';
    const newTabs = `
                <button onclick="switchTab('deposit')" id="tab-deposit" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-semibold hover:bg-slate-50 transition-colors">
                    <span class="material-symbols-outlined">payments</span>
                    ডিপোজিট রিকোয়েস্ট
                </button>
                <button onclick="switchTab('settings')" id="tab-settings" class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 font-semibold hover:bg-slate-50 transition-colors">
                    <span class="material-symbols-outlined">settings</span>
                    অ্যাপ সেটিংস
                </button>
    </nav>`;
    if (code.includes(navEnd) && !code.includes('switchTab(\'settings\')')) {
        code = code.replace(navEnd, newTabs);
    }
    
    // 2. INJECT TAB CONTENTS
    // Find where main-content ends (just before the closing </div> of main-content)
    // The safest place is right before the script tags, but wait, the content panels are inside <div id="main-content">
    // So let's insert it before <!-- Withdraw Requests -->
    
    const withdrawComment = '<!-- Withdraw Requests -->';
    const settingsContent = `
            <!-- Deposit Requests -->
            <div id="deposit-content" class="hide">
                <h2 class="text-3xl font-black text-slate-800 mb-8">ডিপোজিট রিকোয়েস্ট</h2>
                <div class="glass-card rounded-[32px] overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-200">
                                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">তারিখ</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ইউজার</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">মেথড ও TxID</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">অ্যামাউন্ট</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody id="deposit-table" class="divide-y divide-slate-100">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Settings -->
            <div id="settings-content" class="hide">
                <h2 class="text-3xl font-black text-slate-800 mb-8">অ্যাপ সেটিংস</h2>
                <div class="glass-card rounded-[32px] p-8 max-w-2xl">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">অ্যাপের নাম</label>
                            <input type="text" id="set_app_name" class="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 font-semibold text-slate-700">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">বিকাশ নাম্বার (ডিপোজিট)</label>
                            <input type="text" id="set_bkash" class="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 font-semibold text-slate-700">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">নগদ নাম্বার (ডিপোজিট)</label>
                            <input type="text" id="set_nagad" class="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 font-semibold text-slate-700">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-2 uppercase">হোমপেজ নোটিশ</label>
                            <textarea id="set_notice" class="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 font-semibold text-slate-700" rows="3"></textarea>
                        </div>
                        <button onclick="saveSettings()" class="btn-gradient text-white font-bold py-3 px-8 rounded-2xl shadow-md active:scale-95 transition-transform">সেভ করুন</button>
                    </div>
                </div>
            </div>
`;
    if (code.includes(withdrawComment) && !code.includes('id="settings-content"')) {
        code = code.replace(withdrawComment, settingsContent + '\n            ' + withdrawComment);
    }
    
    // 3. INJECT JS LOGIC
    // We can use a regex to find loadAllData() { ... } and add our fetches
    code = code.replace('await fetchWithdraws();', 'await fetchWithdraws();\n            await fetchDeposits();\n            await fetchSettings();');
    
    // Append the new functions before the closing script tag
    const scriptFuncs = `
        async function fetchDeposits() {
            try {
                const res = await fetch('/api/admin/deposits', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') } });
                const deposits = await res.json();
                const tbody = document.getElementById('deposit-table');
                tbody.innerHTML = deposits.map(d => \`
                    <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="px-6 py-4 text-sm text-slate-500">\${new Date(d.created_at).toLocaleString()}</td>
                        <td class="px-6 py-4"><div class="text-sm font-bold text-slate-800">\${d.name}</div><div class="text-xs text-slate-400">\${d.phone}</div></td>
                        <td class="px-6 py-4"><span class="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg uppercase">\${d.method}</span> <div class="text-xs font-bold mt-1 text-slate-700">\${d.transaction_id}</div></td>
                        <td class="px-6 py-4 text-sm font-black text-slate-800">৳\${d.amount}</td>
                        <td class="px-6 py-4 text-right">
                            \${d.status === 'pending' ? \`
                                <button onclick="actionDeposit(\${d.id}, 'approve')" class="px-3 py-1.5 bg-green-100 text-green-600 font-bold text-xs rounded-xl hover:bg-green-200 mr-2">Approve</button>
                                <button onclick="actionDeposit(\${d.id}, 'reject')" class="px-3 py-1.5 bg-red-100 text-red-600 font-bold text-xs rounded-xl hover:bg-red-200">Reject</button>
                            \` : \`<span class="px-2 py-1 text-xs font-bold rounded-xl \${d.status==='approved'?'bg-green-100 text-green-600':'bg-red-100 text-red-600'} uppercase">\${d.status}</span>\`}
                        </td>
                    </tr>
                \`).join('');
            } catch(e) {}
        }
        
        async function actionDeposit(id, action) {
            if(!confirm('Are you sure you want to ' + action + ' this deposit?')) return;
            try {
                await fetch('/api/admin/deposits/' + id + '/action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
                    body: JSON.stringify({ action })
                });
                fetchDeposits();
            } catch(e) {}
        }
        
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const settings = await res.json();
                if(settings.app_name) document.getElementById('set_app_name').value = settings.app_name;
                if(settings.bkash_number) document.getElementById('set_bkash').value = settings.bkash_number;
                if(settings.nagad_number) document.getElementById('set_nagad').value = settings.nagad_number;
                if(settings.notice_text) document.getElementById('set_notice').value = settings.notice_text;
            } catch(e) {}
        }
        
        window.saveSettings = async function() {
            try {
                const payload = {
                    app_name: document.getElementById('set_app_name').value,
                    bkash_number: document.getElementById('set_bkash').value,
                    nagad_number: document.getElementById('set_nagad').value,
                    notice_text: document.getElementById('set_notice').value
                };
                await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
                    body: JSON.stringify(payload)
                });
                alert('Settings Saved Successfully!');
            } catch(e) { alert('Error saving'); }
        }

        window.changeUserVIP = async function(id, current) {
            const newVip = prompt("Enter new VIP Plan for User #" + id + " (e.g. VIP 1, VIP 2, Free):", current || 'Free');
            if(newVip && newVip !== current) {
                try {
                    await fetch('/api/admin/users/' + id + '/vip', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
                        body: JSON.stringify({ vip_plan: newVip })
                    });
                    fetchUsers();
                } catch(e) {}
            }
        };
        
        window.editUserBalance = async function(id, currentBal) {
            const act = prompt("User #" + id + " Balance: ৳" + currentBal + "\\nType 'add' to Add funds or 'deduct' to Remove funds:", "add");
            if(act === 'add' || act === 'deduct') {
                const amt = prompt("Enter Amount to " + act + ":", "0");
                if(amt && !isNaN(parseFloat(amt))) {
                    try {
                        await fetch('/api/admin/users/' + id + '/balance', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
                            body: JSON.stringify({ action: act, amount: amt })
                        });
                        fetchUsers();
                    } catch(e) {}
                }
            }
        };
    </script>`;
    
    if (!code.includes('fetchDeposits() {')) {
        code = code.replace('</script>\n</body>', scriptFuncs + '\n</body>');
    }
    
    // Switch Tabs Array Extension
    code = code.replace("['overview', 'users', 'tasks', 'withdraw'].forEach", "['overview', 'users', 'tasks', 'withdraw', 'deposit', 'settings'].forEach");
    
    // Inject Add Fund / Change VIP buttons into the user table rendering
    const rowMatch = /<td class="px-6 py-4 text-right">.*?<\/td>/s;
    const newActions = `<td class="px-6 py-4 text-right flex justify-end gap-2 items-center">
        <span class="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase cursor-pointer hover:bg-slate-200" onclick="changeUserVIP(\${u.id}, '\${u.vip_plan}')">\${u.vip_plan || 'Free'}</span>
        <button onclick="editUserBalance(\${u.id}, \${u.balance})" class="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200" title="Edit Balance"><span class="material-symbols-outlined text-[16px]">edit</span></button>
    </td>`;
    
    // We need to be careful with replace, there are multiple text-right tds maybe. Let's find fetchUsers rendering string.
    code = code.replace(/<span class="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase">\$\{u\.vip_plan \|\| 'Free'\}<\/span>/, 
    `<span class="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase cursor-pointer hover:bg-slate-200" onclick="changeUserVIP(\${u.id}, '\${u.vip_plan}')">\${u.vip_plan || 'Free'}</span>
    <button onclick="editUserBalance(\${u.id}, \${u.balance})" class="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200" title="Edit Balance"><span class="material-symbols-outlined text-[16px]">edit</span></button>`);

    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
    console.log("Force injected new Admin features!");
    ssh.dispose();
}
forceInjectTabs().catch(console.error);
