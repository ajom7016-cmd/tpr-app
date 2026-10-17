const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function downloadSVG() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Download SVG
    console.log("Downloading SVG...");
    let res = await ssh.execCommand('curl -s -o /var/www/jmj_app/public/world_map.svg "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"');
    
    // Check size
    res = await ssh.execCommand('ls -lh /var/www/jmj_app/public/world_map.svg');
    console.log(res.stdout);
    
    // Update index.html to use local SVG
    res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg', '/world_map.svg');
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("SVG downloaded and index.html updated!");
    ssh.dispose();
}
downloadSVG().catch(console.error);
