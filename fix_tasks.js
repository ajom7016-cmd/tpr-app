const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    let html = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\glassmorphic_2\\code.html', 'utf8');

    // Remove bg-3d and orb classes
    html = html.replace(/\.bg-3d\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.orb-1\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.orb-2\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.orb-3\s*\{[\s\S]*?\}/g, '');

    // Remove the HTML <div class="bg-3d"> ... </div>
    html = html.replace(/<div class="bg-3d">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
    html = html.replace(/<div class="bg-3d">[\s\S]*?<\/div>/, '');

    // Remove opacity: 0
    html = html.replace(/opacity:\s*0;/g, '');

    // Make body pure transparent just like Home
    html = html.replace(/body\s*\{[^}]*background-color:[^;]*;/i, 'body { background-color: transparent !important;');
    html = html.replace(/<body[^>]*>/i, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important;">');

    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\tasks_clean.html', html, 'utf8');

    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\tasks_clean.html', '/var/www/jmj_app/public/glassmorphic_2/code.html');
    await ssh.execCommand('chmod 644 /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("Tasks page cleaned and uploaded!");
    ssh.dispose();
}
fix();
