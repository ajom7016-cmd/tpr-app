const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTheRealBug() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // The bug: the entire mobile CSS and preloader script is inside <div id="tpr-global-preloader">.
    // When the script calls p.remove(), it deletes the mobile CSS!
    
    // Find the preloader text div closing
    const textDivClose = `<p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">TPR Experience</p>\n    </div>`;
    
    // Find the end of the preloader script
    const scriptEnd = `})();\n    </script>\n</div>`;
    
    if (html.includes(textDivClose) && html.includes(scriptEnd)) {
        // 1. Add </div> right before the <style> tag to close the preloader div early
        html = html.replace(textDivClose, textDivClose + '\n</div><!-- PRELOADER CLOSED HERE -->');
        
        // 2. Remove the trailing </div> that used to close the preloader
        html = html.replace(scriptEnd, `})();\n    </script>`);
        
        // Let's also restore Tailwind CDN that we removed for testing
        html = html.replace('<!-- <script src="https://cdn.tailwindcss.com"></script> -->', '<script src="https://cdn.tailwindcss.com"></script>');
        
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Bug fixed! Preloader div closed early, Mobile CSS is SAFE!");
    } else {
        console.log("Could not find the exact strings to replace.");
    }
    ssh.dispose();
}
fixTheRealBug().catch(console.error);
