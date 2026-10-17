const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixArcAnimation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // We need to change the .arc CSS back to the drawing animation!
    // Let's set stroke-dasharray: 15 100 (a short dash traveling) or just stroke-dasharray: 100
    // Actually, "ber hoya location a jabe abar back asbe" (goes out and comes back)
    // This is alternate animation! animation: dash 3s ease-in-out infinite alternate;
    
    // Let's find the current .arc definition
    const arcRegex = /\.arc\s*\{[^}]*\}/;
    
    // Let's replace it with a beautiful drawing animation!
    const newArcCSS = `.arc { fill: none; stroke: rgba(234,88,12,0.5); stroke-width: 1.5; stroke-dasharray: 250; stroke-dashoffset: 250; animation: dash-draw 4s ease-in-out infinite; }`;
    
    html = html.replace(arcRegex, newArcCSS);
    
    // Replace the dash keyframes
    const oldKeyframesRegex = /@keyframes\s*dash\s*\{[^}]*\}/;
    const newKeyframes = `@keyframes dash-draw { 0% { stroke-dashoffset: 250; } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -250; } }`;
    
    if (html.match(oldKeyframesRegex)) {
        html = html.replace(oldKeyframesRegex, newKeyframes);
    } else {
        html = html.replace('</style>', `    ${newKeyframes}\n    </style>`);
    }

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Arc animation fixed!");
    ssh.dispose();
}
fixArcAnimation().catch(console.error);
