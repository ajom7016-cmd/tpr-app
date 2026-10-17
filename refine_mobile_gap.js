const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function refineMobileGap() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Line thickness: Not too thick, not too thin on mobile.
    // Replace the mobile arc rule I added earlier:
    html = html.replace(/\.arc\s*\{\s*stroke-width:\s*0\.8\s*!important;\s*\}/, '.arc { stroke-width: 0.5 !important; }');
    
    // 2. Spread the countries out slightly (Permanent shift for both Desktop and Mobile to increase gap)
    // Dubai: 60 -> 58
    // Pakistan: 64 -> 63
    // India: 68 -> 68 (stays center)
    // Bangladesh: 72 -> 73
    // Singapore: 76 -> 78

    // Update the HTML nodes:
    html = html.replace(/left:\s*60%;/g, 'left: 58%;'); // Dubai
    html = html.replace(/left:\s*64%;/g, 'left: 62%;'); // Pakistan (let's do 62 instead of 63 to give more gap from India)
    html = html.replace(/left:\s*68%;/g, 'left: 67%;'); // India
    html = html.replace(/left:\s*72%;/g, 'left: 73%;'); // Bangladesh
    html = html.replace(/left:\s*76%;/g, 'left: 79%;'); // Singapore

    // Update the SVG paths:
    // M 25,35 Q 42,15 60,44 -> Dubai (Change 60 to 58)
    html = html.replace('Q 42,15 60,44', 'Q 42,15 58,44');
    // M 25,35 Q 45,65 64,40 -> Pakistan (Change 64 to 62)
    html = html.replace('Q 45,65 64,40', 'Q 45,65 62,40');
    // M 25,35 Q 48,20 68,45 -> India (Change 68 to 67)
    html = html.replace('Q 48,20 68,45', 'Q 48,20 67,45');
    // M 25,35 Q 50,75 72,43 -> Bangladesh (Change 72 to 73)
    html = html.replace('Q 50,75 72,43', 'Q 50,75 73,43');
    // M 25,35 Q 55,10 76,55 -> Singapore (Change 76 to 79)
    html = html.replace('Q 55,10 76,55', 'Q 55,10 79,55');

    // 3. Add mobile text sizing to prevent overlap
    const mobileTextCSS = `
    @media (max-width: 768px) {
        .node span { font-size: 0.55rem !important; }
        .node { width: 5px !important; height: 5px !important; }
    }`;
    html = html.replace('</style>', `    ${mobileTextCSS}\n    </style>`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Spread out dots and fixed mobile line width!");
    ssh.dispose();
}
refineMobileGap().catch(console.error);
