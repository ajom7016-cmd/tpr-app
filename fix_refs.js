const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAllReferences() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Replace in app.js
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/js/app.js');
    let js = res.stdout;
    
    js = js.replace(/const isLandingDemo =/g, 'window.isLandingDemo =');
    js = js.replace(/if\s*\(\s*isLandingDemo\s*\)/g, 'if (window.isLandingDemo)');
    
    let b64 = Buffer.from(js).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
    
    // Also inject a clear function to code.html just in case
    res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html');
    let codeHtml = res.stdout;
    codeHtml = codeHtml.replace(/typeof isLandingDemo !== 'undefined' && isLandingDemo/g, '(window.isLandingDemo || (window.parent && window.parent.isLandingDemo))');
    
    let b64Html = Buffer.from(codeHtml).toString('base64');
    await ssh.execCommand(`echo "${b64Html}" | base64 -d > /var/www/jmj_app/public/glassmorphic_1/code.html`);

    console.log("Replaced all dangerous isLandingDemo references!");
    ssh.dispose();
}
fixAllReferences().catch(console.error);
