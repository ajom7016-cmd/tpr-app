const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Break iframe cache in index.html
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    html = html.replace(/<iframe src='\/app\.html'><\/iframe>/g, "<iframe src='/app.html?v=2'></iframe>");
    // Also clean up that broken opacity stuff just in case
    html = html.replace(/opacity:\s*1\.08;/g, "opacity: 1;");
    html = html.replace(/opacity:\s*1\.5;/g, "opacity: 1;");
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    // 2. Just to be ABSOLUTELY SURE app.html has NO opacity transitions or black screens
    res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let appHtml = res.stdout;
    appHtml = appHtml.replace(/opacity:\s*0/g, "opacity: 1"); // NUKE ALL OPACITY 0
    appHtml = appHtml.replace(/transition-all/g, ""); // NUKE TRANSITIONS
    appHtml = appHtml.replace(/duration-300/g, ""); // NUKE DURATIONS
    appHtml = appHtml.replace(/duration-500/g, "");
    
    // Write it back
    let base64AppHtml = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${base64AppHtml}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Forced iframe cache break and nuked app.html animations!");
    ssh.dispose();
}
fix().catch(console.error);
