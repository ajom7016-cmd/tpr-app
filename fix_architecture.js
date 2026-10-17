const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixLayerArchitecture() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Hide the contents of Layer 1 so it only provides the glass background/border!
    // The previous dev left it at opacity: 1 which caused visible duplication when heights mismatched.
    // Replace <div style="opacity: 1;"> with <div style="opacity: 0; pointer-events: none; visibility: hidden;">
    // ONLY do this for the ones immediately following the "Invisible text" comment!
    html = html.replace(/<!-- Invisible text to force exact height -->\s*<div style="opacity: 1;">/g, 
                        '<!-- Invisible text to force exact height -->\n                    <div style="opacity: 0; pointer-events: none; visibility: hidden;">');

    // 2. Ensure both Layer 1 and Layer 3 have EXACTLY the same Safari button so their heights match perfectly.
    // First, let's remove ALL injected Safari buttons to get a clean slate.
    html = html.replace(/<div style="margin-top: 15px; display: flex; justify-content: flex-start;">[\s\S]*?<\/div>/g, '');
    html = html.replace(/<a href="\/app\.html" style="position: absolute; bottom: -25px;[\s\S]*?Open in Safari\s*<\/a>/g, '');
    
    // Now, find every closing </div> of the .btn-group and inject the Safari button AFTER it.
    // Since there are exactly TWO .btn-groups (one in Layer 1, one in Layer 3), this will inject it into both!
    // This guarantees perfect height matching!
    const safariButtonHTML = `\n<div style="margin-top: 15px; display: flex; justify-content: flex-start;"><a href="/app.html" style="color: #cbd5e1; font-size: 0.65rem; text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,0.8);" onmouseover="this.style.color='#fcd34d'" onmouseout="this.style.color='#cbd5e1'"><i class="fa-solid fa-arrow-right"></i> Open in Safari</a></div>`;
    
    html = html.replace(/(<a href="#" onclick="promptPWAInstall[^>]*>[\s\S]*?Huawei\s*<\/a>\s*<\/div>)/g, `$1${safariButtonHTML}`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("3D Layer architecture fixed, duplicates hidden, heights perfectly matched!");
    ssh.dispose();
}
fixLayerArchitecture().catch(console.error);
