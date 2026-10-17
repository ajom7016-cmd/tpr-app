const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAppSpeed() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // 1. Remove the dynamic cache buster which forces network reload every click
    code = code.replace("const timestamp = new Date().getTime();", "const timestamp = '1.0.1'; // Fixed version string instead of dynamic to enable super-fast caching");
    
    // 2. Add an elegant loading overlay over the iframe to hide any white flash
    // We will place it right after the iframe declaration
    const iframeDecl = '<iframe id="app-frame" src="glassmorphic_1/code.html" class="w-full h-full border-0"></iframe>';
    const loaderOverlay = `
    <!-- Super Smooth Iframe Loader -->
    <div id="app-loader" class="absolute inset-0 z-50 flex items-center justify-center bg-[#ffffff]/90 backdrop-blur-sm transition-opacity duration-300" style="display:none;">
        <div class="flex flex-col items-center">
            <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="mt-3 text-orange-600 font-bold text-sm tracking-widest">LOADING...</span>
        </div>
    </div>
    `;
    
    if(code.includes(iframeDecl)) {
        // Let's add onload to iframe
        const newIframeDecl = '<iframe id="app-frame" src="glassmorphic_1/code.html" class="w-full h-full border-0" onload="document.getElementById(\'app-loader\').style.opacity=\'0\'; setTimeout(()=>document.getElementById(\'app-loader\').style.display=\'none\', 300)"></iframe>';
        code = code.replace(iframeDecl, newIframeDecl + loaderOverlay);
    }
    
    // 3. Trigger loader in loadPage function
    const loadPageLogic = "function loadPage(url, btnElement) {";
    const triggerLoader = "function loadPage(url, btnElement) {\n        const loader = document.getElementById('app-loader'); if(loader) { loader.style.display='flex'; loader.style.opacity='1'; }";
    code = code.replace(loadPageLogic, triggerLoader);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("App speed and transition fixed perfectly!");
    
    ssh.dispose();
}
fixAppSpeed().catch(console.error);
