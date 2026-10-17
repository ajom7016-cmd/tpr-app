const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Downloading Tailwind standalone CLI...");
    await ssh.execCommand("curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64");
    await ssh.execCommand("chmod +x tailwindcss-linux-x64");
    await ssh.execCommand("mv tailwindcss-linux-x64 /usr/local/bin/tailwindcss");
    
    console.log("Re-compiling CSS...");
    const res = await ssh.execCommand("cd /var/www/jmj_app && tailwindcss -i ./input.css -o ./public/assets/tailwind-compiled.css --minify");
    console.log("Compile result:", res.stdout, res.stderr);

    const check = await ssh.execCommand("ls -la /var/www/jmj_app/public/assets/tailwind-compiled.css");
    console.log("File check:", check.stdout);

    ssh.dispose();
}
fix().catch(console.error);
