const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // 1. Fix app.html
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let appHtml = res.stdout;
    appHtml = appHtml.replace(
        /const isLandingDemo = \(\(\) => \{ try \{ return window\.self !== window\.top; \} catch\(e\) \{ return true; \} \}\)\(\);/g,
        "const isLandingDemo = (() => { try { return window.top.location.pathname !== '/app.html'; } catch(e) { return true; } })();"
    );
    let b64a = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64a}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Fixed app.html isLandingDemo logic");

    // 2. Fix js/app.js
    res = await ssh.execCommand("cat /var/www/jmj_app/public/js/app.js");
    let js = res.stdout;
    js = js.replace(
        /const isLandingDemo = \(\(\) => \{ try \{ return window\.self !== window\.top; \} catch\(e\) \{ return true; \} \}\)\(\);/g,
        "const isLandingDemo = (() => { try { return window.top.location.pathname !== '/app.html'; } catch(e) { return true; } })();"
    );
    let b64j = Buffer.from(js).toString('base64');
    await ssh.execCommand(`echo "${b64j}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
    console.log("Fixed js/app.js isLandingDemo logic");

    console.log("All done! Real app will now fetch real data, Demo will fetch demo data.");
    ssh.dispose();
}
fix().catch(console.error);
