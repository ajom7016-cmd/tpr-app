const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixMixedTheme() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    const mixedThemeOverrides = `
    <!-- FORCE MIXED THEME OVERRIDES -->
    <style id="mixed-theme-overrides">
        /* Make the main page background light (this affects edges if visible) */
        body {
            background-color: #f1f5f9 !important;
        }
        
        /* The main wrapper stays dark at the top for the hero, but we'll 
           make sure the sections below it are light */
        .main-wrapper {
            background-color: #ffffff !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.05) !important;
            border: 1px solid rgba(0,0,0,0.05) !important;
        }
        
        /* Hero Section - Explicitly keep it dark and exactly as it was! */
        /* It inherits the image, but the text might inherit from body if not careful. */
        /* Let's ensure the glass panel text remains white! */
        .glass-panel h1, .glass-panel h2 {
            color: #ffffff !important;
        }
        .glass-panel p {
            color: #e2e8f0 !important;
        }
        .navbar a {
            color: #ffffff !important;
        }
        .hero {
            background-color: #2a2d34 !important; /* fallback */
        }
        
        /* App Preview Section (Middle) */
        .app-preview-section {
            background-color: #ffffff !important;
        }
        /* The texts inside app-preview-section must be dark */
        .app-preview-section h2 {
            color: #1e293b !important;
        }
        .app-preview-section p {
            color: #475569 !important;
        }
        
        /* The Phone Mockup shadow on white background */
        .frame-1 {
            box-shadow: 0 40px 80px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.05) !important;
        }
        
        /* Map Section */
        .map-wrapper {
            background-color: #ffffff !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05) !important;
            border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .world-map {
            filter: invert(0) !important;
            opacity: 0.1 !important;
        }
        .map-title {
            color: #ea580c !important;
            background: linear-gradient(to bottom, #f97316, #c2410c) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }
        .node {
            background-color: #f97316 !important;
            box-shadow: 0 0 12px 2px rgba(249, 115, 22, 0.6), 0 0 20px 5px rgba(249, 115, 22, 0.3) !important;
        }
        .node span {
            color: #475569 !important; /* The country names */
            font-weight: 700 !important;
        }
        .arc {
            stroke: rgba(249, 115, 22, 0.3) !important;
        }
        
        /* Footer */
        .footer {
            background-color: #f8fafc !important;
            border-top: 1px solid #e2e8f0 !important;
            color: #64748b !important;
        }
        .footer .fa-brands {
            color: #475569 !important;
        }
        .footer .fa-brands:hover {
            color: #f97316 !important;
        }
    </style>
    `;

    // Remove any old overrides
    html = html.replace(/<!-- FORCE MIXED THEME OVERRIDES -->[\s\S]*?<\/style>/, '');
    html = html.replace(/<!-- FORCE WHITE THEME FOR BOTTOM SECTIONS -->[\s\S]*?<\/style>/, '');
    html = html.replace(/<!-- FORCE LIGHT THEME OVERRIDES -->[\s\S]*?<\/style>/, '');

    // Inject the overrides right before </head>
    if (html.includes('</head>')) {
        html = html.replace('</head>', `\n${mixedThemeOverrides}\n</head>`);
    }

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Mixed theme applied perfectly!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fixMixedTheme().catch(console.error);
