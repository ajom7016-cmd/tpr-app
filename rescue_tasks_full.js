const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function rescueTasksFull() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // The exact broken block currently:
    const brokenBlock = `const fetchAndSetName = async () => {
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    
                    if (res.ok) {
                        const profile = await res.json();
                        if (profile && profile.name) {
                            const nameEl = document.getElementById('vip-user-name');
                            if (nameEl) {
                                nameEl.innerText = profile.name;
                            }
                        }
                    }
                }
            } catch(e) {
                console.error("Error fetching username:", e);
            }
        };
        fetchAndSetName();`;
        
    const fixedBlock = `const fetchAndSetName = async () => {
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                if (token) {
                    const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if (res.ok) {
                        const profile = await res.json();
                        if (profile) {
                            window.completedTasks = profile.today_tasks || 0;
                            if (profile.name) {
                                const nameEl = document.getElementById('vip-user-name');
                                if (nameEl) nameEl.innerText = profile.name;
                            }
                        }
                    }
                }
            } catch(e) {
                console.error("Error fetching username:", e);
            }
        };
        // MUST call generateTasks() AFTER we definitely know how many tasks are completed!
        fetchAndSetName().finally(() => {
            generateTasks();
        });`;
        
    if(code.includes('const fetchAndSetName = async () => {')) {
        // Replace it using string replacement safely
        const start = code.indexOf('const fetchAndSetName = async () => {');
        const end = code.indexOf('fetchAndSetName();') + 'fetchAndSetName();'.length;
        code = code.substring(0, start) + fixedBlock + code.substring(end);
        
        // Bump cache again
        let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
        let appCode = resApp.stdout;
        appCode = appCode.replace("const timestamp = '1.0.3';", "const timestamp = '1.0.4';");
        await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
        
        let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
        let swCode = resSW.stdout;
        swCode = swCode.replace('tpr-super-cache-v5', 'tpr-super-cache-v6');
        await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
        
        await ssh.execCommand(`echo "${Buffer.from(code).toString('base64')}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("RESCUED! generateTasks is back and properly sequenced!");
    } else {
        console.log("Could not find fetchAndSetName block!");
    }
    
    ssh.dispose();
}
rescueTasksFull().catch(console.error);
