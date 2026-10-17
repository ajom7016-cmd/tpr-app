const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceHtmlDark() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Add dark background to HTML tag
    html = html.replace('<html lang="bn">', '<html lang="bn" style="background-color: #111827 !important;">');
    
    // Ensure body also has the inline style just in case
    html = html.replace('<body>', '<body style="background-color: #111827 !important; color: #ffffff;">');
    
    // Check if the preloader has z-index hiding everything but its white background?
    // The preloader has opacity 150ms ease-out. If opacity becomes 0, pointer-events none is NOT there!
    // But it has p.remove(), so it's deleted from DOM.
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Forced HTML and BODY to dark via inline styles!");
    ssh.dispose();
}
forceHtmlDark().catch(console.error);
