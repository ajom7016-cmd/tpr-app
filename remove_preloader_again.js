const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    async function removePreloader(filepath) {
        let res = await ssh.execCommand(`cat ${filepath}`);
        let html = res.stdout;
        let original = html;
        
        while(html.includes('id="tpr-global-preloader"')) {
            const s = html.indexOf('<div id="tpr-global-preloader"');
            const e = html.indexOf('</script>\n</div>', s) + 16;
            if(e > 16) { 
                html = html.substring(0, s) + html.substring(e); 
            } else { 
                break; 
            }
        }

        if (html !== original) {
            let b64 = Buffer.from(html).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > ${filepath}`);
            console.log(`Removed preloader from ${filepath}`);
        } else {
            console.log(`No preloader found in ${filepath}`);
        }
    }

    await removePreloader('/var/www/jmj_app/public/app.html');
    await removePreloader('/var/www/jmj_app/public/index.html');

    console.log("Preloaders completely removed per user request!");
    ssh.dispose();
}
fix().catch(console.error);
