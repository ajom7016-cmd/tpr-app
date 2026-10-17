const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDoubleSweep() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // 1. Remove the setTimeout animation block
    const timeoutBlock = `let progressPercent = limit > 0 ? (window.completedTasks / limit) * 100 : 0;
    setTimeout(() => {
        let pb = document.getElementById('task-progress-bar');
        if(pb) pb.style.width = progressPercent + '%';
    }, 100);`;
    
    code = code.replace(timeoutBlock, "");
    
    // 2. Inject the width directly into the HTML string
    // First, let's calculate the progressPercent before the HTML string starts
    const startHtml = `let html = '';
    const vipTitle = vipInfo.level === 0 ? 'FREE PROFILE' : 'VIP LEVEL ' + vipInfo.level;`;
    
    const newStartHtml = `let html = '';
    const vipTitle = vipInfo.level === 0 ? 'FREE PROFILE' : 'VIP LEVEL ' + vipInfo.level;
    let progressPercent = limit > 0 ? (window.completedTasks / limit) * 100 : 0;`;
    
    if(code.includes(startHtml)) {
        code = code.replace(startHtml, newStartHtml);
    }
    
    // Now replace the hardcoded width: 0% in the HTML
    const oldProgressBar = `<div id="task-progress-bar" class="h-full rounded-full transition-all duration-500" style="width: 0%; background: linear-gradient(90deg, #ff9a28, #ff5e00);"></div>`;
    const newProgressBar = `<div id="task-progress-bar" class="h-full rounded-full transition-all duration-500" style="width: \${progressPercent}%; background: linear-gradient(90deg, #ff9a28, #ff5e00);"></div>`;
    
    code = code.replace(oldProgressBar, newProgressBar);
    
    // 3. Update the SW cache version
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v14');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.12';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("Double sweep animation fixed!");
    ssh.dispose();
}
fixDoubleSweep().catch(console.error);
