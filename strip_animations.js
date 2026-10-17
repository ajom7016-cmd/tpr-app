const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    let res = await ssh.execCommand("find /var/www/jmj_app/public/ -name '*.html'");
    let files = res.stdout.split('\n').filter(Boolean);
    
    for (let file of files) {
        let contentRes = await ssh.execCommand(`cat "${file}"`);
        let content = contentRes.stdout;
        let original = content;
        
        // Remove opacity: 0 that causes the slow fade-in
        content = content.replace(/opacity:\s*0\s*;/g, '');
        
        // Remove animation properties for smoothLoad and fadeIn
        content = content.replace(/animation:\s*smoothLoad[^;]*;/g, '');
        content = content.replace(/animation:\s*fadeIn[^;]*;/g, '');
        
        // Remove the keyframes definitions
        content = content.replace(/@keyframes\s+smoothLoad\s*\{[^}]*\{[^}]*\}[^}]*\}/g, '');
        content = content.replace(/@keyframes\s+fadeIn\s*\{[^}]*\{[^}]*\}[^}]*\}/g, '');
        
        if (content !== original) {
            console.log(`Removed animations from: ${file}`);
            let b64 = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > "${file}"`);
        }
    }
    
    console.log("Done stripping ALL slow fade-in animations!");
    ssh.dispose();
}
fix().catch(console.error);
