const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixVipServer() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read the current live file
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let content = r.stdout;
    
    // 1. Remove the literal '\\n' that is causing the text to render on screen
    content = content.replace(/\\n/g, ''); 
    // Wait, the alert contains '...!\nYou now have...' which IS a literal \n in the JS code!
    // I only want to remove the literal '\\n' that is right before <style id="true-bg">
    content = content.replace('</style>\\n<style id="true-bg">', '</style>\n<style id="true-bg">');
    
    // Actually, let's just find `\\n` in the head and remove it.
    let headEnd = content.indexOf('</head>');
    let head = content.substring(0, headEnd);
    let body = content.substring(headEnd);
    head = head.replace(/\\n/g, '\n');
    content = head + body;
    
    // 2. Remove the bg-3d block safely
    // The block is:
    // <!-- Premium Animated Background Light -->
    // <div class="bg-3d">
    //     <div class="orb-1"></div>
    //     <div class="orb-2"></div>
    //     <div class="bg-block-1"></div>
    //     <div class="bg-block-2"></div>
    // </div>
    let startStr = '<!-- Premium Animated Background Light -->';
    let endStr = '<div class="bg-block-2"></div>\n    </div>';
    
    let startIndex = content.indexOf(startStr);
    let endIndex = content.indexOf('</div>', content.indexOf('<div class="bg-block-2"></div>')) + 6;
    
    if (startIndex !== -1 && endIndex !== -1) {
        content = content.substring(0, startIndex) + content.substring(endIndex);
    }
    
    // Upload it back
    let b64 = Buffer.from(content).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip.html`);
    
    // Cache bust
    await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = '[^']+';/, \\"const currentVersion = 'v\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    console.log("VIP fixed and uploaded!");
    ssh.dispose();
}
fixVipServer().catch(console.error);
