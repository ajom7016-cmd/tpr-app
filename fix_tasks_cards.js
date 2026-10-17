const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTasksCards() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // 1. Fix Logos and sizes
    const oldConfigStart = "const tasksConfig = [";
    const oldConfigEnd = "];";
    
    const newConfig = `const tasksConfig = [
        { id: 1, key: 'youtube', title: 'YouTube Video', iconPath: '<img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" style="width:44px; height:44px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' },
        { id: 2, key: 'facebook', title: 'Facebook Page', iconPath: '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" style="width:44px; height:44px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' },
        { id: 3, key: 'telegram', title: 'Telegram Channel', iconPath: '<img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" style="width:44px; height:44px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' },
        { id: 4, key: 'tiktok', title: 'TikTok Follow', iconPath: '<img src="https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg" style="width:44px; height:44px; object-fit:contain; drop-shadow: 0 4px 6px rgba(0,0,0,0.1);" />' }
    ];`;
    
    if(code.includes(oldConfigStart)) {
        const pre = code.substring(0, code.indexOf(oldConfigStart));
        const post = code.substring(code.indexOf(oldConfigEnd) + 2);
        code = pre + newConfig + post;
    }
    
    // Ensure the container is perfectly sizing them
    code = code.replace('<div class="flex items-center justify-center" style="width:50px; height:50px;">', '<div class="flex items-center justify-center" style="width:44px; height:44px;">');
    
    // 2. Fix the Card Shape and Slimness
    const oldCardHTML = '<div class="relative bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-between" style="border-radius: 20px;">';
    const newCardHTML = '<div class="relative bg-white/5 border border-white/10 rounded-[32px] p-3 mb-3 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-between">';
    
    code = code.replace(oldCardHTML, newCardHTML);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    console.log("Tasks cards slimmed, rounded, logos fixed and resized to 44px!");
    
    ssh.dispose();
}
fixTasksCards().catch(console.error);
