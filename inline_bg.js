const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // Fix index.html inline background
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let indexHtml = res.stdout;
    if (indexHtml.includes('<body class="bg-[#0b0f19]')) {
        indexHtml = indexHtml.replace('<body class="bg-[#0b0f19]', '<body style="background-color: #0b0f19;" class="bg-[#0b0f19]');
        let b64 = Buffer.from(indexHtml).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Inlined background in index.html");
    }

    // Fix app.html inline background
    res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let appHtml = res.stdout;
    if (appHtml.includes('<body class="bg-[#f1f5f9]')) {
        appHtml = appHtml.replace('<body class="bg-[#f1f5f9]', '<body style="background-color: #f1f5f9; color: transparent; transition: color 0.5s ease-out;" onload="document.body.style.color=\'#334155\'" class="bg-[#f1f5f9]');
        let b64 = Buffer.from(appHtml).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
        console.log("Inlined background in app.html");
    }

    ssh.dispose();
}
fix().catch(console.error);
