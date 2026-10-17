const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function removeWhiteBox() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // The exact HTML for the logo container
    const oldContainer = '<div class="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]">';
    const newContainer = '<div class="w-12 h-12 flex items-center justify-center">'; // Remove bg-white, rounded, shadow
    
    code = code.replace(oldContainer, newContainer);
    
    // Also increase the size of the SVGs from 24 to 36 so they fill the space better without the box
    code = code.replaceAll('width="24" height="24"', 'width="36" height="36"');
    // For Facebook we might want to ensure the color is visible (it's #1877f2, so it's fine). Tiktok is black (#000), which might be hard to see on a dark/glass background.
    // Wait, the background is a glassmorphic mesh (white/light). Black tiktok logo is perfectly visible!
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    console.log("White box removed and logos enlarged!");
    
    ssh.dispose();
}
removeWhiteBox().catch(console.error);
