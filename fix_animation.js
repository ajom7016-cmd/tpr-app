const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read index.html (landing page)
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Remove the slow iframe animation
    html = html.replace(/opacity:\s*0;\s*animation:\s*fadeIn\s*1s\s*ease-in\s*forwards;\s*animation-delay:\s*0\.5s;/g, "opacity: 1;");
    
    // Change screen-area background from #000 to #e2e8f0 (a light gray, better than black before loading)
    html = html.replace(/background:\s*#000;/g, "background: #e2e8f0;");
    
    // Also remove the @keyframes fadeIn if present
    html = html.replace(/@keyframes\s*fadeIn\s*\{\s*from\s*\{\s*opacity:\s*0;\s*\}\s*to\s*\{\s*opacity:\s*1;\s*\}\s*\}/g, "");
    
    // Also change the "smoothLoad" animation on the whole body/landing elements if needed, but it's 0.4s so it's fast. The iframe was 1.5s total delay!

    // Write it back
    // We will use echo with base64 to avoid quote escaping issues
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Animation removed!");
    ssh.dispose();
}
fix().catch(console.error);
