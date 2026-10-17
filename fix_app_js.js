const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read app.js
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/js/app.js");
    let js = res.stdout;
    
    // Replace isLandingDemo
    js = js.replace(/const isLandingDemo = \(\(\) => \{ try \{ return window\.top\.location\.pathname\.includes\('landing\.html'\); \} catch\(e\) \{ return false; \} \}\)\(\);/g, 
        "const isLandingDemo = (window.top !== window);");
    
    // Write back
    let base64Js = Buffer.from(js).toString('base64');
    await ssh.execCommand(`echo "${base64Js}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
    
    console.log("Fixed js/app.js!");
    ssh.dispose();
}
fix().catch(console.error);
