const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read app.html
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let html = res.stdout;
    
    // Replace the isLandingDemo logic
    html = html.replace(/const isLandingDemo = \(\(\) => \{ try \{ return window\.top\.location\.pathname\.includes\('landing\.html'\); \} catch\(e\) \{ return false; \} \}\)\(\);/g, 
        "const isLandingDemo = (window.top !== window);");
    
    // Write back
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Fixed iframe logic!");
    ssh.dispose();
}
fix().catch(console.error);
