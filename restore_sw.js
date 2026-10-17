const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function restoreSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    const swScript = `
    <link rel="apple-touch-icon" href="/assets/logo.png">
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW reg failed: ', err));
            });
        }
    </script>
    <link rel="manifest" href="/manifest.json">
`;
    
    if (!html.includes('serviceWorker')) {
        html = html.replace('<meta charset="UTF-8">', swScript + '<meta charset="UTF-8">');
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Restored Service Worker script!");
    } else {
        console.log("Service Worker already exists.");
    }
    ssh.dispose();
}
restoreSW().catch(console.error);
