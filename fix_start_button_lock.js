const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixStartButtonLock() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // In generateTasks, find the loop:
    const oldLoop = `tasksConfig.forEach(task => {
        let pLimit = limits[task.key];`;
    const newLoop = `const isGloballyLocked = (window.completedTasks >= limit);
    tasksConfig.forEach(task => {
        let pLimit = limits[task.key];
        let showStartButton = (pLimit > 0) && !isGloballyLocked;`;
        
    code = code.replace(oldLoop, newLoop);
    
    // Replace pLimit > 0 in the ternary operator
    const oldTernary = '` + (pLimit > 0 ? `';
    const newTernary = '` + (showStartButton ? `';
    code = code.replace(/` \+ \(pLimit > 0 \? `/g, newTernary);
    
    // Update cache
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace("const timestamp = '1.0.4';", "const timestamp = '1.0.5';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace('tpr-super-cache-v6', 'tpr-super-cache-v7');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("Start button locking logic completely fixed!");
    ssh.dispose();
}
fixStartButtonLock().catch(console.error);
