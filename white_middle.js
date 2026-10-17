const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Change the background of .app-preview-section
    html = html.replace(
        '.app-preview-section { padding: 100px 20px; background: #111;',
        '.app-preview-section { padding: 100px 20px; background: #f8fafc;'
    );
    
    // 2. Change the text color of the heading and subtitle
    // The heading looks like: <h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #ffffff; line-height: 1.1;">Explore
    html = html.replace(
        '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #ffffff; line-height: 1.1;">Explore',
        '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #1e293b; line-height: 1.1;">Explore'
    );
    // There is another version from when I reverted it:
    html = html.replace(
        '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #fff; line-height: 1.1;">Explore',
        '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #1e293b; line-height: 1.1;">Explore'
    );
    
    // The subtitle looks like: <p style="font-size: 1.25rem; color: #9ca3af; font-weight: 500;">Tap, scroll, and experience
    html = html.replace(
        '<p style="font-size: 1.25rem; color: #9ca3af; font-weight: 500;">Tap, scroll, and experience',
        '<p style="font-size: 1.25rem; color: #475569; font-weight: 500;">Tap, scroll, and experience'
    );
    
    // Also, when the background is white, the phone mockup itself might need a slightly different shadow or border to stand out perfectly.
    // The phone wrapper is: .frame-1 { ... box-shadow: 0 40px 80px rgba(0,0,0,0.8) ... }
    // A black shadow on a white background might be a bit too harsh. Let's make it slightly softer, but keep it deep.
    html = html.replace(
        'box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.2);',
        'box-shadow: 0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.1);'
    );
    // And the frame background is gradient. Let's leave it as is, since it's the phone hardware color (titanium).

    const b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Middle section is now white!");
    ssh.dispose();
}
fix().catch(console.error);
