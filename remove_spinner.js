const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function removeSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // 1. Remove the spinner HTML overlay
    const spinnerHTML = `
    <!-- Super Smooth Iframe Loader -->
    <div id="app-loader" class="absolute inset-0 z-50 flex items-center justify-center bg-[#ffffff]/90 backdrop-blur-sm transition-opacity duration-300" style="display:none;">
        <div class="flex flex-col items-center">
            <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="mt-3 text-orange-600 font-bold text-sm tracking-widest">LOADING...</span>
        </div>
    </div>
    `;
    code = code.replace(spinnerHTML, '');
    
    // 2. Remove the onload event from iframe
    const iframeWithOnload = '<iframe id="app-frame" src="glassmorphic_1/code.html" class="w-full h-full border-0" onload="document.getElementById(\'app-loader\').style.opacity=\'0\'; setTimeout(()=>document.getElementById(\'app-loader\').style.display=\'none\', 300)"></iframe>';
    const cleanIframe = '<iframe id="app-frame" src="glassmorphic_1/code.html" class="w-full h-full border-0"></iframe>';
    code = code.replace(iframeWithOnload, cleanIframe);
    
    // 3. Remove the trigger logic from loadPage
    const loaderTrigger = "function loadPage(url, btnElement) {\n        const loader = document.getElementById('app-loader'); if(loader) { loader.style.display='flex'; loader.style.opacity='1'; }";
    const cleanLogic = "function loadPage(url, btnElement) {";
    code = code.replace(loaderTrigger, cleanLogic);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Spinner completely removed!");
    
    ssh.dispose();
}
removeSpinner().catch(console.error);
