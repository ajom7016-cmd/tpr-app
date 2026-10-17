const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMapAlignmentAndAnimation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // --- 1. Fix Map Alignment (Dots & Map Background) ---
    // Change background: url('/world_map.svg') center/80% to 100% 100%
    html = html.replace(/background:\s*url\('\/world_map\.svg'\)\s*center\/80%\s*no-repeat;/g, 'background: url(\'/world_map.svg\') center/100% 100% no-repeat;');
    
    // Also add to mobile media query just in case
    
    // --- 2. Fix Arc Animation (Thin line, travels out and comes back) ---
    // The user wants a thin line ("chikon dari") that travels out and comes back.
    // stroke-dasharray: 10 200; (10px line, 200px gap)
    // animation: dash-draw 3s ease-in-out infinite alternate; (travels out, then reverses back)
    const oldArcCSS = /\.arc\s*\{[^}]*\}/;
    const newArcCSS = `.arc { fill: none; stroke: rgba(234,88,12,0.8); stroke-width: 1; stroke-dasharray: 8 200; stroke-dashoffset: 200; animation: dash-draw 2.5s ease-in-out infinite alternate; }`;
    
    html = html.replace(oldArcCSS, newArcCSS);
    
    // Update keyframes for dash-draw (0 to 200)
    const oldKeyframes = /@keyframes\s*dash-draw\s*\{[^}]*\}/;
    const newKeyframes = `@keyframes dash-draw { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }`;
    
    html = html.replace(oldKeyframes, newKeyframes);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Map alignment and arc animation fixed!");
    ssh.dispose();
}
fixMapAlignmentAndAnimation().catch(console.error);
