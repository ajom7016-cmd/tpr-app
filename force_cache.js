const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceCacheBust() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // index.html cache bust
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace(/src='\/app\.html\?v=\d+'/g, "src='/app.html?v=" + new Date().getTime() + "'");
    html = html.replace(/src="\/app\.html\?v=\d+"/g, "src='/app.html?v=" + new Date().getTime() + "'");
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // app.html cache bust (glassmorphic_1/code.html)
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    // Just replace 'glassmorphic_1/code.html' in the loadPage call if we can, but loadPage ALREADY ADDS a cache buster dynamically!
    // "const finalUrl = url + separator + 'v=' + timestamp;"
    // So app.html is already cache busting its iframes. 
    // We just need index.html to cache bust app.html!

    console.log("Forced Cache Bust applied to index.html!");
    ssh.dispose();
}
forceCacheBust().catch(console.error);
