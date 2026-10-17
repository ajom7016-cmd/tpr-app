const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixMobileAndRevertDark() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Revert the middle section to Dark Theme
    html = html.replace('.app-preview-section { padding: 100px 20px; background: #f8fafc;', '.app-preview-section { padding: 100px 20px; background: #111;');
    // I previously replaced the text color. I'll just change any #1e293b or #475569 in that section back to white/gray
    html = html.replace(/color: #1e293b/g, 'color: #ffffff');
    html = html.replace(/color: #475569/g, 'color: #9ca3af');
    html = html.replace('box-shadow: 0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.1);', 'box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.2);');

    // 2. Inject Mobile Responsiveness CSS
    // We will append a comprehensive media query block to the end of the <style> tag
    const mobileCSS = `
        /* Mobile Compact Responsiveness */
        @media (max-width: 768px) {
            /* Navbar */
            .navbar { padding: 15px 20px; flex-direction: column; gap: 15px; }
            .navbar > div { gap: 15px !important; flex-wrap: wrap; justify-content: center; }
            
            /* Hero Section */
            .hero { 
                margin: 0; 
                border-radius: 0; 
                height: auto; 
                min-height: 80vh; 
                padding: 100px 15px 40px 15px; 
            }
            .glass-panel { 
                position: relative; 
                top: 0; left: 0; 
                transform: none; 
                margin: 0; 
                width: 100%; 
                max-width: 100%; 
                display: flex; 
                flex-direction: column; 
            }
            .part-top-left { padding: 30px 20px !important; }
            .part-bottom-left { padding: 15px 20px 30px 20px !important; }
            .glass-panel h1 { font-size: 2rem !important; line-height: 1.2 !important; }
            .glass-panel p { font-size: 1rem !important; }
            
            /* Hero Buttons */
            .btn-group { display: flex; flex-direction: column; gap: 10px; width: 100%; }
            .btn-glossy { width: 100%; justify-content: center; font-size: 1rem; padding: 14px 20px; }
            
            /* App Preview Section */
            .app-preview-section { padding: 50px 15px !important; margin-top: 0 !important; }
            .preview-text-centered h2 { font-size: 2.2rem !important; line-height: 1.2 !important; }
            .preview-text-centered p { font-size: 1rem !important; }
            
            /* Phone Mockup Scaling */
            .frame-1 { 
                transform: scale(0.9); /* Scale it down slightly to fit small screens */
                transform-origin: top center;
                margin-bottom: -60px; /* Adjust for scaling gap */
            }
            
            /* Map Section */
            .global-section { padding: 40px 15px; }
            .map-container { height: 250px; background-size: 100%; }
            .map-title { font-size: 1.8rem; top: 15px; }
            .node { width: 4px; height: 4px; }
            
            /* Footer */
            .footer { flex-direction: column; padding: 30px 20px; gap: 20px; text-align: center; }
        }
        
        @media (max-width: 380px) {
            .frame-1 { transform: scale(0.85); margin-bottom: -100px; }
        }
    `;

    // Remove old mobile block if exists to avoid duplicates
    html = html.replace(/\/\* Mobile Compact Responsiveness \*\/[\s\S]*?@media \(max-width: 380px\) \{[\s\S]*?\}\s*\}/, '');

    // Insert new mobile block right before </style>
    if (html.includes('</style>')) {
        html = html.replace('</style>', `${mobileCSS}\n</style>`);
    }

    const b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Reverted to Dark and injected Mobile Responsiveness!");
    ssh.dispose();
}
fixMobileAndRevertDark().catch(console.error);
