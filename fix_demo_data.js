const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    let res = await ssh.execCommand("find /var/www/jmj_app/public/ -name 'code.html'");
    let files = res.stdout.split('\n').filter(Boolean);
    
    for (let file of files) {
        let contentRes = await ssh.execCommand(`cat "${file}"`);
        let content = contentRes.stdout;
        let original = content;
        
        // Claude added the "&& token" check which broke the demo app where there is no token.
        // We will allow it to proceed if it's the landing demo!
        content = content.replace(
            /if\s*\(\s*window\.APP\s*&&\s*token\s*\)/g,
            "if(window.APP && (token || (typeof isLandingDemo !== 'undefined' && isLandingDemo)))"
        );
        
        if (content !== original) {
            console.log(`Fixed token check in: ${file}`);
            let b64 = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > "${file}"`);
        }
    }
    
    console.log("Done fixing demo logic!");
    ssh.dispose();
}
fix().catch(console.error);
