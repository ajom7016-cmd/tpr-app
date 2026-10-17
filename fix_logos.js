const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixLogos() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // Replace the tasksConfig block
    const oldConfigStart = "const tasksConfig = [";
    const oldConfigEnd = "];";
    
    const newConfig = `const tasksConfig = [
        { id: 1, key: 'youtube', title: 'YouTube Video', iconPath: '<img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" style="width:48px; height:48px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' },
        { id: 2, key: 'facebook', title: 'Facebook Page', iconPath: '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" style="width:48px; height:48px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' },
        { id: 3, key: 'telegram', title: 'Telegram Channel', iconPath: '<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" style="width:48px; height:48px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' },
        { id: 4, key: 'tiktok', title: 'TikTok Follow', iconPath: '<img src="https://img.icons8.com/fluent/96/000000/tiktok.png" style="width:48px; height:48px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' }
    ];`;
    
    if(code.includes(oldConfigStart)) {
        const pre = code.substring(0, code.indexOf(oldConfigStart));
        const post = code.substring(code.indexOf(oldConfigEnd) + 2);
        code = pre + newConfig + post;
        
        // Ensure the container for the logo isn't restricting it
        code = code.replace('<div class="w-12 h-12 flex items-center justify-center">', '<div class="flex items-center justify-center" style="width:50px; height:50px;">');
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Logos fixed and enlarged!");
    } else {
        console.log("Marker not found!");
    }
    
    ssh.dispose();
}
fixLogos().catch(console.error);
