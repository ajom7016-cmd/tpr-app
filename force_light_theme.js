const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Forcing Light Mode via override stylesheet...");
    
    // We will append a <style> block at the end of <head> that forces the light theme colors, 
    // overriding the dark theme ones. This is 100% reliable.
    const lightThemeOverrides = `
    <!-- FORCE LIGHT THEME OVERRIDES -->
    <style id="light-theme-overrides">
        body, .main-wrapper {
            background-color: #f8fafc !important;
            color: #1e293b !important;
        }
        
        /* Hero Section Fix */
        .hero::before {
            background: rgba(255, 255, 255, 0.4) !important;
        }
        .hero {
            background-color: #f1f5f9 !important;
        }
        
        /* App Preview Section Fix */
        .app-preview-section {
            background-color: #f8fafc !important;
        }
        
        /* Feature Map Section */
        .global-section {
            background-color: #ffffff !important;
        }
        
        /* Footer Fix */
        .footer {
            background-color: #f1f5f9 !important;
            border-top: 1px solid #e2e8f0 !important;
        }
        .footer p {
            color: #64748b !important;
        }
        
        /* Phone Mockup Wrapper Fix */
        .mockup-wrapper {
            background-color: #ffffff !important;
            border-color: #ffffff !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important;
        }
        
        /* Glass Panel Fix */
        .glass-panel {
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05) !important;
        }
        .glass-panel h1, .glass-panel h2 {
            color: #1e293b !important;
        }
        .glass-panel p {
            color: #475569 !important;
        }
        .stat-item {
            background: rgba(255, 255, 255, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.8) !important;
        }
    </style>
    `;

    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // Clean up any old overrides
    html = html.replace(/<!-- FORCE LIGHT THEME OVERRIDES -->[\s\S]*?<\/style>/, '');
    
    // Inject the overrides right before </head>
    if (html.includes('</head>')) {
        html = html.replace('</head>', `\n${lightThemeOverrides}\n</head>`);
    }

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Light theme overrides applied!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fix().catch(console.error);
