const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function removeOldSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // Find the start and end of the global preloader
    const startIndex = code.indexOf('<!-- Global Preloader -->');
    const endIndex = code.indexOf('})();\n    </script>\n</div>');
    
    if (startIndex !== -1 && endIndex !== -1) {
        // Length of closing tag is 24 chars
        const completeBlock = code.substring(startIndex, endIndex + 24);
        code = code.replace(completeBlock, '');
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
        console.log("Old global spinner completely destroyed!");
    } else {
        console.log("Could not find global preloader bounds.");
    }
    
    ssh.dispose();
}
removeOldSpinner().catch(console.error);
