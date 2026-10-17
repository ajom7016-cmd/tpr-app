const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixInlineStyles() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // 1. Remove strict inline flex styles from btn-group so mobile CSS can easily take over
    html = html.replace(
        '<div class="btn-group" style="display: flex; gap: 15px; margin-top: 45px; flex-wrap: nowrap; align-items: flex-start;">',
        '<div class="btn-group" style="display: flex; gap: 15px; margin-top: 45px; flex-wrap: wrap; align-items: flex-start;">'
    );
    
    // 2. Fix the map title so it never cuts off on mobile
    html = html.replace(
        'white-space: nowrap;',
        'white-space: normal;'
    );
    
    // 3. Let's make sure the inline text-shadows on the hero texts don't make them look muddy
    // The user complained "ato mota" (so thick). font-weight 800 with a heavy text shadow looks very thick.
    html = html.replace(
        '<h1 style="font-size: 2.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 5px; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">',
        '<h1 style="font-size: 2.5rem; font-weight: 700; line-height: 1.1; margin-bottom: 5px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">'
    );
    
    // 4. Update the mobile CSS slightly to ensure buttons stack nicely
    html = html.replace(
        '.btn-group { display: flex !important; flex-direction: column !important; gap: 12px !important; width: 100% !important; }',
        '.btn-group { display: flex !important; flex-direction: column !important; gap: 12px !important; width: 100% !important; align-items: center !important; }'
    );

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Inline styles fixed for better mobile compatibility!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fixInlineStyles().catch(console.error);
