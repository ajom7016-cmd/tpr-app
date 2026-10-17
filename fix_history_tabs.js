const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixHistoryTabs() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the HTML buttons
content = content.replace(/<button class="tab-btn active" onclick="switchTab\\('all', this\\)">All<\\/button>/, '<button class="tab-btn active" onclick="switchTab(\\'all\\', this)">All</button>');
content = content.replace(/<button class="tab-btn" onclick="switchTab\\('Deposit', this\\)">Deposits<\\/button>/, '<button class="tab-btn" onclick="switchTab(\\'deposit\\', this)">Deposits</button>');
content = content.replace(/<button class="tab-btn" onclick="switchTab\\('Withdraw', this\\)">Withdraws<\\/button>/, '<button class="tab-btn" onclick="switchTab(\\'withdraw\\', this)">Withdraws</button>');
content = content.replace(/<button class="tab-btn" onclick="switchTab\\('Task', this\\)">Tasks<\\/button>/, '<button class="tab-btn" onclick="switchTab(\\'reward\\', this)">Tasks</button>');
content = content.replace(/<button class="tab-btn" onclick="switchTab\\('Referral', this\\)">Referrals<\\/button>/, '<button class="tab-btn" onclick="switchTab(\\'referral\\', this)">Referrals</button>');

// Replace the JS function
const oldFunc = \`        window.filterTx = function(type) {
            currentFilter = type;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('tab-' + type).classList.add('active');
            renderTx();
        };\`;

const newFunc = \`        window.switchTab = function(type, element) {
            currentFilter = type;
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            if(element) element.classList.add('active');
            renderTx();
        };\`;

content = content.replace(oldFunc, newFunc);

fs.writeFileSync(file, content);
console.log('Fixed history tabs successfully!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_history.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_history.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixHistoryTabs().catch(console.error);
