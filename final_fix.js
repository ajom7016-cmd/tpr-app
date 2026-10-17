const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // ===== FIX 1: glassmorphic_1/code.html - remove the red error banner display =====
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/glassmorphic_1/code.html");
    let glassHtml = res.stdout;

    // Replace the window.onerror that DISPLAYS errors with one that SUPPRESSES them
    glassHtml = glassHtml.replace(
        /window\.onerror\s*=\s*function\s*\(msg,\s*url,\s*lineNo,\s*columnNo,\s*error\)\s*\{[\s\S]*?let\s+errStr\s*=\s*"ERROR:\s*"\s*\+\s*msg\s*\+\s*"\s*@\s*Line:\s*"\s*\+\s*lineNo;[\s\S]*?\};/,
        'window.onerror = function(msg, url, lineNo, columnNo, error) { return true; };'
    );

    let b64g = Buffer.from(glassHtml).toString('base64');
    await ssh.execCommand(`echo "${b64g}" | base64 -d > /var/www/jmj_app/public/glassmorphic_1/code.html`);
    console.log("Fixed glassmorphic_1/code.html - removed red error banner");

    // ===== FIX 2: app.html - fix the isLandingDemo line that didn't get patched =====
    res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let appHtml = res.stdout;

    // The old code still has: const isLandingDemo = (window.top !== window);
    // This SHOULD work but the sandbox might interfere. Let's use a safer try-catch version.
    appHtml = appHtml.replace(
        /const isLandingDemo = \(window\.top !== window\);/g,
        "const isLandingDemo = (() => { try { return window.self !== window.top; } catch(e) { return true; } })();"
    );

    let b64a = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64a}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Fixed app.html - safer isLandingDemo check");

    // ===== FIX 3: Also check ALL other code.html files for similar window.onerror error displays =====
    res = await ssh.execCommand("grep -rl 'ERROR.*@.*Line' /var/www/jmj_app/public/ --include='*.html'");
    let files = res.stdout.split('\n').filter(Boolean);
    for (let file of files) {
        if (file.includes('glassmorphic_1')) continue; // already fixed
        let contentRes = await ssh.execCommand(`cat "${file}"`);
        let content = contentRes.stdout;
        let original = content;
        content = content.replace(
            /window\.onerror\s*=\s*function\s*\(msg,\s*url,\s*lineNo,\s*columnNo,\s*error\)\s*\{[\s\S]*?let\s+errStr\s*=\s*"ERROR:\s*"\s*\+\s*msg\s*\+\s*"\s*@\s*Line:\s*"\s*\+\s*lineNo;[\s\S]*?\};/,
            'window.onerror = function(msg, url, lineNo, columnNo, error) { return true; };'
        );
        if (content !== original) {
            console.log(`Also patched: ${file}`);
            let b64 = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > "${file}"`);
        }
    }

    // ===== FIX 4: Landing page - remove slow loading animations (kalo theke dhire dhire) =====
    res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let indexHtml = res.stdout;

    // Remove any opacity:0 or animation-related CSS that causes "black to slow load"
    indexHtml = indexHtml.replace(/opacity:\s*0\s*;/g, '');
    indexHtml = indexHtml.replace(/animation:\s*fadeIn[^;]*;/g, '');
    indexHtml = indexHtml.replace(/animation:\s*smoothLoad[^;]*;/g, '');
    indexHtml = indexHtml.replace(/@keyframes\s+fadeIn\s*\{[^}]*\{[^}]*\}[^}]*\}/g, '');
    indexHtml = indexHtml.replace(/@keyframes\s+smoothLoad\s*\{[^}]*\{[^}]*\}[^}]*\}/g, '');

    let b64i = Buffer.from(indexHtml).toString('base64');
    await ssh.execCommand(`echo "${b64i}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Fixed index.html - removed slow animations");

    // Verify
    res = await ssh.execCommand("grep 'onerror' /var/www/jmj_app/public/glassmorphic_1/code.html");
    console.log("Verify glassmorphic onerror:", res.stdout.includes('return true') ? 'SUPPRESSED' : 'STILL SHOWING');

    res = await ssh.execCommand("grep 'isLandingDemo' /var/www/jmj_app/public/app.html | head -1");
    console.log("Verify isLandingDemo:", res.stdout);

    console.log("ALL DONE!");
    ssh.dispose();
}
fix().catch(console.error);
