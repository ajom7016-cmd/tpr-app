const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixIsLandingDemo() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let html = res.stdout;
    
    // Replace the isLandingDemo logic. If window.self !== window.top, it's an iframe (demo on landing page).
    // Otherwise, it's the standalone app (whether on the web or in an APK).
    html = html.replace(
        "window.isLandingDemo = (() => { try { return window.top.location.pathname !== '/app.html'; } catch(e) { return true; } })();",
        "window.isLandingDemo = (() => { try { return window.self !== window.top; } catch(e) { return true; } })();"
    );
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Fixed isLandingDemo detection logic!");
    ssh.dispose();
}
fixIsLandingDemo().catch(console.error);
