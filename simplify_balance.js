const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function simplifyBalancePrompt() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const files = [
    '/var/www/jmj_app/public/admin.html',
    '/var/www/jmj_app/public/admin2.html'
];

const newBalanceLogic = \`
        window.editUserBalance = async function(id, currentBal) {
            const amtStr = prompt("ইউজার #" + id + " বর্তমান ব্যালেন্স: ৳" + currentBal + "\\nকত টাকা অ্যাড (Add) করতে চান লিখুন:\\n(টাকা কাটতে চাইলে পরিমাণের আগে - মাইনাস দিন, যেমন: -50)", "0");
            if(!amtStr) return;
            const amt = parseFloat(amtStr);
            if(isNaN(amt) || amt === 0) return;
            
            const action = amt > 0 ? 'add' : 'deduct';
            const absoluteAmt = Math.abs(amt);
            
            try {
                const res = await fetch('/api/admin/users/' + id + '/balance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                    body: JSON.stringify({ action: action, amount: absoluteAmt })
                });
                const data = await res.json();
                if(res.ok) {
                    fetchUsers();
                    alert("সাকসেস! ব্যালেন্স সফলভাবে আপডেট হয়েছে।");
                } else {
                    alert("Error: " + data.error);
                }
            } catch(e) {
                alert("Network error: " + e.message);
            }
        };
\`;

files.forEach(file => {
    if(fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // We will use regex to replace the entire window.editUserBalance block
        content = content.replace(/window\\.editUserBalance = async function\\(id, currentBal\\) \\{[\\s\\S]*?catch\\(e\\) \\{[\\s\\S]*?\\}\\n[\\s]*\\}[\\s]*\\};/, newBalanceLogic.trim());
        fs.writeFileSync(file, content);
    }
});
console.log('Simplified Balance Prompt in admin files!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/simplify_balance.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/simplify_balance.js');
    console.log(res.stdout);
    ssh.dispose();
}
simplifyBalancePrompt().catch(console.error);
