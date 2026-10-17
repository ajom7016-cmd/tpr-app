const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function restoreAppHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let html = res.stdout;
    
    const tailwindConfig = `
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#ea580c',
                        secondary: '#1f2937',
                        accent: '#f97316'
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    `;
    if(!html.includes('tailwind.config = {')) {
        html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<script src="https://cdn.tailwindcss.com"></script>' + tailwindConfig);
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
        console.log("Tailwind config restored to app.html!");
    } else {
        console.log("app.html already has tailwind config.");
    }
    ssh.dispose();
}
restoreAppHtml().catch(console.error);
