const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function refineCardHeight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // "aro komao" -> decrease padding further.
    // "ar nice aktu besi" -> maybe leave a little more padding at the bottom compared to the top, OR shift it down.
    // Let's reduce top padding from 40px to 15px.
    html = html.replace(/\.part-top-left\s*\{\s*padding:\s*40px\s*40px\s*0px\s*40px;\s*\}/g, 
                        '.part-top-left { padding: 15px 40px 0px 40px; }');
                        
    // Let's reduce bottom padding from 40px to 25px (a little more than top, as requested).
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*40px\s*40px\s*40px;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 40px 25px 40px; }');
                        
    // Shift it down slightly to center it better with the dog (margin-top from -20px to 0px)
    html = html.replace(/margin-top:\s*-20px;/g, 'margin-top: 5px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card size reduced further and shifted slightly down!");
    ssh.dispose();
}
refineCardHeight().catch(console.error);
