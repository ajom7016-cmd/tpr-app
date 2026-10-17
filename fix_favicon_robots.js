const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixFaviconAndRobots() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Inject Favicon into HTML files
    const faviconTags = `
    <link rel="icon" type="image/png" href="/assets/app-icon-192.png">
    <link rel="apple-touch-icon" href="/assets/app-icon-192.png">
    `;
    
    const files = ['landing.html', 'login.html', 'app.html'];
    for(let file of files) {
        let res = await ssh.execCommand(`cat /var/www/jmj_app/public/${file}`);
        let html = res.stdout;
        if(html.includes('</head>') && !html.includes('rel="icon"')) {
            html = html.replace('</head>', faviconTags + '\n</head>');
            let b64 = Buffer.from(html).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/${file}`);
        }
    }
    
    // 2. Update robots.txt to explicitly hide admin
    const robots = `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /api/
Sitemap: https://thepetroyal.com/sitemap.xml`;
    await ssh.execCommand(`echo "${robots}" > /var/www/jmj_app/public/robots.txt`);
    
    console.log("Favicon injected and robots.txt updated to block admin!");
    ssh.dispose();
}

fixFaviconAndRobots().catch(console.error);
