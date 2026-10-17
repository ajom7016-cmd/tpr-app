const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAllHTML() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Find all HTML files inside /var/www/jmj_app/public/ and its subdirectories
    let res = await ssh.execCommand('find /var/www/jmj_app/public/ -name "*.html"');
    let files = res.stdout.split('\\n').filter(f => f.trim() !== '');
    
    for (let file of files) {
        if(file.includes('index.html')) continue; // skip index
        
        // Read file
        let fileRes = await ssh.execCommand(`cat "${file}"`);
        let html = fileRes.stdout;
        
        let original = html;
        
        // Replace bad isLandingDemo checks
        html = html.replace(/typeof isLandingDemo !== 'undefined' && isLandingDemo/g, '(window.isLandingDemo || (window.parent && window.parent.isLandingDemo))');
        html = html.replace(/if\s*\(\s*isLandingDemo\s*\)/g, 'if ((window.isLandingDemo || (window.parent && window.parent.isLandingDemo)))');
        
        // If changed, save it
        if (html !== original) {
            let b64Html = Buffer.from(html).toString('base64');
            await ssh.execCommand(`echo "${b64Html}" | base64 -d > "${file}"`);
            console.log(`Fixed: ${file}`);
        }
    }
    
    console.log("Global HTML isLandingDemo fix completed!");
    ssh.dispose();
}
fixAllHTML().catch(console.error);
