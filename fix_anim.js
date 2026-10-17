const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAnimLogic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    html = html.replace(
        "toast.classList.remove('opacity-0', 'translate-y-4');",
        "toast.classList.remove('opacity-0', '-translate-y-4');"
    );
    html = html.replace(
        "toast.classList.add('opacity-0', 'translate-y-4');",
        "toast.classList.add('opacity-0', '-translate-y-4');"
    );
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("Animation JS fixed!");
    ssh.dispose();
}
fixAnimLogic().catch(console.error);
