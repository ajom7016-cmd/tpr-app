const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixHeroExactDesktop() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    const exactDesktopCSS = `
        /* EXACT DESKTOP MINIATURIZATION FOR MOBILE */
        @media (max-width: 768px) {
            /* Force the background to contain (not crop) the image */
            .hero {
                background-size: 100% auto !important; /* Fit width perfectly */
                background-position: center top !important; /* Align to top */
                height: 55vw !important; /* Roughly match the aspect ratio of the image */
                min-height: unset !important;
                margin-top: 50px !important; /* Navbar space */
                border-radius: 15px !important;
            }
            
            /* Ensure the popout dog layer matches the exact same scaling! */
            .popout-layer {
                background-size: 100% auto !important;
                background-position: center top !important;
            }
            
            /* Scale the glass panel down massively so it fits inside the tiny 55vw container */
            .glass-panel {
                width: 100% !important;
                transform: translate(-50%, -50%) scale(0.45) !important;
                top: 50% !important;
                left: 50% !important;
            }
            
            /* Hide absolute Windows button to save space */
            .part-top-left .btn-glossy[download] {
                display: none !important;
            }
        }
        
        @media (max-width: 400px) {
            .glass-panel {
                transform: translate(-50%, -50%) scale(0.38) !important;
            }
        }
    `;

    // Remove the old miniaturize block
    html = html.replace(/\/\* MINIATURIZE HERO FOR MOBILE \*\/[\s\S]*?@media \(max-width: 400px\) \{[\s\S]*?\}\s*\}/, '');

    // Append the new one inside the master-overrides block
    if (html.includes('</style>')) {
        const parts = html.split('</style>');
        if (parts.length > 1) {
            html = parts.slice(0, -1).join('</style>') + `\n${exactDesktopCSS}\n` + '</style>' + parts[parts.length - 1];
        }
    }

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Exact desktop miniaturization applied!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fixHeroExactDesktop().catch(console.error);
