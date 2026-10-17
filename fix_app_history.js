const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAppHistory() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // Add getRecentEarnings to window.APP
    // Let's find where window.APP is defined
    const targetString = "logout: () => {";
    const newFunction = `getRecentEarnings: async () => {
            try {
                let t = localStorage.getItem('userToken');
                const res = await fetch('/api/recent-earnings', {
                    headers: { 'Authorization': 'Bearer ' + t }
                });
                if(res.ok) {
                    return await res.json();
                }
            } catch(e) {}
            return [];
        },
        logout: () => {`;
        
    if(code.includes(targetString)) {
        code = code.replace(targetString, newFunction);
        
        // Bump cache
        code = code.replace("const timestamp = '1.0.7';", "const timestamp = '1.0.8';");
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
        
        let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
        let swCode = resSW.stdout;
        swCode = swCode.replace('tpr-super-cache-v9', 'tpr-super-cache-v10');
        let b64SW = Buffer.from(swCode).toString('base64');
        await ssh.execCommand(`echo "${b64SW}" | base64 -d > /var/www/jmj_app/public/sw.js`);
        
        console.log("Added getRecentEarnings to APP object and bumped cache!");
    } else {
        console.log("Could not find window.APP.logout definition in app.html!");
    }
    
    ssh.dispose();
}
fixAppHistory().catch(console.error);
