const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixColors() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Check if there are light mode overrides and remove them!
    if(html.includes('.app-preview-section { background-color: #ffffff !important; }')) {
        console.log("Found light mode overrides! Removing them...");
        html = html.replace('.app-preview-section { background-color: #ffffff !important; }', '.app-preview-section { background-color: transparent !important; }');
        html = html.replace('.app-preview-section h2 { color: #1e293b !important; }', '.app-preview-section h2 { color: #ffffff !important; }');
        html = html.replace('.app-preview-section p { color: #475569 !important; }', '.app-preview-section p { color: #9ca3af !important; }');
        html = html.replace('.map-wrapper { background-color: #ffffff !important; box-shadow: 0 10px 40px rgba(0,0,0,0.05) !important; border: 1px solid rgba(0,0,0,0.05) !important; }', '.map-wrapper { background-color: transparent !important; border: none !important; }');
    }
    
    // Fix body background to be explicitly dark
    html = html.replace('background-color: transparent !important; /* Dark outer background matching the mockup */', 'background-color: #111827 !important; /* Dark outer background */');
    html = html.replace('.main-wrapper {\n            width: 100%;\n            max-width: 1400px;\n            background-color: transparent !important;', '.main-wrapper {\n            width: 100%;\n            max-width: 1400px;\n            background-color: #111827 !important;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Colors fixed to dark theme!");
    ssh.dispose();
}
fixColors().catch(console.error);
