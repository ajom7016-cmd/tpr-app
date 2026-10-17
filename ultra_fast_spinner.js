const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ultraFastSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Change window.load to DOMContentLoaded
    html = html.replace("window.addEventListener('load', hidePreloader);", "document.addEventListener('DOMContentLoaded', hidePreloader); window.addEventListener('load', hidePreloader);");
    
    // Set absolute fallback to 800ms just in case DOMContentLoaded fails or takes long
    html = html.replace('setTimeout(hidePreloader, 800);', ''); // clean up any old
    html = html.replace('// Super fast fallback', ''); 
    html = html.replace('})();\n    </script>', 'setTimeout(hidePreloader, 800);\n        })();\n    </script>');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // Do the same for app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace("window.addEventListener('load', hidePreloader);", "document.addEventListener('DOMContentLoaded', hidePreloader); window.addEventListener('load', hidePreloader);");
    appHtml = appHtml.replace('setTimeout(hidePreloader, 800);', '');
    appHtml = appHtml.replace('// Super fast fallback', '');
    appHtml = appHtml.replace('})();\n    </script>', 'setTimeout(hidePreloader, 800);\n        })();\n    </script>');
    
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Spinner set to DOMContentLoaded + 800ms absolute max!");
    ssh.dispose();
}
ultraFastSpinner().catch(console.error);
