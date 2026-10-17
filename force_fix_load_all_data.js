const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceFixLoadAllData() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // Fix loadAllData function completely using Regex to match its actual body
    const oldFuncRegex = /async function loadAllData\(\) \{[\s\S]*?fetchWithdrawals\(\);?\s*\}/;
    
    const newFunc = `async function loadAllData() {
            fetchUsers();
            fetchTasks();
            fetchWithdrawals();
            fetchDeposits();
            fetchSettings();
        }`;
        
    code = code.replace(oldFuncRegex, newFunc);
    
    // Enhance fetchDeposits to show "No Deposits" if empty
    const oldMap = "tbody.innerHTML = deposits.map(d => `";
    const newMap = `
                if(deposits.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center font-bold text-slate-400">কোনো ডিপোজিট রিকোয়েস্ট নেই!</td></tr>';
                } else {
                    tbody.innerHTML = deposits.map(d => \``;
                    
    code = code.replace(oldMap, newMap);
    // wait we need to close the else block in the map string replacement
    const mapEnd = "`).join('');";
    const newMapEnd = "`).join('');\n                }";
    code = code.replace(mapEnd, newMapEnd);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
    console.log("Successfully fixed loadAllData and Empty states!");
    ssh.dispose();
}
forceFixLoadAllData().catch(console.error);
