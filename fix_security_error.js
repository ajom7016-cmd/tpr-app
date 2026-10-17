const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // 1. Fix app.html — wrap redirect in try-catch so sandbox doesn't cause visible error
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let html = res.stdout;

    // Replace the bare redirect with a try-catch wrapped version
    html = html.replace(
        `const isLandingDemo = (window.top !== window);
      if (!isLandingDemo && !localStorage.getItem('userToken')) {
        window.location.href = '/login.html';
    }`,
        `const isLandingDemo = (() => { try { return window.self !== window.top; } catch(e) { return true; } })();
      if (!isLandingDemo && !localStorage.getItem('userToken')) {
        try { window.location.href = '/login.html'; } catch(e) {}
    }`
    );

    // Also suppress any window.onerror that displays errors visually
    // Add a silent error handler at the very top of <head>
    html = html.replace('<head>', `<head>
<script>window.onerror = function(msg, url, line) { if (msg && msg.toString().indexOf('SecurityError') !== -1) return true; };</script>`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Fixed app.html");

    // 2. Also fix js/app.js — same treatment
    res = await ssh.execCommand("cat /var/www/jmj_app/public/js/app.js");
    let js = res.stdout;
    
    // Wrap any window.top references in try-catch
    js = js.replace(
        "const isLandingDemo = (window.top !== window);",
        "const isLandingDemo = (() => { try { return window.self !== window.top; } catch(e) { return true; } })();"
    );

    let b64js = Buffer.from(js).toString('base64');
    await ssh.execCommand(`echo "${b64js}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
    console.log("Fixed js/app.js");

    // 3. Fix ALL code.html files that might have window.location redirects to login
    res = await ssh.execCommand("grep -rl 'window.location.href.*login' /var/www/jmj_app/public/ --include='*.html'");
    let files = res.stdout.split('\n').filter(Boolean);
    
    for (let file of files) {
        if (file.includes('login.html') || file.includes('index.html')) continue; // skip login page itself
        
        let contentRes = await ssh.execCommand(`cat "${file}"`);
        let content = contentRes.stdout;
        let original = content;
        
        // Wrap login redirects in try-catch
        content = content.replace(
            /window\.location\.href\s*=\s*'\/login\.html'/g,
            "try { window.location.href = '/login.html'; } catch(e) {}"
        );
        
        if (content !== original) {
            console.log(`Patched: ${file}`);
            let b64f = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64f}" | base64 -d > "${file}"`);
        }
    }

    // 4. Verify
    res = await ssh.execCommand("head -5 /var/www/jmj_app/public/app.html");
    console.log("Verify:", res.stdout);

    console.log("All done!");
    ssh.dispose();
}
fix().catch(console.error);
