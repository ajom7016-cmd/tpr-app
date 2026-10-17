const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixHeroRevert() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // The problem is in the <style id="pro-mobile-compact"> block.
    // I need to carefully remove ALL overrides related to .hero, .glass-panel, .part-top-left, .btn-group, etc.
    
    // We can just completely replace the <style id="pro-mobile-compact"> block with a corrected one that leaves the hero alone.
    const correctedMobileCSS = `
    <!-- PRO MOBILE COMPACT FIX -->
    <style id="pro-mobile-compact">
        @media (max-width: 768px) {
            body { overflow-x: hidden; }
            
            /* Navbar */
            .navbar { padding: 15px 20px !important; flex-direction: column; gap: 15px; text-align: center; }
            .navbar > div { gap: 12px !important; flex-wrap: wrap; justify-content: center; }
            .navbar h2 { font-size: 1.25rem !important; }
            .navbar a { font-size: 0.9rem !important; }

            /* App Preview Section */
            .app-preview-section { padding: 50px 15px 30px 15px !important; margin-top: 0 !important; }
            .preview-text-centered h2 { font-size: 1.8rem !important; font-weight: 800 !important; line-height: 1.2 !important; margin-bottom: 10px !important; }
            .preview-text-centered p { font-size: 0.95rem !important; padding: 0 10px !important; }

            /* Phone Mockup - Fluid Scaling */
            .preview-container { display: flex; flex-direction: column; align-items: center; overflow: hidden; width: 100%; }
            .frame-1 { transform: scale(0.85) !important; transform-origin: top center !important; margin-bottom: -100px !important; }

            /* Map Section */
            .map-wrapper { margin: 0 15px 30px 15px !important; padding: 40px 15px !important; min-height: 300px !important; border-radius: 20px !important; }
            .map-title { font-size: 1.5rem !important; top: 15px !important; white-space: normal !important; word-break: break-word !important; }
            .node { width: 5px !important; height: 5px !important; }
            .node span { font-size: 0.65rem !important; font-weight: 600 !important; }

            /* Footer */
            .footer { flex-direction: column !important; padding: 25px 20px !important; gap: 15px !important; text-align: center !important; }
        }
        
        @media (max-width: 360px) {
            .preview-text-centered h2 { font-size: 1.6rem !important; }
            .frame-1 { transform: scale(0.75) !important; margin-bottom: -160px !important; }
        }
    </style>
    `;

    // Replace the entire pro-mobile-compact block
    html = html.replace(/<!-- PRO MOBILE COMPACT FIX -->[\s\S]*?<\/style>/, correctedMobileCSS);

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Hero section overrides completely removed!");
    } else {
        console.log("No changes made. Block not found.");
    }

    ssh.dispose();
}
fixHeroRevert().catch(console.error);
