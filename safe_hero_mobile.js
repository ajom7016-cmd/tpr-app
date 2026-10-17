const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixHeroMobileSafely() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    const safeHeroMobileCSS = `
        /* SAFE HERO MOBILE RESPONSIVENESS (Preserves 3D Grid) */
        @media (max-width: 768px) {
            /* Keep the glass panel structure exactly as desktop, just scale contents */
            .glass-panel {
                width: 95% !important; /* Slightly smaller width on mobile */
                padding: 20px !important;
            }
            
            /* Scale down text for both background and foreground layers equally */
            .glass-panel h1 {
                font-size: 1.8rem !important;
                line-height: 1.2 !important;
            }
            .glass-panel p {
                font-size: 0.95rem !important;
                margin-bottom: 25px !important;
            }
            
            /* Fix the squished buttons by allowing them to wrap! */
            .btn-group {
                flex-wrap: wrap !important;
                justify-content: flex-start !important;
                gap: 10px !important;
            }
            .btn-glossy {
                padding: 10px 15px !important;
                font-size: 0.85rem !important;
                flex: 1 1 auto !important; /* Allow them to grow and wrap nicely */
                text-align: center !important;
                justify-content: center !important;
            }
            
            /* The Windows button is absolute top-right, let's adjust it for mobile */
            .part-top-left .btn-glossy[download] {
                top: -15px !important;
                right: 10px !important;
                padding: 6px 12px !important;
                font-size: 0.75rem !important;
            }
        }
        
        @media (max-width: 400px) {
            .glass-panel h1 { font-size: 1.5rem !important; }
            .btn-group { flex-direction: column !important; } /* Stack vertically on very tiny screens */
            .btn-glossy { width: 100% !important; }
        }
    `;

    // We will append this safely inside the <style id="master-overrides"> block
    // Let's find the closing </style> of master-overrides
    if (html.includes('/* PRO MOBILE COMPACT FIX (EXCLUDING HERO SECTION) */')) {
        html = html.replace('/* PRO MOBILE COMPACT FIX (EXCLUDING HERO SECTION) */', safeHeroMobileCSS + '\n\n        /* PRO MOBILE COMPACT FIX (EXCLUDING HERO SECTION) */');
    }

    // Also, we must change the inline style of btn-group to remove flex-wrap: nowrap; so our !important works without fighting too hard, or just leave it since !important wins.
    // The problem might be the fixed width of .btn-glossy or the inline nowrap.
    html = html.replace(
        /flex-wrap: nowrap;/g,
        'flex-wrap: wrap;'
    );

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Safe Hero Mobile CSS applied!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fixHeroMobileSafely().catch(console.error);
