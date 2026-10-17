const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceInjectJS() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    const scriptFuncs = `
        async function fetchDeposits() {
            try {
                const res = await fetch('/api/admin/deposits', { headers: { 'Authorization': 'Bearer ' + authToken } });
                const deposits = await res.json();
                const tbody = document.getElementById('deposit-table');
                if(deposits.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center font-bold text-slate-400">কোনো ডিপোজিট রিকোয়েস্ট নেই!</td></tr>';
                } else {
                    tbody.innerHTML = deposits.map(d => \`
                        <tr class="hover:bg-slate-50/50 transition-colors border-b border-gray-50/50">
                            <td class="p-6 text-sm text-slate-500 font-semibold">\${new Date(d.created_at).toLocaleString()}</td>
                            <td class="p-6"><div class="text-sm font-bold text-slate-800">\${d.name}</div><div class="text-xs font-semibold text-slate-500">\${d.phone}</div></td>
                            <td class="p-6"><span class="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg uppercase border border-slate-300">\${d.method}</span> <div class="text-xs font-bold mt-2 text-slate-700">\${d.transaction_id}</div></td>
                            <td class="p-6 text-lg font-black text-primary">৳\${d.amount}</td>
                            <td class="p-6 text-right">
                                \${d.status === 'pending' ? \`
                                    <button onclick="actionDeposit(\${d.id}, 'approve')" class="px-4 py-2 bg-green-100 text-green-700 font-bold text-xs rounded-xl hover:bg-green-200 mr-2 border border-green-200 shadow-sm">Approve</button>
                                    <button onclick="actionDeposit(\${d.id}, 'reject')" class="px-4 py-2 bg-red-100 text-red-600 font-bold text-xs rounded-xl hover:bg-red-200 border border-red-200 shadow-sm">Reject</button>
                                \` : \`<span class="px-4 py-1.5 text-xs font-bold rounded-xl \${d.status==='approved'?'bg-green-100 text-green-700 border-green-200':'bg-red-100 text-red-700 border-red-200'} uppercase border">\${d.status}</span>\`}
                            </td>
                        </tr>
                    \`).join('');
                }
            } catch(e) {}
        }
        
        async function actionDeposit(id, action) {
            if(!confirm('Are you sure you want to ' + action + ' this deposit?')) return;
            try {
                await fetch('/api/admin/deposits/' + id + '/action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
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
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
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
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                            body: JSON.stringify({ action: act, amount: amt })
                        });
                        fetchUsers();
                    } catch(e) {}
                }
            }
        };
`;

    // Inject JS
    if (!code.includes('async function fetchDeposits')) {
        const scriptEndIndex = code.lastIndexOf('</script>');
        code = code.substring(0, scriptEndIndex) + scriptFuncs + '\n    </script>' + code.substring(scriptEndIndex + 9);
    }
    
    // Also inject Add/Change buttons in fetchUsers HTML string
    // In original it's:
    // <td class="p-6 text-primary font-black text-lg">৳ ${u.balance}</td>
    // </tr>`;
    
    const userRowSearch = '<td class="p-6 text-primary font-black text-lg">৳ ${u.balance}</td>\n                </tr>`';
    const userRowNew = `<td class="p-6 text-primary font-black text-lg">৳ \${u.balance}</td>
                    <td class="p-6 text-right flex justify-end gap-2 items-center">
                        <span class="px-3 py-1.5 bg-orange-100 text-orange-700 font-bold text-[11px] rounded-full uppercase cursor-pointer hover:bg-orange-200 border border-orange-200 shadow-sm" onclick="changeUserVIP(\${u.id}, '\${u.vip_plan}')">\${u.vip_plan || 'Free'}</span>
                        <button onclick="editUserBalance(\${u.id}, \${u.balance})" class="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200 border border-green-200 shadow-sm" title="Edit Balance"><span class="material-symbols-outlined text-[16px]">edit</span></button>
                    </td>
                </tr>\``;
                
    if (code.includes('<td class="p-6 text-primary font-black text-lg">৳ ${u.balance}</td>') && !code.includes('changeUserVIP')) {
        // Regex is safer for whitespace
        code = code.replace(/<td class="p-6 text-primary font-black text-lg">৳ \$\{u\.balance\}<\/td>\s*<\/tr>`/, userRowNew);
        // Also add table header for Action
        code = code.replace('<th class="p-6 font-bold">ব্যালেন্স</th>', '<th class="p-6 font-bold">ব্যালেন্স</th>\n                            <th class="p-6 font-bold text-right">অ্যাকশন</th>');
    }

    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
    console.log("Successfully injected all JS functions and User buttons!");
    ssh.dispose();
}
forceInjectJS().catch(console.error);
