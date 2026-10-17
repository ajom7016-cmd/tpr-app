const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Revert index.html (Landing page) iframe
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Remove the demo-loader CSS
    html = html.replace(/\.demo-loader[\s\S]*?@keyframes spin \{ 100% \{ transform: rotate\(360deg\); \} \}/g, "");
    
    // Replace the demo-loader HTML with just the plain iframe
    const loaderHtmlRegex = /<div id="demo-loader" class="demo-loader">[\s\S]*?<\/div>\s*<iframe src='\/app\.html' onload="document\.getElementById\('demo-loader'\)\.style\.opacity='0'; setTimeout\(\(\)=>document\.getElementById\('demo-loader'\)\.style\.display='none', 500\);"><\/iframe>/g;
    html = html.replace(loaderHtmlRegex, "<iframe src='/app.html'></iframe>");
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    // 2. Remove the smoothLoad animation from app.html
    res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let appHtml = res.stdout;
    
    // Remove 'animation: smoothLoad' and 'opacity: 0' from body
    appHtml = appHtml.replace(/animation:\s*smoothLoad\s*0\.4s\s*ease-out\s*forwards;/g, "");
    appHtml = appHtml.replace(/body\s*\{[\s\S]*?opacity:\s*0;/g, (match) => match.replace("opacity: 0;", "opacity: 1; background: #e2e8f0;"));
    appHtml = appHtml.replace(/opacity:\s*0;\s*\/\*\s*wait\s*for\s*animation\s*\*\//g, "opacity: 1;");
    
    // Also remove the @keyframes smoothLoad
    appHtml = appHtml.replace(/@keyframes\s*smoothLoad\s*\{\s*0%\s*\{\s*opacity:\s*0;\s*\}\s*100%\s*\{\s*opacity:\s*1;\s*\}\s*\}/g, "");
    
    let base64AppHtml = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${base64AppHtml}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Fixed EVERYTHING! Loader removed, app.html fade-in removed.");
    ssh.dispose();
}
fix().catch(console.error);
