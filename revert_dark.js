const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function revert() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Fetching current index.html to revert to Dark Theme...");
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // First, if there's any weird unicode BOM or garbage at the start, remove it
    html = html.replace(/^[^<]*/, ''); 
    if (!html.startsWith('<!DOCTYPE html>')) {
        html = '<!DOCTYPE html>\n' + html.substring(html.indexOf('<html'));
    }

    // Now reverse the replacements made by make_light.js
    
    // 1. Body & Main Wrapper
    html = html.replace('background-color: #f1f5f9; /* Light outer background */', 'background-color: #2a2d34; /* Dark outer background matching the mockup */');
    // We need to be careful with `color: #1e293b;` because we replaced `color: #ffffff;` globally.
    // Let's replace the specific ones.
    html = html.replace('body { font-family: \'Outfit\', sans-serif; background-color: #f1f5f9; /* Light outer background */ color: #1e293b;', 'body { font-family: \'Outfit\', sans-serif; background-color: #2a2d34; /* Dark outer background matching the mockup */ color: #ffffff;');
    html = html.replace('.main-wrapper { width: 100%; max-width: 1400px; background-color: #ffffff;', '.main-wrapper { width: 100%; max-width: 1400px; background-color: #1e2126;');
    html = html.replace('box-shadow: 0 20px 60px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);', 'box-shadow: 0 0 50px rgba(0,0,0,0.5);');

    // 2. Mockup Wrapper (The Phone outline)
    html = html.replace('border: 8px solid #ffffff;', 'border: 6px solid #2a2d34;');
    html = html.replace('box-shadow: 0 30px 60px rgba(0,0,0,0.15),', 'box-shadow: 0 30px 60px rgba(0,0,0,0.6),');
    html = html.replace('inset 0 0 0 1px rgba(0,0,0,0.05);', 'inset 0 0 0 2px rgba(255,255,255,0.1);');

    // 3. Navbar
    html = html.replace('.navbar { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 30px 60px; z-index: 50; color: #1e293b; }', '.navbar { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 30px 60px; z-index: 50; }'); // Remove color injection if any, or restore 'color: white;'
    // Navbar links color:
    html = html.replace('color: #1e293b; text-decoration: none;', 'color: white; text-decoration: none;');

    // 4. Hero text
    html = html.replace('background: rgba(255, 255, 255, 0.7);', 'background: rgba(25, 27, 33, 0.6);');
    html = html.replace('background: rgba(255, 255, 255, 0.25) !important;', 'background: rgba(25, 27, 33, 0.6);');
    html = html.replace('border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 20px 40px rgba(0,0,0,0.05);', 'border: 1px solid rgba(255, 255, 255, 0.1);');
    
    // Reverse glass panel text
    html = html.replace(/<h2 style="font-size: 3\.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #1e293b; line-height: 1\.1;">Explore/g, '<h2 style="font-size: 3.5rem; margin-bottom: 15px; font-weight: 900; letter-spacing: -1px; color: #ffffff; line-height: 1.1;">Explore');
    html = html.replace(/color: #1e293b/g, 'color: #fff');
    html = html.replace(/color: #475569/g, 'color: #e2e8f0');

    // 5. Stat items
    html = html.replace('background: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.8);', 'background: rgba(255,255,255,0.05);');

    // 6. Section Titles
    html = html.replace(/color: #64748b/g, 'color: #a0aec0');

    // 7. Footer
    html = html.replace('background: #f8fafc; border-top: 1px solid #e2e8f0;', 'background: #1a1c23;');
    
    // Clean up any remaining !important overrides from force_light_theme or fix_glass
    html = html.replace(/backdrop-filter: blur\(24px\) saturate\(150%\) !important;/g, '');
    html = html.replace(/-webkit-backdrop-filter: blur\(24px\) saturate\(150%\) !important;/g, '');
    html = html.replace(/border: 1px solid rgba\(255, 255, 255, 0.5\) !important;/g, '');
    html = html.replace(/color: #ffffff !important; text-shadow: 0 2px 10px rgba\(0,0,0,0.3\) !important;/g, '');
    html = html.replace(/color: #f1f5f9 !important; text-shadow: 0 1px 5px rgba\(0,0,0,0.3\) !important;/g, '');
    
    // REMOVE the light-theme-overrides block completely!
    html = html.replace(/<!-- FORCE LIGHT THEME OVERRIDES -->[\s\S]*?<\/style>/, '');

    // Ensure the preloader remains white, since that's what we want.
    // The preloader is mostly hardcoded inline, so it shouldn't be affected as long as we didn't wipe it out.

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Reverted to Original Dark Theme!");
    ssh.dispose();
}
revert().catch(console.error);
