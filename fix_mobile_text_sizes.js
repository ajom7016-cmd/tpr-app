const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMobileTextSizes() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // We need to increase the font sizes and remove text shadow for small text on mobile
    
    // 1. Fix H1s
    // Change font-size: 0.85rem !important; to 1.1rem !important;
    html = html.replace(/font-size:\s*0\.85rem\s*!important;/g, 'font-size: 1.2rem !important;');
    // We keep the small text shadow for h1
    
    // 2. Fix Paragraph
    // Change font-size: 0.4rem !important; to 0.75rem !important;
    html = html.replace(/font-size:\s*0\.4rem\s*!important;/g, 'font-size: 0.75rem !important;');
    // Completely remove text shadow for paragraph
    html = html.replace(/text-shadow:\s*0\s*1px\s*2px\s*rgba\(0,0,0,0\.6\)\s*!important;/g, 
                        'text-shadow: none !important;');
                        
    // 3. Let's check if there are other small text elements like the .btn-glossy font size
    // Earlier I saw .btn-glossy { font-size: 0.4rem !important; } or 0.5rem.
    html = html.replace(/\.btn-glossy\s*\{\s*padding:\s*4px\s*8px\s*!important;\s*font-size:\s*0\.5rem\s*!important;\s*\}/g, 
                        '.btn-glossy { padding: 6px 10px !important; font-size: 0.7rem !important; }');
    html = html.replace(/\.btn-glossy\s*\{\s*padding:\s*3px\s*5px\s*!important;\s*font-size:\s*0\.4rem\s*!important;\s*white-space:\s*nowrap\s*!important;/g, 
                        '.btn-glossy { padding: 6px 10px !important; font-size: 0.7rem !important; white-space: nowrap !important;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Mobile text sizes increased and shadows removed!");
    ssh.dispose();
}
fixMobileTextSizes().catch(console.error);
