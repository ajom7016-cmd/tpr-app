const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // 1. Read index.html
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;

    // 2. Replace the iframe tag — add sandbox to BLOCK top-level navigation
    //    sandbox="allow-scripts allow-same-origin allow-popups allow-forms" 
    //    This allows everything EXCEPT navigating the parent/top window.
    html = html.replace(
        /<iframe src='\/app\.html\?v=\d+'/g,
        "<iframe sandbox=\"allow-scripts allow-same-origin allow-popups allow-forms\" src='/app.html?v=3'"
    );

    // Also catch any without query param
    html = html.replace(
        /<iframe src='\/app\.html'/g,
        "<iframe sandbox=\"allow-scripts allow-same-origin allow-popups allow-forms\" src='/app.html?v=3'"
    );

    // 3. Write back
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // 4. Verify
    let verify = await ssh.execCommand("grep 'sandbox' /var/www/jmj_app/public/index.html");
    console.log("Verify sandbox:", verify.stdout ? "SUCCESS" : "NOT FOUND");

    console.log("Done! iframe is now sandboxed — no more top-level redirects.");
    ssh.dispose();
}
fix().catch(console.error);
