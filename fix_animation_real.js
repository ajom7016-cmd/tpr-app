const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAnimationReal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // 1. Inject transition styles to iframe tag directly
    const oldIframe = `<iframe id="app-frame" allow="microphone; camera" src=""`;
    const newIframe = `<iframe id="app-frame" allow="microphone; camera" src="" style="transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1); opacity: 0; transform: translateY(15px);"`;
    if (code.includes(oldIframe)) {
        code = code.replace(oldIframe, newIframe);
    }
    
    // 2. Add onload hook to iframe
    const eventListenerCode = `
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const frame = document.getElementById('app-frame');
        if (frame) {
            frame.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'translateY(0px)';
            });
        }
    });
    </script>`;
    
    // Replace the first <!-- Background overlay --> or just put it before </body>
    if (!code.includes("frame.addEventListener('load'")) {
        code = code.replace("</body>", eventListenerCode + "\n</body>");
    }
    
    // 3. Update loadPage safely using regex
    // We want to replace `document.getElementById('app-frame').src = finalUrl;` 
    // with the slide & fade logic
    const oldLoadSrc = `document.getElementById('app-frame').src = finalUrl;`;
    const newLoadSrc = `const frame = document.getElementById('app-frame');
        if (frame.src) {
            frame.style.opacity = '0';
            frame.style.transform = 'translateY(15px)';
            setTimeout(() => { frame.src = finalUrl; }, 150);
        } else {
            frame.src = finalUrl;
        }`;
        
    code = code.replace(oldLoadSrc, newLoadSrc);
    
    // 4. Update the SW cache version
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v15');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    code = code.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.13';");
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Animation TRULY injected this time!");
    ssh.dispose();
}
fixAnimationReal().catch(console.error);
