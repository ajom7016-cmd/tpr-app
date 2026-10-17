const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function refineAnimation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Change to solid line drawing out and retracting
    const oldArcCSS = /\.arc\s*\{[^}]*\}/;
    const newArcCSS = `.arc { fill: none; stroke: rgba(234,88,12,0.8); stroke-width: 1; stroke-dasharray: 100; stroke-dashoffset: 100; animation: dash-draw 2.5s ease-in-out infinite alternate; }`;
    
    html = html.replace(oldArcCSS, newArcCSS);
    
    const oldKeyframes = /@keyframes\s*dash-draw\s*\{[^}]*\}/;
    const newKeyframes = `@keyframes dash-draw { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }`;
    
    html = html.replace(oldKeyframes, newKeyframes);

    // Let's also check if .world-map was actually updated to 100% 100%
    if (!html.includes('100% 100%')) {
        console.log("WARNING: Map background size might not have been updated!");
        // Force update
        html = html.replace(/center\/[^\s]+\s*no-repeat/g, 'center/100% 100% no-repeat');
    }

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Arc animation refined to solid drawing line!");
    ssh.dispose();
}
refineAnimation().catch(console.error);
