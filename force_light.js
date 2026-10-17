const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceLight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Remove inline dark backgrounds from html and body
    html = html.replace('<html lang="bn" style="background-color: #111827 !important;">', '<html lang="bn">');
    html = html.replace('<body style="background-color: #111827 !important; color: #ffffff;">', '<body>');
    
    // 2. Change body and main-wrapper CSS in <style>
    html = html.replace(/body \{[\s\S]*?background-color:\s*#111827\s*!important;[\s\S]*?color:\s*#ffffff;/g, "body {\n            font-family: 'Outfit', sans-serif;\n            background-color: #f8fafc !important;\n            color: #1e293b;");
    html = html.replace(/\.main-wrapper \{[\s\S]*?background-color:\s*#111827\s*!important;/g, ".main-wrapper {\n            width: 100%;\n            max-width: 1400px;\n            background-color: transparent !important;");
    
    // 3. App Preview Section background
    html = html.replace('.app-preview-section { padding: 100px 20px; background: #111;', '.app-preview-section { padding: 100px 20px; background: transparent;');
    
    // 4. App Preview Text Colors
    html = html.replace('.preview-text { flex: 1; color: white; }', '.preview-text { flex: 1; color: #1e293b; }');
    // I need to find the specific inline styles or CSS rules for the text under the phone
    // In the media query:
    html = html.replace('.preview-text-centered h2 { font-size: 1.8rem !important; font-weight: 800 !important; line-height: 1.2 !important; margin-bottom: 10px !important; }', '.preview-text-centered h2 { font-size: 1.8rem !important; font-weight: 800 !important; line-height: 1.2 !important; margin-bottom: 10px !important; color: #1e293b !important; }');
    html = html.replace('.preview-text-centered p { font-size: 0.95rem !important; padding: 0 10px !important; }', '.preview-text-centered p { font-size: 0.95rem !important; padding: 0 10px !important; color: #475569 !important; }');
    
    // And for the desktop version of that text:
    html = html.replace(/color:\s*#ffffff;\s*line-height:\s*1\.1;">Explore/g, 'color: #1e293b; line-height: 1.1;">Explore');
    html = html.replace(/color:\s*#9ca3af;\s*font-weight:\s*500;">Tap, scroll/g, 'color: #475569; font-weight: 500;">Tap, scroll');
    
    // Footer color
    html = html.replace(/color:\s*#9ca3af;\s*font-size:\s*0\.9rem;/g, 'color: #475569; font-size: 0.9rem;');
    html = html.replace(/text-white/g, 'text-gray-900'); // navbar hover text
    
    // Let's make sure .glass-panel text is explicitly white because it's on a dark image
    html = html.replace('.glass-panel {', '.glass-panel {\n            color: #ffffff !important;');
    
    // Map node color fix if any
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Restored LIGHT theme!");
    ssh.dispose();
}
forceLight().catch(console.error);
