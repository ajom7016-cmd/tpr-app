const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixHeroGap() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // First, remove the padding: 15px !important; from .glass-panel in mobile
    html = html.replace(/\.glass-panel \{\s+width: 85% !important;\s+padding: 15px !important;\s+\}/g, '.glass-panel { width: 85% !important; }');
    
    // Then, add specific padding overrides for the internal parts on mobile
    const overrides = `
            .part-top-left { padding: 15px 15px 0px 15px !important; }
            .part-bottom-left { padding: 0px 15px 15px 15px !important; }
    `;
    
    // Insert overrides into the media query
    html = html.replace('/* IMPORTANT: We target BOTH inline text layers to ensure exact sync! */', overrides + '\n            /* IMPORTANT: We target BOTH inline text layers to ensure exact sync! */');

    // Also reduce desktop padding a bit just in case
    html = html.replace('padding: 60px 30px 5px 30px;', 'padding: 30px 30px 5px 30px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Fixed the huge top gap by overriding padding!");
    ssh.dispose();
}
fixHeroGap().catch(console.error);
