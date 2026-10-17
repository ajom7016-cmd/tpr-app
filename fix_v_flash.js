const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixVAndFlash() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // 1. Remove v>
    code = code.replace('v>\n\n\n<div class="device-mockup">', '<div class="device-mockup">');
    code = code.replace('v>\r\n\r\n\r\n<div class="device-mockup">', '<div class="device-mockup">');
    // Just in case it's formatted differently
    code = code.replace(/v>\s*<div class="device-mockup">/g, '<div class="device-mockup">');
    
    // 2. Add opacity transition to iframe to prevent "breaking" layout shift
    // Find the iframe declaration
    const oldIframe = '<iframe id="app-frame" src="glassmorphic_1/code.html" class="w-full h-full border-0"></iframe>';
    const newIframe = '<iframe id="app-frame" src="glassmorphic_1/code.html" class="w-full h-full border-0" style="opacity: 0; transition: opacity 0.3s ease-in-out;" onload="this.style.opacity=\'1\';"></iframe>';
    
    // Also we need to make sure the loadPage function handles this
    const loadPageCode = "document.getElementById('app-frame').src = finalUrl;";
    const newLoadPageCode = "const frame = document.getElementById('app-frame'); frame.style.opacity = '0'; setTimeout(() => { frame.src = finalUrl; }, 50);";
    
    if(code.includes(oldIframe)) {
        code = code.replace(oldIframe, newIframe);
        code = code.replace(loadPageCode, newLoadPageCode);
    }
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Fixed stray v> and added smooth iframe transition!");
    
    ssh.dispose();
}
fixVAndFlash().catch(console.error);
