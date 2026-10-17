const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function lockSafariButton() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Add the user-agent check to the Open in Safari button
    // The regex matches /iPhone|iPad|iPod|Mac/i
    const lockScript = `onclick="if(!/iPhone|iPad|iPod|Mac/i.test(navigator.userAgent)) { alert('This option is only available for iPhone and Apple devices.'); return false; }"`;
    
    // Replace the opening <a> tag for the Safari button
    html = html.replace(/<a href="\/app\.html"/g, `<a href="/app.html" ${lockScript}`);

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Safari button locked to Apple devices only!");
    ssh.dispose();
}
lockSafariButton().catch(console.error);
