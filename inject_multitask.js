const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const jsFunc = `
        async function startMultiTask(taskId, reward) {
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    // Update UI immediately for responsiveness
                    let limitEl = document.getElementById('task-limit-' + taskId);
                    let currentLimit = parseInt(limitEl.getAttribute('data-limit'));
                    
                    if (currentLimit <= 0) return;
                    
                    const res = await fetch('/api/tasks/complete', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ taskId })
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        
                        // Decrement local sub-limit
                        currentLimit--;
                        limitEl.setAttribute('data-limit', currentLimit);
                        limitEl.innerText = currentLimit + ' TASKS TODAY';
                        
                        // Disable button if empty
                        if (currentLimit <= 0) {
                            let btn = document.getElementById('btn-task-' + taskId);
                            btn.disabled = true;
                            btn.innerText = 'Done';
                            btn.className = 'text-white/50 text-[12px] font-black px-7 py-1.5 rounded-full bg-white/10 cursor-not-allowed';
                            btn.style = '';
                        }
                        
                        // Update Progress Bar
                        completed++;
                        const limitMap = {0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14};
                        const totalLimit = limitMap[vipLevelGlobal] || 1; // Assuming we have access to vip level globally
                        
                        document.getElementById('task-progress-text').innerText = completed + '/' + totalLimit;
                        let progressPercent = totalLimit > 0 ? (completed / totalLimit) * 100 : 0;
                        document.getElementById('task-progress-bar').style.width = progressPercent + '%';
                        
                        // Update Earnings
                        let currentEarnings = parseFloat(document.getElementById('user-total-earnings').innerText.replace(/,/g, ''));
                        currentEarnings += reward;
                        document.getElementById('user-total-earnings').innerText = currentEarnings.toLocaleString('en-IN', {minimumFractionDigits: 2});
                    } else {
                        const err = await res.json();
                        alert(err.error || 'Failed to complete task');
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
`;

if (!content.includes('function startMultiTask')) {
    content = content.replace('</script>', jsFunc + '\n</script>');
    
    // Also need to set vipLevelGlobal
    content = content.replace('let vipInfo = { level: 0, userName: \'User Name\', userPic: \'\' };', 
                              'let vipInfo = { level: 0, userName: \'User Name\', userPic: \'\' };\nwindow.vipLevelGlobal = 0;');
    content = content.replace('vipInfo.level = parseInt(p.vip_plan.replace(\'VIP \', \'\')) || 1;', 
                              'vipInfo.level = parseInt(p.vip_plan.replace(\'VIP \', \'\')) || 1;\nwindow.vipLevelGlobal = vipInfo.level;');
                              
    fs.writeFileSync(file, content);
    console.log('Injected startMultiTask logic');
}
