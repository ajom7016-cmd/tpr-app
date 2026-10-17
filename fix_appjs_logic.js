const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAppJsDemoLogic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/js/app.js');
    let js = res.stdout;
    
    // Replace the deeply flawed demo detection logic
    // From: window.isLandingDemo = (() => { try { return window.top.location.pathname !== '/app.html'; } catch(e) { return true; } })();
    // To: window.isLandingDemo = (() => { try { return window.top.location.pathname === '/' || window.top.location.pathname === '/index.html'; } catch(e) { return false; } })();
    
    js = js.replace(/window\.isLandingDemo = \(\(\) => \{ try \{ return window\.top\.location\.pathname !== '\/app\.html'; \} catch\(e\) \{ return true; \} \}\)\(\);/g, 
                    "window.isLandingDemo = (() => { try { return window.top.location.pathname === '/' || window.top.location.pathname === '/index.html'; } catch(e) { return false; } })();");
                    
    let b64 = Buffer.from(js).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/js/app.js`);
    console.log("Global demo logic fixed in app.js!");
    ssh.dispose();
}
fixAppJsDemoLogic().catch(console.error);
