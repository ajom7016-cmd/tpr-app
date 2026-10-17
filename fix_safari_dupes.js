const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixSafariDuplicates() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Remove all old inline "Open in Safari" buttons
    html = html.replace(/<a href="\/app\.html"[^>]*>[\s\S]*?Open in Safari\s*<\/a>/g, '');
    
    // Also remove any of our previously injected blocks to clean up
    html = html.replace(/<div style="margin-top: 15px; display: flex; justify-content: flex-start;">[\s\S]*?Open in Safari\s*<\/a>\s*<\/div>/g, '');
    
    // Now inject it exactly ONCE after the .btn-group
    // The .btn-group ends with the Huawei button.
    html = html.replace(/(<a href="#" onclick="promptPWAInstall[^>]*>[\s\S]*?Huawei\s*<\/a>\s*<\/div>)/, 
        `$1\n<div style="margin-top: 15px; display: flex; justify-content: flex-start;"><a href="/app.html" style="color: #cbd5e1; font-size: 0.65rem; text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,0.8);" onmouseover="this.style.color='#fcd34d'" onmouseout="this.style.color='#cbd5e1'"><i class="fa-solid fa-arrow-right"></i> Open in Safari</a></div>`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Safari button deduplicated and placed perfectly!");
    ssh.dispose();
}
fixSafariDuplicates().catch(console.error);
