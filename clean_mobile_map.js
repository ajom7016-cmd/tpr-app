const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanMobileMap() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Remove the mobile overrides for map so it matches desktop perfectly
    html = html.replace(/\.map-wrapper\s*\{[^}]*min-height:\s*250px[^}]*\}/, '/* map-wrapper mobile removed */');
    html = html.replace(/\.node\s*\{\s*width:\s*4px[^}]*\}/, '/* node mobile removed */');
    // We keep .map-title mobile override because font-size 2.5rem is too big for phone
    
    // One important thing: The SVG viewBox is 0 0 100 100.
    // Desktop stroke-width: 0.3 means 3.3px thick on a 1100px screen.
    // On a 350px screen, it means 1px thick.
    // If they want it to look the SAME on mobile, we can add a mobile media query for .arc!
    const arcMobile = `
    @media (max-width: 768px) {
        .arc { stroke-width: 0.8 !important; }
    }`;
    html = html.replace('</style>', `    ${arcMobile}\n    </style>`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Mobile map cleaned up to match desktop!");
    ssh.dispose();
}
cleanMobileMap().catch(console.error);
