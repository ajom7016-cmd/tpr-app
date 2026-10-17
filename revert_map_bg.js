const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function revertMapBackgroundSize() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Revert the map background size back to center/80% no-repeat. This is what the dots' percentages were calibrated for!
    html = html.replace(/background:\s*url\('\/world_map\.svg'\)\s*center\/[^\s]+\s*[^\s]+\s*no-repeat;/g, 'background: url(\'/world_map.svg\') center/80% no-repeat;');
    html = html.replace(/background:\s*url\('\/world_map\.svg'\)\s*center\/100%\s*auto\s*no-repeat;/g, 'background: url(\'/world_map.svg\') center/80% no-repeat;');

    // Ensure the arc animation is correct (draws out and comes back, very thin)
    const oldArcCSS = /\.arc\s*\{[^}]*\}/;
    const newArcCSS = `.arc { fill: none; stroke: rgba(234,88,12,0.8); stroke-width: 0.3; stroke-dasharray: 100; stroke-dashoffset: 100; animation: dash-draw 2.5s ease-in-out infinite alternate; }`;
    html = html.replace(oldArcCSS, newArcCSS);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Map background size reverted to center/80%!");
    ssh.dispose();
}
revertMapBackgroundSize().catch(console.error);
