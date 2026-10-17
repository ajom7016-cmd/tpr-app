const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function injectAnimation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // 1. Inject the event listener for the iframe load
    const eventListenerCode = `
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const frame = document.getElementById('app-frame');
        if (frame) {
            frame.style.transition = 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
            frame.style.opacity = '0';
            frame.style.transform = 'translateY(15px)';
            frame.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'translateY(0px)';
            });
        }
    });
    </script>
    <!-- Background overlay -->`;
    
    // I'll put it right after the body tag or before the bottom nav.
    // Let's replace `<!-- Background overlay -->` to safely inject it.
    code = code.replace("<!-- Background overlay -->", eventListenerCode);
    
    // 2. Rewrite loadPage to include the fade out
    const oldLoadPageStart = `function loadPage(url, btnElement) {
        // Save current page to localStorage so it persists on refresh
        localStorage.setItem('last_visited_page', url);
        
        // Change iframe source with cache buster
        const timestamp = '1.0.10'; // Fixed version string instead of dynamic to enable super-fast caching
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = url + separator + 'v=' + timestamp;
        document.getElementById('app-frame').src = finalUrl;`;
        
    const newLoadPageStart = `function loadPage(url, btnElement) {
        localStorage.setItem('last_visited_page', url);
        
        const timestamp = '1.0.11';
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = url + separator + 'v=' + timestamp;
        
        const frame = document.getElementById('app-frame');
        
        // Premium Slide & Fade Animation
        frame.style.transition = 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)';
        frame.style.opacity = '0';
        frame.style.transform = 'translateY(15px)';
        
        // Change src after fade out begins
        setTimeout(() => {
            frame.src = finalUrl;
        }, 150);`;
        
    code = code.replace(oldLoadPageStart, newLoadPageStart);
    
    // 3. Update the SW cache version
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v13');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Animation injected!");
    ssh.dispose();
}
injectAnimation().catch(console.error);
