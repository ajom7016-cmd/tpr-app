const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMobileTextBlur() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Add text-shadow override to .part-top-left h1, .part-bottom-left h1
    html = html.replace(/\.part-top-left\s*h1,\s*\.part-bottom-left\s*h1\s*\{/, 
        '.part-top-left h1, .part-bottom-left h1 { text-shadow: 0 1px 3px rgba(0,0,0,0.6) !important; ');
        
    // Add text-shadow override to .part-bottom-left p
    html = html.replace(/\.part-bottom-left\s*p\s*\{/, 
        '.part-bottom-left p { text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important; ');

    // Let's also fix the top TPR text just in case it is also getting inline shadows.
    // Wait, the top text is inside .part-top-left but it might not be an h1?
    // <div style="opacity: 1;"><h1>TPR: The Ultimate</h1></div>
    // Yes, it is an h1.

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Mobile text blur fixed!");
    ssh.dispose();
}
fixMobileTextBlur().catch(console.error);
