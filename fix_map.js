const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Fix the world-map CSS
    html = html.replace(/\.world-map\s*\{[\s\S]*?background:\s*url\('https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/8\/80\/World_map_-_low_resolution\.svg'\)\s*center\/80%\s*no-repeat;[\s\S]*?\}/g, 
    `.world-map {
        position: absolute;
        inset: 0;
        background: url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg') center/80% no-repeat;
        opacity: 0.08;
        filter: invert(1);
    }`);
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Map restored!");
    ssh.dispose();
}
fix().catch(console.error);
