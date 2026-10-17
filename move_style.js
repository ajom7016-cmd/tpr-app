const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function moveStyle() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Find the <style> block
    const styleStart = html.indexOf('<style>');
    const styleEnd = html.indexOf('</style>') + '</style>'.length;
    
    if (styleStart !== -1 && styleEnd !== -1) {
        const styleBlock = html.substring(styleStart, styleEnd);
        // Remove it from head
        html = html.substring(0, styleStart) + html.substring(styleEnd);
        
        // Insert it right after <body>
        html = html.replace('<body>', '<body>\n    ' + styleBlock);
        
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Moved <style> into <body> to prevent Tailwind override!");
    } else {
        console.log("Style block not found!");
    }
    ssh.dispose();
}
moveStyle().catch(console.error);
