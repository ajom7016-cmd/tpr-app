const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTheBug() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // First, let's restore Tailwind CDN
    html = html.replace('<!-- <script src="https://cdn.tailwindcss.com"></script> -->', '<script src="https://cdn.tailwindcss.com"></script>');
    
    // Now, we need to extract the @media query from wherever it is, and put it in the main <style> block.
    // Wait, the main <style> block is currently in <body> because of move_style.js.
    // Let's restore the main <style> block to <head> as well.
    // Actually, let's just get the entire file and write a clean script to fix it.
    console.log(html);
    ssh.dispose();
}
fixTheBug().catch(console.error);
