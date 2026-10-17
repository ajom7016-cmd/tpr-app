const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function preloadImages() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const preloads = `
    <link rel="preload" as="image" href="/clean_bg_optimized.jpg">
    <link rel="preload" as="image" href="/cutout_hd_optimized.png">
    <link rel="preload" as="image" href="/assets/bg_main_optimized.jpg">
    `;

    // update index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    if (!html.includes('rel="preload" as="image"')) {
        html = html.replace('</head>', preloads + '</head>');
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    }

    // update app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    if (!appHtml.includes('rel="preload" as="image"')) {
        appHtml = appHtml.replace('</head>', '<link rel="preload" as="image" href="/assets/bg_main_optimized.jpg"></head>');
        let b64App = Buffer.from(appHtml).toString('base64');
        await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    }

    console.log("Preload tags injected successfully!");
    ssh.dispose();
}
preloadImages().catch(console.error);
