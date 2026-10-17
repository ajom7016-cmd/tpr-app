const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAppJsHistory() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/js/app.js');
    let code = res.stdout;
    
    // Add getRecentEarnings to window.APP
    const targetString = "logout: function() {";
    const newFunction = `getRecentEarnings: async function() {
        if(!getAuthToken()) return [];
        try {
            const res = await fetch(\`\${API_URL}/recent-earnings?t=\` + new Date().getTime(), {
                headers: { 'Authorization': \`Bearer \${getAuthToken()}\` }
            });
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.error(e);
        }
        return [];
    },
    logout: function() {`;
        
    if(code.includes(targetString)) {
        code = code.replace(targetString, newFunction);
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
        
        // Bump cache for app.js in glassmorphic_1/code.html
        let resG1 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html');
        let g1Code = resG1.stdout;
        g1Code = g1Code.replace('src="/js/app.js?v=4"', 'src="/js/app.js?v=5"');
        await ssh.execCommand(`echo "${Buffer.from(g1Code).toString('base64')}" | base64 -d > /var/www/jmj_app/public/glassmorphic_1/code.html`);
        
        // Bump iframe version in app.html
        let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
        let appCode = resApp.stdout;
        appCode = appCode.replace("const timestamp = '1.0.6';", "const timestamp = '1.0.9';");
        appCode = appCode.replace("const timestamp = '1.0.7';", "const timestamp = '1.0.9';");
        appCode = appCode.replace("const timestamp = '1.0.8';", "const timestamp = '1.0.9';");
        await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
        
        // Bump SW cache
        let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
        let swCode = resSW.stdout;
        swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v11');
        await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
        
        console.log("Added getRecentEarnings to js/app.js and bumped ALL caches!");
    } else {
        console.log("Could not find logout: function() { in app.js");
    }
    
    ssh.dispose();
}
fixAppJsHistory().catch(console.error);
