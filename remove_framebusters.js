const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // We will search ALL code.html files in the public directory and replace window.top.location with window.location
    let res = await ssh.execCommand("find /var/www/jmj_app/public/ -name 'code.html' -o -name 'app.js'");
    let files = res.stdout.split('\n').filter(Boolean);
    
    for (let file of files) {
        let contentRes = await ssh.execCommand(`cat ${file}`);
        let content = contentRes.stdout;
        
        let original = content;
        content = content.replace(/window\.top\.location/g, "window.location");
        
        if (content !== original) {
            console.log(`Patched ${file}`);
            let b64 = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > ${file}`);
        }
    }
    
    console.log("Done fixing all framebusters!");
    ssh.dispose();
}
fix().catch(console.error);
