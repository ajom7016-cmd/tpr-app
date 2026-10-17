const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMapPerfectly() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Fix Map Alignment: The user's original design had the map width 100% and height auto, which cropped it vertically but aligned perfectly with the percentage-based dots!
    html = html.replace(/background:\s*url\('\/world_map\.svg'\)\s*center\/[^\s]+\s*[^\s]+\s*no-repeat;/g, 'background: url(\'/world_map.svg\') center/100% auto no-repeat;');
    // In case the previous regex didn't catch if it was 100% 100%:
    html = html.replace(/background:\s*url\('\/world_map\.svg'\)\s*center\/100%\s*100%\s*no-repeat;/g, 'background: url(\'/world_map.svg\') center/100% auto no-repeat;');

    // Aro chikon dari (Even thinner lines!)
    html = html.replace(/stroke-width:\s*1;/g, 'stroke-width: 0.3;');
    
    // And for the dash-draw animation, let's make sure it's smooth
    // The previous stroke-dasharray was 100, which is good for a solid drawing line.
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Map alignment perfectly matched to original cropping, lines made super thin!");
    ssh.dispose();
}
fixMapPerfectly().catch(console.error);
