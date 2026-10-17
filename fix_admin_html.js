const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAdminHTML() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const adminFile = '/var/www/jmj_app/public/admin.html';
let adminHtml = fs.readFileSync(adminFile, 'utf8');

// Replace editUserBalance
const oldBalanceLogic = \`
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
\`;

const newBalanceLogic = \`
        window.editUserBalance = async function(id, currentBal) {
            const act = prompt("User #" + id + " Balance: ৳" + currentBal + "\\nType 'add' to Add funds or 'deduct' to Remove funds:", "add");
            if(!act) return;
            const action = act.toLowerCase().trim();
            if(action === 'add' || action === 'deduct') {
                const amt = prompt("Enter Amount to " + action + ":", "0");
                if(amt && !isNaN(parseFloat(amt))) {
                    try {
                        const res = await fetch('/api/admin/users/' + id + '/balance', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                            body: JSON.stringify({ action: action, amount: amt })
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
                }
            } else {
                alert("Please type exactly 'add' or 'deduct'");
            }
        };
\`;

// Replace using regex just in case there are minor whitespace differences
adminHtml = adminHtml.replace(/window\\.editUserBalance = async function\\(id, currentBal\\) \\{[\\s\\S]*?catch\\(e\\) \\{\\}[\\s]*\\}\\n[\\s]*\\}[\\s]*\\};/, newBalanceLogic.trim());

fs.writeFileSync(adminFile, adminHtml);
console.log('Fixed editUserBalance in admin.html!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_admin_html.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_admin_html.js');
    console.log(res.stdout);
    ssh.dispose();
}
fixAdminHTML().catch(console.error);
