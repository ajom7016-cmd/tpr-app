const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDepositHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/deposit_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldFunc = \`        function submitDeposit() {
            const trxId = document.getElementById('trx-id').value.trim();
            if(!trxId) {
                document.getElementById('trx-id').style.borderColor = '#ea580c';
                return;
            }

            const btn = document.getElementById('btn-submit');
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin mr-1 text-[18px]">sync</span> Submitting...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                const modal = document.getElementById('success-modal');
                modal.style.display = 'flex';
                btn.innerHTML = 'Submit';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 1000);
        }\`;

const newFunc = \`        async function submitDeposit() {
            const trxId = document.getElementById('trx-id').value.trim();
            if(!trxId) {
                document.getElementById('trx-id').style.borderColor = '#ea580c';
                return;
            }

            const btn = document.getElementById('btn-submit');
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin mr-1 text-[18px]">sync</span> Submitting...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';
            
            const token = localStorage.getItem('token');
            if(!token) {
                alert('Please login first');
                return;
            }

            try {
                const response = await fetch('/api/deposit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        amount: depositAmount,
                        method: selectedMethod,
                        transaction_id: trxId
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    const modal = document.getElementById('success-modal');
                    modal.style.display = 'flex';
                } else {
                    alert(result.error || 'Failed to submit deposit');
                }
            } catch (err) {
                alert('Connection error. Please try again.');
            } finally {
                btn.innerHTML = 'Submit';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        }\`;

if (content.includes('function submitDeposit()')) {
    content = content.replace(oldFunc, newFunc);
    fs.writeFileSync(file, content);
    console.log('Fixed submitDeposit successfully!');
} else {
    console.log('Function not found!');
}
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_deposit_html.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_deposit_html.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    ssh.dispose();
}
fixDepositHtml().catch(console.error);
