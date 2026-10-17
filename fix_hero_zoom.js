const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixHeroZoom() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    const heroZoomFixCSS = `
        /* MINIATURIZE HERO FOR MOBILE */
        @media (max-width: 768px) {
            /* 1. Make the hero section shorter so the background image doesn't zoom in massively */
            .hero {
                height: 450px !important;
                min-height: unset !important;
                margin-top: 60px !important; /* Make room for navbar */
            }
            
            /* 2. Scale down the entire glass panel (text + buttons) so it fits exactly like desktop */
            .glass-panel {
                /* We scale it to 65% size. To prevent it from becoming too narrow, we widen the base width */
                width: 140% !important; 
                transform: translate(-50%, -50%) scale(0.65) !important;
            }
            
            /* Hide the absolute positioned Windows button on mobile if it clutters, or keep it */
            .part-top-left .btn-glossy[download] {
                display: none !important;
            }
        }
        
        @media (max-width: 400px) {
            .hero {
                height: 400px !important;
            }
            .glass-panel {
                width: 150% !important;
                transform: translate(-50%, -50%) scale(0.55) !important;
            }
        }
    `;

    // Append this inside the master-overrides block
    if (html.includes('</style>')) {
        // Find the last occurrence of </style>
        const parts = html.split('</style>');
        if (parts.length > 1) {
            // Rejoin all but the last, then append our CSS and the last </style>
            html = parts.slice(0, -1).join('</style>') + `\n${heroZoomFixCSS}\n` + '</style>' + parts[parts.length - 1];
        }
    }

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Hero miniaturization applied!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fixHeroZoom().catch(console.error);
