const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function optimizeSEO() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const seoTags = `
    <!-- SEO Optimization Tags -->
    <meta name="title" content="TPR App - Premium Earning Platform">
    <meta name="description" content="Download TPR App (The Pet Royal). Complete tasks, upgrade VIP plans, and start earning today. The most trusted digital assets platform.">
    <meta name="keywords" content="tpr app, thepetroyal, tpr, the pet royal app, tpr earning app, download tpr app, tpr app login, tpr app register, thepetroyal app, TPR bd app">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://thepetroyal.com/">
    <meta property="og:title" content="TPR App - Premium Earning Platform">
    <meta property="og:description" content="Download TPR App (The Pet Royal). Complete tasks, upgrade VIP plans, and start earning today.">
    <!-- End SEO Tags -->
    `;
    
    // Inject into landing.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/landing.html');
    let landingHtml = res.stdout;
    if(landingHtml.includes('</head>')) {
        landingHtml = landingHtml.replace('</head>', seoTags + '\n</head>');
        let b64 = Buffer.from(landingHtml).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/landing.html`);
    }
    
    // Inject into login.html
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let loginHtml = res2.stdout;
    if(loginHtml.includes('</head>')) {
        loginHtml = loginHtml.replace('</head>', seoTags + '\n</head>');
        let b64 = Buffer.from(loginHtml).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    }
    
    console.log("SEO Tags injected successfully into Landing and Login pages!");
    ssh.dispose();
}

optimizeSEO().catch(console.error);
