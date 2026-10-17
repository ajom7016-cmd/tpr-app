const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    let res = await ssh.execCommand("cat /var/www/jmj_app/public/js/app.js");
    let js = res.stdout;
    
    // In loadPage, we do: fetch(pageUrl)
    // We want to change it to: fetch(pageUrl + "?v=" + new Date().getTime())
    // to bust the cache of the individual code.html files!
    let original = js;
    js = js.replace(/fetch\(pageUrl\)/g, "fetch(pageUrl + '?v=' + new Date().getTime())");
    
    if (js !== original) {
        let b64 = Buffer.from(js).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
        console.log("Cache busted loadPage!");
    } else {
        console.log("No fetch(pageUrl) found or already replaced.");
    }
    
    ssh.dispose();
}
fix().catch(console.error);
