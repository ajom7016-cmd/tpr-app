const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function rewriteMobileCSS() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Extract the part of CSS to replace
    // We want to replace from /* HERO SECTION */ down to the end of the @media (max-width: 768px) block.
    // Let's use a regex that matches from /* HERO SECTION */ up to the closing brace of the media query.
    // Or we can just do individual string replacements to be safe.

    // 1. Hero background and height
    html = html.replace(/background-size:\s*150%\s*auto\s*!important;/g, 'background-size: 100% 100% !important;');
    html = html.replace(/height:\s*80vw\s*!important;/g, 'height: 52vw !important;');
    html = html.replace(/margin-top:\s*50px\s*!important;/g, 'margin: 60px 15px 0 15px !important;');
    
    // 2. Glass panel width
    html = html.replace(/width:\s*70%\s*!important;/g, 'width: 90% !important;');
    
    // 3. Padding inside glass panel
    html = html.replace(/\.part-top-left \{ padding: 12px 12px 0px 12px !important; \}/g, '.part-top-left { padding: 10px 10px 0px 10px !important; }');
    html = html.replace(/\.part-bottom-left \{ padding: 0px 12px 12px 12px !important; \}/g, '.part-bottom-left { padding: 0px 10px 10px 10px !important; }');
    
    // 4. Text sizes in glass panel
    html = html.replace(/font-size:\s*1\.05rem\s*!important;/g, 'font-size: 0.85rem !important;');
    html = html.replace(/margin-bottom:\s*5px\s*!important;/g, 'margin-bottom: 3px !important;');
    html = html.replace(/font-size:\s*0\.55rem\s*!important;/g, 'font-size: 0.45rem !important;');
    
    // 5. Button group
    html = html.replace(/font-size:\s*0\.45rem\s*!important;/g, 'font-size: 0.4rem !important;');
    html = html.replace(/padding:\s*4px\s*6px\s*!important;/g, 'padding: 3px 5px !important;');
    html = html.replace(/top:\s*-15px\s*!important;/g, 'top: -12px !important;');
    
    // 6. Map Wrapper Mobile padding/margin
    html = html.replace(/padding:\s*40px\s*15px\s*!important;\s*min-height:\s*300px\s*!important;\s*border-radius:\s*20px\s*!important;/g, 'padding: 30px 15px !important; min-height: 250px !important; border-radius: 15px !important;');
    
    // 7. Node size mobile
    html = html.replace(/\.node \{ width: 5px !important; height: 5px !important; \}/g, '.node { width: 4px !important; height: 4px !important; box-shadow: 0 0 6px 2px rgba(234,88,12,0.8) !important; }');
    
    // 8. Node span mobile
    html = html.replace(/\.node\s*span\s*\{\s*font-size:\s*0\.85rem[^}]*\}/, '.node span { font-size: 0.5rem !important; font-weight: 700 !important; color: #1e293b !important; position: absolute; top: 6px !important; left: 50%; transform: translateX(-50%); }');
    // Also replace the old node span if it was 0.65rem
    html = html.replace(/\.node\s*span\s*\{\s*font-size:\s*0\.65rem[^}]*\}/, '.node span { font-size: 0.5rem !important; font-weight: 700 !important; color: #1e293b !important; position: absolute; top: 6px !important; left: 50%; transform: translateX(-50%); }');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Mobile CSS fully aligned with user mockup!");
    ssh.dispose();
}
rewriteMobileCSS().catch(console.error);
