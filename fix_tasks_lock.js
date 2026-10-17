const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTasksLock() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // 1. Remove the standalone generateTasks call from DOMContentLoaded
    const oldDOM = `document.addEventListener('DOMContentLoaded', () => {
    if (window.APP) {
        generateTasks();
    } else {
        // give it a brief moment if loaded via script tag async
        setTimeout(generateTasks, 100);
    }
});`;
    if(code.includes(oldDOM)) {
        code = code.replace(oldDOM, "");
    } else {
        // Fallback replacement if formatting is slightly different
        code = code.replace(/document\.addEventListener\('DOMContentLoaded'[^]*?setTimeout\(generateTasks, 100\);\s*\}\s*\}\);/g, "");
    }
    
    // 2. Put generateTasks() inside fetchAndSetName() exactly after window.completedTasks is set
    const oldFetch = `window.completedTasks = profile.today_tasks || 0;
                        window.vipPlan = profile.vip_plan;
                        
                        const nameEl = document.getElementById('vip-user-name');
                        if (nameEl) {
                            nameEl.innerText = profile.name;
                        }`;
                        
    const newFetch = `window.completedTasks = profile.today_tasks || 0;
                        window.vipPlan = profile.vip_plan;
                        
                        const nameEl = document.getElementById('vip-user-name');
                        if (nameEl) {
                            nameEl.innerText = profile.name;
                        }
                        // Now that we have the real completed tasks count, generate the buttons!
                        generateTasks();`;
                        
    if(code.includes(oldFetch)) {
        code = code.replace(oldFetch, newFetch);
    }
    
    // 3. Make sure to bump app.html cache so the new code.html is loaded!
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    if(appCode.includes("const timestamp = '1.0.2';")) {
        appCode = appCode.replace("const timestamp = '1.0.2';", "const timestamp = '1.0.3';");
        let b64App = Buffer.from(appCode).toString('base64');
        await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    }
    
    // 4. Bump sw.js
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    if(swCode.includes('tpr-super-cache-v4')) {
        swCode = swCode.replace('tpr-super-cache-v4', 'tpr-super-cache-v5');
        let b64SW = Buffer.from(swCode).toString('base64');
        await ssh.execCommand(`echo "${b64SW}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    }
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("Tasks locking logic fixed, generateTasks moved inside async fetch!");
    ssh.dispose();
}
fixTasksLock().catch(console.error);
