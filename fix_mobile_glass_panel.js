const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMobileGlassPanel() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // In mobile CSS, .glass-panel has width: 90% !important;
    // We want it to be 70% to match desktop (sitting between armrests)
    html = html.replace(/\.glass-panel\s*\{\s*width:\s*90%\s*!important;\s*\}/, 
        `.glass-panel { width: 70% !important; min-height: unset !important; padding: 15px 0 !important; }`);
    
    // Also the text inside might be too big if width is 70%
    // Let's make sure the text scales down nicely
    // .part-top-left h1, .part-bottom-left h1 are already 0.85rem.
    // .btn-group buttons on mobile might wrap.
    const btnGroupMobile = `
            .btn-group { flex-wrap: wrap !important; justify-content: center; }
            .btn-glossy { padding: 4px 8px !important; font-size: 0.5rem !important; }
    `;
    
    // Inject the button group fix into mobile CSS
    // Let's find .btn-group { gap: 4px !important; margin-top: 15px !important; }
    html = html.replace(/\.btn-group\s*\{[^}]*\}/, `.btn-group { gap: 4px !important; margin-top: 15px !important; flex-wrap: wrap !important; }`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Mobile glass panel fixed to look exactly like desktop proportions!");
    ssh.dispose();
}
fixMobileGlassPanel().catch(console.error);
