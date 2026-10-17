const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function extremeMasterFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read the perfect, uncorrupted base file
    let html = fs.readFileSync('index_fixed.html', 'utf8');

    // 1. RE-APPLY THE "UPLOAD CLEAN" SCRIPT LOGIC
    html = html.replace('background-color: #f1f5f9; /* Light outer background */', 'background-color: #2a2d34; /* Dark outer background matching the mockup */');
    html = html.replace('body { font-family: \'Outfit\', sans-serif; background-color: #f1f5f9; /* Light outer background */ color: #1e293b;', 'body { font-family: \'Outfit\', sans-serif; background-color: #2a2d34; /* Dark outer background matching the mockup */ color: #ffffff;');
    html = html.replace('.main-wrapper { width: 100%; max-width: 1400px; background-color: #ffffff;', '.main-wrapper { width: 100%; max-width: 1400px; background-color: #1e2126;');
    html = html.replace('box-shadow: 0 20px 60px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);', 'box-shadow: 0 0 50px rgba(0,0,0,0.5);');
    html = html.replace('border: 8px solid #ffffff;', 'border: 6px solid #2a2d34;');
    html = html.replace('box-shadow: 0 30px 60px rgba(0,0,0,0.15),', 'box-shadow: 0 30px 60px rgba(0,0,0,0.6),');
    html = html.replace('inset 0 0 0 1px rgba(0,0,0,0.05);', 'inset 0 0 0 2px rgba(255,255,255,0.1);');
    html = html.replace('background: rgba(255, 255, 255, 0.7);', 'background: rgba(25, 27, 33, 0.6);');
    html = html.replace('border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 20px 40px rgba(0,0,0,0.05);', 'border: 1px solid rgba(255, 255, 255, 0.1);');
    html = html.replace(/<h2 style="font-size: 3\.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #1e293b; line-height: 1\.1;">Explore/g, '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #ffffff; line-height: 1.1;">Explore');
    html = html.replace(/color: #1e293b;/g, 'color: #fff;');
    html = html.replace(/color: #475569;/g, 'color: #e2e8f0;');
    html = html.replace('background: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.8);', 'background: rgba(255,255,255,0.05);');
    html = html.replace(/color: #64748b;/g, 'color: #a0aec0;');
    html = html.replace('background: #f8fafc; border-top: 1px solid #e2e8f0;', 'background: #000000; border-top: 1px solid rgba(255,255,255,0.05);');
    html = html.replace(/<!-- FORCE WHITE THEME FOR BOTTOM SECTIONS -->[\s\S]*?<\/style>/, '');
    html = html.replace(/<!-- FORCE LIGHT THEME OVERRIDES -->[\s\S]*?<\/style>/, '');

    // Replace strict inline nowrap on the hero buttons
    html = html.replace(
        '<div class="btn-group" style="display: flex; gap: 15px; margin-top: 45px; flex-wrap: nowrap; align-items: flex-start;">',
        '<div class="btn-group" style="display: flex; gap: 15px; margin-top: 45px; flex-wrap: wrap; align-items: flex-start;">'
    );

    // Add PWA manifest to the head!
    if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#171a1f">
    <link rel="apple-touch-icon" href="/assets/logo.png">
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW reg failed: ', err));
            });
        }
    </script>`);
    }

    // Replace the Android/Windows button links to trigger PWA install if possible
    html = html.replace(
        '<a href="/TPR_App.apk" download="TPR_App.apk" class="btn-glossy">',
        '<a href="#" onclick="promptPWAInstall(event); return false;" class="btn-glossy">'
    );
    html = html.replace(
        '<a href="/TPR_Windows_Setup.exe" download="TPR_Windows_Setup.exe" class="btn-glossy"',
        '<a href="#" onclick="promptPWAInstall(event); return false;" class="btn-glossy"'
    );
    html = html.replace('</body>', `
    <script>
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });
        function promptPWAInstall(e) {
            e.preventDefault();
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            } else {
                // Fallback if not available
                alert('Please tap the 3 dots in your browser menu and select "Install App" or "Add to Home Screen" to install TPR perfectly like a Play Store app!');
            }
        }
    </script>
    </body>`);

    // 2. RE-APPLY THE "PERFECT MIXED THEME" + **NATIVE** MOBILE CSS OVERRIDE BLOCK (NO TRANSFORM SCALE BUGS)
    const masterCSS = `
    <!-- MASTER FINAL OVERRIDES V2 -->
    <style id="master-final-overrides-v2">
        body { background-color: #f1f5f9 !important; }
        .main-wrapper { background-color: #ffffff !important; box-shadow: 0 20px 60px rgba(0,0,0,0.05) !important; border: 1px solid rgba(0,0,0,0.05) !important; }
        .glass-panel h1, .glass-panel h2 { color: #ffffff !important; }
        .glass-panel p { color: #e2e8f0 !important; }
        .navbar a { color: #ffffff !important; }
        .hero { background-color: #2a2d34 !important; }
        .app-preview-section { background-color: #ffffff !important; }
        .app-preview-section h2 { color: #1e293b !important; }
        .app-preview-section p { color: #475569 !important; }
        .frame-1 { box-shadow: 0 40px 80px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.05) !important; }
        .map-wrapper { background-color: #ffffff !important; box-shadow: 0 10px 40px rgba(0,0,0,0.05) !important; border: 1px solid rgba(0,0,0,0.05) !important; }
        .world-map { filter: invert(0) !important; opacity: 0.25 !important; }
        .map-title { color: #ea580c !important; background: linear-gradient(to bottom, #f97316, #c2410c) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; white-space: normal !important; word-break: break-word !important; }
        .node { background-color: #f97316 !important; box-shadow: 0 0 12px 2px rgba(249, 115, 22, 0.6), 0 0 20px 5px rgba(249, 115, 22, 0.3) !important; }
        .node span { color: #475569 !important; font-weight: 700 !important; }
        .arc { stroke: #ea580c !important; stroke-width: 0.3px !important; opacity: 0.8 !important; }
        .footer { background-color: #f8fafc !important; border-top: 1px solid #e2e8f0 !important; color: #64748b !important; }
        .footer .fa-brands { color: #475569 !important; }
        .footer .fa-brands:hover { color: #f97316 !important; }

        @media (max-width: 768px) {
            body { overflow-x: hidden; }
            .navbar { padding: 15px 20px !important; flex-direction: column; gap: 15px; text-align: center; }
            .navbar > div { gap: 12px !important; flex-wrap: wrap; justify-content: center; }
            .navbar h2 { font-size: 1.25rem !important; }
            .navbar a { font-size: 0.9rem !important; }
            .app-preview-section { padding: 50px 15px 30px 15px !important; margin-top: 0 !important; }
            .preview-text-centered h2 { font-size: 1.8rem !important; font-weight: 800 !important; line-height: 1.2 !important; margin-bottom: 10px !important; }
            .preview-text-centered p { font-size: 0.95rem !important; padding: 0 10px !important; }
            .preview-container { display: flex; flex-direction: column; align-items: center; overflow: hidden; width: 100%; }
            .frame-1 { transform: scale(0.85) !important; transform-origin: top center !important; margin-bottom: -100px !important; }
            .map-wrapper { margin: 0 15px 30px 15px !important; padding: 40px 15px !important; min-height: 300px !important; border-radius: 20px !important; }
            .map-title { font-size: 1.5rem !important; top: 15px !important; }
            .node { width: 5px !important; height: 5px !important; }
            .node span { font-size: 0.65rem !important; font-weight: 600 !important; }
            .footer { flex-direction: column !important; padding: 25px 20px !important; gap: 15px !important; text-align: center !important; }

            /* NATIVE HERO MINIATURIZATION (NO TRANSFORM SCALE!) */
            .hero {
                background-size: 100% auto !important;
                background-position: center top !important;
                height: 55vw !important; /* Perfect landscape ratio */
                min-height: unset !important;
                margin-top: 50px !important;
                border-radius: 15px !important;
            }
            .popout-layer {
                background-size: 100% auto !important;
                background-position: center top !important;
            }
            .glass-panel {
                width: 90% !important;
                padding: 15px !important;
            }
            /* Natively scale down the texts instead of the whole div! */
            .glass-panel h1 {
                font-size: 1.1rem !important;
                line-height: 1.1 !important;
                margin-bottom: 5px !important;
            }
            .glass-panel p {
                font-size: 0.6rem !important;
                line-height: 1.2 !important;
                margin-bottom: 5px !important;
            }
            .btn-group {
                gap: 5px !important;
                margin-top: 15px !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
            }
            .btn-glossy {
                padding: 4px 8px !important;
                font-size: 0.5rem !important;
            }
            .part-top-left .btn-glossy[download] {
                display: none !important;
            }
        }
        
        @media (max-width: 400px) {
            .preview-text-centered h2 { font-size: 1.6rem !important; }
            .frame-1 { transform: scale(0.75) !important; margin-bottom: -160px !important; }
        }
    </style>
    `;

    // Inject the master CSS right before </head>
    if (html.includes('</head>')) {
        html = html.replace('</head>', `\n${masterCSS}\n</head>`);
    }

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Ultimate Native Fix + PWA applied!");
    ssh.dispose();
}
extremeMasterFix().catch(console.error);
