const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function perfectFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // We start from the clean UTF-8 dark theme file we saved locally
    let html = fs.readFileSync('index_fixed.html', 'utf8');

    // Make sure we have the clean dark theme base
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
    
    // Clean any old overrides injected by mistake
    html = html.replace(/<!-- FORCE WHITE THEME FOR BOTTOM SECTIONS -->[\s\S]*?<\/style>/, '');
    html = html.replace(/<!-- FORCE LIGHT THEME OVERRIDES -->[\s\S]*?<\/style>/, '');
    
    // Now, carefully apply the White Theme ONLY to the middle section and Map section.
    // 1. App Preview Section
    html = html.replace(
        '.app-preview-section { padding: 100px 20px; background: #111;',
        '.app-preview-section { padding: 100px 20px; background: #ffffff;'
    );
    html = html.replace(
        '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #ffffff; line-height: 1.1;">Explore',
        '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #1e293b; line-height: 1.1;">Explore'
    );
    html = html.replace(
        '<p style="font-size: 1.25rem; color: #9ca3af; font-weight: 500;">Tap, scroll, and experience',
        '<p style="font-size: 1.25rem; color: #475569; font-weight: 500;">Tap, scroll, and experience'
    );
    html = html.replace(
        'box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.2);',
        'box-shadow: 0 40px 80px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.05);'
    );
    
    // 2. Map Section
    // Let's find the map section. It is a div with padding 100px 20px and style="position: relative..."
    // Wait, the map section in index_fixed.html doesn't have a specific class. 
    // It's just a div containing .map-title
    // Let's wrap the map modifications in a specific CSS block that targets the container precisely or just make it White directly.
    html = html.replace(
        '<div style="padding: 100px 20px; position: relative;">',
        '<div style="padding: 100px 20px; position: relative; background: #ffffff;">'
    );
    
    // Map SVG: The map is a pseudo-element or an absolute div?
    // In index_fixed.html, it's:
    // <div class="global-section" style="position: relative; width: 100%; height: 500px; background: url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg') center/80% no-repeat; opacity: 0.2; filter: invert(1);"></div>
    // Let's remove filter: invert(1) and increase opacity slightly so it's a dark map on white background!
    html = html.replace(
        'filter: invert(1);',
        'filter: invert(0); opacity: 0.1;'
    );
    
    // The Map Title
    html = html.replace(
        '<div class="map-title">Running in 7 Countries</div>',
        '<div class="map-title" style="color: #ea580c; background: linear-gradient(to bottom, #f97316, #c2410c); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Running in 7 Countries</div>'
    );
    
    // The Map Nodes (Yellow dots -> Orange dots)
    html = html.replace(
        'background-color: #fcd34d; border-radius: 50%; box-shadow: 0 0 12px 2px rgba(252, 211, 77, 0.8), 0 0 20px 5px rgba(252, 211, 77, 0.4);',
        'background-color: #f97316; border-radius: 50%; box-shadow: 0 0 12px 2px rgba(249, 115, 22, 0.6), 0 0 20px 5px rgba(249, 115, 22, 0.3);'
    );
    // Node text (Country names)
    html = html.replace(
        'color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500;',
        'color: #475569; font-size: 15px; font-weight: 700;'
    );
    
    // 3. Keep Mobile CSS intact!
    const mobileCSS = `
        /* Mobile Compact Responsiveness */
        @media (max-width: 768px) {
            .navbar { padding: 15px 20px; flex-direction: column; gap: 15px; }
            .navbar > div { gap: 15px !important; flex-wrap: wrap; justify-content: center; }
            .hero { margin: 0; border-radius: 0; height: auto; min-height: 80vh; padding: 100px 15px 40px 15px; }
            .glass-panel { position: relative; top: 0; left: 0; transform: none; margin: 0; width: 100%; max-width: 100%; display: flex; flex-direction: column; }
            .part-top-left { padding: 30px 20px !important; }
            .part-bottom-left { padding: 15px 20px 30px 20px !important; }
            .glass-panel h1 { font-size: 2rem !important; line-height: 1.2 !important; }
            .glass-panel p { font-size: 1rem !important; }
            .btn-group { display: flex; flex-direction: column; gap: 10px; width: 100%; }
            .btn-glossy { width: 100%; justify-content: center; font-size: 1rem; padding: 14px 20px; }
            .app-preview-section { padding: 50px 15px !important; margin-top: 0 !important; }
            .preview-text-centered h2 { font-size: 2.2rem !important; line-height: 1.2 !important; }
            .preview-text-centered p { font-size: 1rem !important; }
            .frame-1 { transform: scale(0.9); transform-origin: top center; margin-bottom: -60px; }
            .map-title { font-size: 1.8rem; top: 15px; }
            .footer { flex-direction: column; padding: 30px 20px; gap: 20px; text-align: center; }
        }
        @media (max-width: 380px) {
            .frame-1 { transform: scale(0.85); margin-bottom: -100px; }
        }
    `;
    html = html.replace(/\/\* Mobile Compact Responsiveness \*\/[\s\S]*?@media \(max-width: 380px\) \{[\s\S]*?\}\s*\}/, '');
    if (html.includes('</style>')) {
        html = html.replace('</style>', `${mobileCSS}\n</style>`);
    }

    const b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Perfect Mixed Theme applied safely!");
    ssh.dispose();
}
perfectFix().catch(console.error);
