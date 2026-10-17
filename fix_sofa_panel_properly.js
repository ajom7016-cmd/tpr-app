const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixSofaPanelProperly() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Revert the messy .glass-panel CSS I did earlier
    // Find the current glass-panel block
    html = html.replace(/width:\s*70%;\s*max-width:\s*600px;\s*min-height:\s*300px;\s*padding:\s*30px\s*0;/g, 
                        'width: 80%; max-width: 580px; border-radius: 35px;');
    
    // In case it's slightly different:
    html = html.replace(/max-width:\s*660px;/g, 'max-width: 580px;');

    // 2. Make it taller (mota) from the INSIDE (so the text doesn't hit the edges)
    // Find .part-top-left padding on desktop
    // Wait, the desktop padding was in the HTML style attributes or CSS?
    // Let's add some hardcoded padding to the parts to ensure it is tall and has breathing room!
    // The previous CSS had:
    // .part-top-left { padding: 40px 40px 0px 40px; }
    // .part-bottom-left { padding: 0px 40px 40px 40px; }
    // Let's increase the top and bottom padding to 60px!
    const desktopPaddingCSS = `
    .part-top-left { padding: 50px 40px 0px 40px; }
    .part-bottom-left { padding: 0px 40px 50px 40px; }
    `;
    
    // Inject this after .glass-panel { ... }
    html = html.replace(/\.glass-panel\s*\{[^}]*\}/, match => match + desktopPaddingCSS);
    
    // Make sure mobile padding is ALSO updated so it's not overflowing
    const mobilePaddingCSS = `
    @media (max-width: 768px) {
        .part-top-left { padding: 25px 15px 0px 15px !important; }
        .part-bottom-left { padding: 0px 15px 25px 15px !important; }
    }`;
    html = html.replace('</style>', `    ${mobilePaddingCSS}\n    </style>`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Sofa glass panel fixed properly!");
    ssh.dispose();
}
fixSofaPanelProperly().catch(console.error);
