const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Fixing Glass Panel opacity...");
    
    // We will update the light-theme-overrides block
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // Fix the glass panel background
    html = html.replace('background: rgba(255, 255, 255, 0.8) !important;', 'background: rgba(255, 255, 255, 0.25) !important;');
    // Increase blur to make it more frosted
    html = html.replace('backdrop-filter: blur(16px) !important;', 'backdrop-filter: blur(24px) saturate(150%) !important;');
    html = html.replace('-webkit-backdrop-filter: blur(16px) !important;', '-webkit-backdrop-filter: blur(24px) saturate(150%) !important;');
    // Add a stronger white border for the glass edge effect
    html = html.replace('border: 1px solid rgba(255, 255, 255, 0.8) !important;', 'border: 1px solid rgba(255, 255, 255, 0.5) !important;');
    
    // Make sure the text inside the glass panel stands out
    // If the background is a bit dark (dog/cat image), dark text might be hard to read with only 0.25 opacity white.
    // Let's change the text inside the glass panel to white, or keep it dark but give it a text-shadow.
    // Actually, Apple's light frosted glass on top of colorful backgrounds usually uses dark text if the background is bright enough, or white text if the background is dark.
    // Let's use pure white text with a subtle dark shadow for perfect readability on the glass.
    html = html.replace('color: #1e293b !important;', 'color: #ffffff !important; text-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;');
    html = html.replace('color: #475569 !important;', 'color: #f1f5f9 !important; text-shadow: 0 1px 5px rgba(0,0,0,0.3) !important;');

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Glass Panel fixed!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
fix().catch(console.error);
