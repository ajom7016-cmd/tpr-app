const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixUserName() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // In fetchAndSetName:
    const oldNameSet = `if (profile.name) {
                                const nameEl = document.getElementById('vip-user-name');
                                if (nameEl) nameEl.innerText = profile.name;
                            }`;
    const newNameSet = `if (profile.name) {
                                window.userName = profile.name;
                                const nameEl = document.getElementById('vip-user-name');
                                if (nameEl) nameEl.innerText = profile.name;
                            }`;
    if(code.includes(oldNameSet)) {
        code = code.replace(oldNameSet, newNameSet);
    } else {
        // Fallback replacement if exact string fails
        code = code.replace("if (profile.name) {", "if (profile.name) { window.userName = profile.name;");
    }
    
    // In generateTasks:
    const oldHtmlName = `<span id="vip-user-name" class="text-white text-[12px] font-black tracking-wider uppercase">USER</span>`;
    const newHtmlName = `<span id="vip-user-name" class="text-white text-[12px] font-black tracking-wider uppercase">\${window.userName || 'USER'}</span>`;
    
    code = code.replace(oldHtmlName, newHtmlName);
    // Just in case it was already replaced partially:
    code = code.replace(/>USER<\/span>/g, ">${window.userName || 'USER'}</span>");
    
    // Update cache
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace("const timestamp = '1.0.5';", "const timestamp = '1.0.6';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace('tpr-super-cache-v7', 'tpr-super-cache-v8');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("User name successfully passed into generateTasks template!");
    ssh.dispose();
}
fixUserName().catch(console.error);
