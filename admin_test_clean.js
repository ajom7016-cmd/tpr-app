
        let authToken = localStorage.getItem('adminToken');

        if (authToken) {
            document.getElementById('login-section').classList.add('hide');
            document.getElementById('sidebar').classList.remove('hide');
            document.getElementById('main-content').classList.remove('hide');
            loadAllData();
        }

        async function loginAdmin() {
            const phone = document.getElementById('adminPhone').value;
            const password = document.getElementById('adminPass').value;
            const btn = document.querySelector('#login-section button');
            const og = btn.innerHTML;
            btn.innerHTML = "Logging in...";
            try {
                const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contact: phone, password }) });
                const data = await res.json();
                if (data.token && data.user.role === 'admin') {
                    localStorage.setItem('adminToken', data.token);
                    authToken = data.token;
                    location.reload();
                } else { alert('লগইন ব্যর্থ হয়েছে।'); }
            } catch(e) { alert('Connection error.'); }
            btn.innerHTML = og;
        }

        function logoutAdmin() {
            localStorage.removeItem('adminToken');
            location.reload();
        }

        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hide'));
            document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active-nav'));
            document.getElementById('tab-' + tabId).classList.remove('hide');
            document.getElementById('nav-' + tabId).classList.add('active-nav');
        }

        async function loadAllData() {
            fetchUsers();
            fetchTasks();
            fetchWithdrawals();
            fetchDeposits();
            fetchSettings();
        }

        async function fetchUsers() {
            const res = await fetch('/api/admin/users', { headers: { 'Authorization': 'Bearer ' + authToken } });
            if(res.status === 403) return logoutAdmin();
            const data = await res.json();
            
            document.getElementById('dash-total-users').innerText = data.length;
            
            const tbody = document.getElementById('user-list');
            tbody.innerHTML = '';
            data.forEach(u => {
                tbody.innerHTML += `<tr class="hover:bg-orange-50/50 transition-colors border-b border-gray-50/50">
                    <td class="p-6 font-bold text-slate-400">#${u.id}</td>
                    <td class="p-6 font-bold text-slate-800">${u.name}</td>
                    <td class="p-6 font-semibold text-slate-500">${u.phone}</td>
                    <td class="p-6 text-primary font-black text-lg">৳ ${u.balance}</td>
                </tr>`;
            });
        }

        async function fetchTasks() {
            const res = await fetch('/api/tasks', { headers: { 'Authorization': 'Bearer ' + authToken } });
            const data = await res.json();
            const list = document.getElementById('task-list');
            list.innerHTML = '';
            data.forEach(t => {
                let shortLink = t.link ? (t.link.length > 30 ? t.link.substring(0,27)+'...' : t.link) : 'কোনো লিঙ্ক নেই';
                list.innerHTML += `<div class="glass-3d p-6 rounded-[24px] flex justify-between items-center group">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-[18px] bg-orange-100 flex items-center justify-center border border-white shadow-sm cursor-pointer hover:bg-orange-200" onclick="editTaskLink(${t.id}, '${t.link||''}')" title="লিঙ্ক এডিট করুন">
                            <span class="material-symbols-outlined text-primary text-[24px]">link</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-800 text-lg">${t.title}</h4>
                            <div class="flex gap-4 mt-1 text-sm font-semibold">
                                <p class="text-slate-500">রিওয়ার্ড: <span class="text-primary font-bold">৳ ${t.reward}</span></p>
                                <p class="text-blue-500 truncate max-w-[200px]" title="${t.link}">${shortLink}</p>
                            </div>
                        </div>
                    </div>
                    <button onclick="deleteTask(${t.id})" class="w-12 h-12 bg-red-50 text-red-500 rounded-[16px] hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 flex items-center justify-center">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>`;
            });
        });
            const data = await res.json();
            const list = document.getElementById('task-list');
            list.innerHTML = '';
            data.forEach(t => {
                list.innerHTML += `<div class="glass-3d p-6 rounded-[24px] flex justify-between items-center group">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-[18px] bg-orange-100 flex items-center justify-center border border-white shadow-sm">
                            <span class="material-symbols-outlined text-primary text-[28px]">smart_display</span>
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-800 text-lg">${t.title}</h4>
                            <p class="text-sm text-slate-500 font-semibold mt-0.5">রিওয়ার্ড: <span class="text-primary font-bold">৳ ${t.reward}</span></p>
                        </div>
                    </div>
                    <button onclick="deleteTask(${t.id})" class="w-12 h-12 bg-red-50 text-red-500 rounded-[16px] hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 flex items-center justify-center">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>`;
            });
        }

        async function addTask() {
            const title = prompt("টাস্কের নাম (যেমন: YouTube, Facebook):");
            if(!title) return;
            const link = prompt("এই টাস্কের লিঙ্ক (URL):", "https://");
            const reward = prompt("রিওয়ার্ড অ্যামাউন্ট (৳):", "10");
            if(title && reward) {
                await fetch('/api/admin/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                    body: JSON.stringify({ title, description: '', reward: parseFloat(reward), type: 'general', link: link || '' })
                });
                fetchTasks();
            }
        }

        async function deleteTask(id) {
            if(confirm("টাস্কটি ডিলিট করতে চান?")) {
                await fetch('/api/admin/tasks/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
                fetchTasks();
            }
        }

        async function fetchWithdrawals() {
            const res = await fetch('/api/admin/withdrawals', { headers: { 'Authorization': 'Bearer ' + authToken } });
            const data = await res.json();
            const tbody = document.getElementById('withdraw-list');
            tbody.innerHTML = '';
            let pendingCount = 0;

            if(data.length === 0) tbody.innerHTML = `<tr><td colspan="5" class="p-8 text-center font-bold text-slate-400">কোনো উইথড্র রিকোয়েস্ট নেই।</td></tr>`;

            data.forEach(req => {
                if(req.status === 'pending') pendingCount++;
                let statusBadge = req.status === 'pending' 
                    ? `<span class="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold border border-orange-200">পেন্ডিং</span>`
                    : `<span class="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold border border-green-200">সম্পন্ন</span>`;

                tbody.innerHTML += `<tr class="hover:bg-orange-50/50 transition-colors border-b border-gray-50/50">
                    <td class="p-6">
                        <div class="font-bold text-slate-800 text-[15px]">${req.user_name}</div>
                        <div class="text-[13px] font-semibold text-slate-500">${req.user_phone}</div>
                    </td>
                    <td class="p-6 font-bold text-slate-600">${req.method || 'bKash'}</td>
                    <td class="p-6 font-black text-primary text-lg">৳ ${req.amount}</td>
                    <td class="p-6">${statusBadge}</td>
                    <td class="p-6 text-right">
                        ${req.status === 'pending' ? `<button onclick="approveWithdraw(${req.id})" class="btn-premium px-6 py-2.5 rounded-2xl text-[13px] font-bold shadow-md flex items-center gap-1.5 ml-auto"><span class="material-symbols-outlined text-[18px]">done</span> Pay</button>` : '-'}
                    </td>
                </tr>`;
            });
            document.getElementById('dash-pending-withdraw').innerText = pendingCount;
        }

        async function approveWithdraw(id) {
            if(confirm("এই উইথড্র রিকোয়েস্টটি অ্যাপ্রুভ করতে চান?")) {
                const res = await fetch('/api/admin/withdrawals/' + id + '/approve', { method: 'POST', headers: { 'Authorization': 'Bearer ' + authToken } });
                if(res.ok) { alert("পেমেন্ট সম্পন্ন হয়েছে!"); fetchWithdrawals(); }
                else alert("কোনো সমস্যা হয়েছে।");
            }
        }
    
        async function fetchDeposits() {
            try {
                const res = await fetch('/api/admin/deposits', { headers: { 'Authorization': 'Bearer ' + authToken } });
                const deposits = await res.json();
                const tbody = document.getElementById('deposit-table');
                if(deposits.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center font-bold text-slate-400">কোনো ডিপোজিট রিকোয়েস্ট নেই!</td></tr>';
                } else {
                    tbody.innerHTML = deposits.map(d => `
                        <tr class="hover:bg-slate-50/50 transition-colors border-b border-gray-50/50">
                            <td class="p-6 text-sm text-slate-500 font-semibold">${new Date(d.created_at).toLocaleString()}</td>
                            <td class="p-6"><div class="text-sm font-bold text-slate-800">${d.name}</div><div class="text-xs font-semibold text-slate-500">${d.phone}</div></td>
                            <td class="p-6"><span class="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg uppercase border border-slate-300">${d.method}</span> <div class="text-xs font-bold mt-2 text-slate-700">${d.transaction_id}</div></td>
                            <td class="p-6 text-lg font-black text-primary">৳${d.amount}</td>
                            <td class="p-6 text-right">
                                ${d.status === 'pending' ? `
                                    <button onclick="actionDeposit(${d.id}, 'approve')" class="px-4 py-2 bg-green-100 text-green-700 font-bold text-xs rounded-xl hover:bg-green-200 mr-2 border border-green-200 shadow-sm">Approve</button>
                                    <button onclick="actionDeposit(${d.id}, 'reject')" class="px-4 py-2 bg-red-100 text-red-600 font-bold text-xs rounded-xl hover:bg-red-200 border border-red-200 shadow-sm">Reject</button>
                                ` : `<span class="px-4 py-1.5 text-xs font-bold rounded-xl ${d.status==='approved'?'bg-green-100 text-green-700 border-green-200':'bg-red-100 text-red-700 border-red-200'} uppercase border">${d.status}</span>`}
                            </td>
                        </tr>
                    `).join('');
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
            const act = prompt("User #" + id + " Balance: ৳" + currentBal + "\nType 'add' to Add funds or 'deduct' to Remove funds:", "add");
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

    