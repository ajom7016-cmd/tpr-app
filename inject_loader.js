const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Inject the loader CSS
    const loaderCss = `
    .demo-loader {
        position: absolute; inset: 0; background: #f8fafc; z-index: 20; 
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: opacity 0.5s ease;
    }
    .demo-loader .spinner {
        width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #f97316; 
        border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
    `;
    html = html.replace('</style>', loaderCss);
    
    // Inject the loader HTML and modify iframe onload
    const iframeHtml = `
    <div id="demo-loader" class="demo-loader">
        <div class="spinner"></div>
        <div style="font-weight: 800; color: #f97316; font-size: 1.2rem; letter-spacing: 1px;">TPR App</div>
    </div>
    <iframe src='/app.html' onload="document.getElementById('demo-loader').style.opacity='0'; setTimeout(()=>document.getElementById('demo-loader').style.display='none', 500);"></iframe>
    `;
    
    // We need to replace the exact iframe line:
    // <div class='screen-area'><iframe src='/app.html'></iframe></div>
    // Wait, the iframe might have styling or attributes. Let's just replace `<iframe src='/app.html'></iframe>`
    html = html.replace(/<iframe src='\/app\.html'><\/iframe>/g, iframeHtml);
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Injected cool loader!");
    ssh.dispose();
}
fix().catch(console.error);
