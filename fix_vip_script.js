const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixVip() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

const subscribeLogic = \`
    window.subscribeVIP = async function(level, tasks, perTask) {
        if(!confirm('Are you sure you want to subscribe to VIP ' + level + '?')) return;
        
        let token = localStorage.getItem('userToken');
        if (!token && window.parent) {
            try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
        }
        
        if(!token) {
            alert('Please login first.');
            return;
        }

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ level: level.toString() })
            });
            const data = await res.json();
            
            if(res.ok) {
                alert('অভিনন্দন! আপনি সফলভাবে VIP ' + level + ' আপগ্রেড করেছেন।');
                location.reload();
            } else {
                if(data.error === 'Insufficient balance') {
                    alert('আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই। অনুগ্রহ করে ' + data.shortfall + ' টাকা ডিপোজিট করুন।');
                } else {
                    alert(data.error || data.message || 'Subscription failed');
                }
            }
        } catch(e) {
            alert('Network error. Please try again.');
        }
    };
\`;

// If subscribeVIP is already there, don't add it. But we checked and it's not.
if (!content.includes('window.subscribeVIP =')) {
    content = content.replace('window.addEventListener(\\'DOMContentLoaded\\'', subscribeLogic + '\\n\\n    window.addEventListener(\\'DOMContentLoaded\\'');
    fs.writeFileSync(file, content);
    console.log('Added subscribeVIP to vip.html');
} else {
    console.log('subscribeVIP already exists.');
}
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_vip.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_vip.js');
    console.log(res.stdout);
    
    // Increment cache busting in sw.js and app.html
    await ssh.execCommand('sed -i "s/v1.0.1[0-9]*/v1.0.2$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    await ssh.execCommand('sed -i "s/vip.html?v=[0-9]*/vip.html?v=$(date +%s)/g" /var/www/jmj_app/public/app.html');
    
    ssh.dispose();
}
fixVip().catch(console.error);
