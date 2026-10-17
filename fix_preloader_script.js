const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    async function replacePreloader(filepath) {
        let res = await ssh.execCommand(`cat ${filepath}`);
        let html = res.stdout;
        
        // Let's just remove the entire <script> inside the preloader that is causing the problem!
        // The old one has:
        // window.addEventListener('load', () => { setTimeout(() => { const p = document.getElementById('tpr-global-preloader'); if(p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 400); } }, 500); });
        
        // We will just replace it with the new one using string replacement
        const oldScript = `window.addEventListener('load', () => {
            setTimeout(() => {
                const p = document.getElementById('tpr-global-preloader');
                if(p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 400); }
            }, 500); // Give tailwind an extra 500ms to apply
        });`;
        
        const oldScriptAlternative = "window.addEventListener('load', () => {\n            setTimeout(() => {\n                const p = document.getElementById('tpr-global-preloader');\n                if(p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 400); }\n            }, 500); // Give tailwind an extra 500ms to apply\n        });";
        
        const newScript = `(function() {
            let done = false;
            function hidePreloader() {
                if(done) return;
                done = true;
                const p = document.getElementById('tpr-global-preloader');
                if(p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 400); }
            }
            window.addEventListener('load', () => setTimeout(hidePreloader, 300));
            setTimeout(hidePreloader, 1500);
        })();`;

        // We will do a robust regex to replace the <script>...</script> inside the preloader block
        html = html.replace(/<script>\s*window\.addEventListener\('load', \(\) => \{\s*setTimeout\(\(\) => \{\s*const p = document\.getElementById\('tpr-global-preloader'\);[\s\S]*?<\/script>/g, `<script>${newScript}</script>`);

        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > ${filepath}`);
        console.log(`Fixed script in ${filepath}`);
    }

    await replacePreloader('/var/www/jmj_app/public/app.html');
    await replacePreloader('/var/www/jmj_app/public/index.html');

    console.log("Preloaders fixed!");
    ssh.dispose();
}
fix().catch(console.error);
