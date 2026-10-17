const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixBrokenSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // I need to carefully replace the script block!
    const regex = /<script>[\s\S]*?function hidePreloader\(\)[\s\S]*?<\/script>/g;
    const newScript = `<script>
        (function(){
            let done = false;
            function hidePreloader() {
                if(done) return;
                done = true;
                const p = document.getElementById('tpr-global-preloader');
                if(p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 150); }
            }
            setTimeout(hidePreloader, 1000); // Exactly 1s spin!
        })();
    </script>`;
    
    html = html.replace(regex, newScript);
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace(regex, newScript);
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Spinner script fixed!");
    ssh.dispose();
}
fixBrokenSpinner().catch(console.error);
