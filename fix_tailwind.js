const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Fixing Tailwind installation...");
    // Force install tailwindcss globally so npx works
    await ssh.execCommand("npm install -g tailwindcss");
    
    console.log("Re-compiling CSS...");
    const res = await ssh.execCommand("cd /var/www/jmj_app && npx tailwindcss -i ./input.css -o ./public/assets/tailwind-compiled.css --minify");
    console.log("Compile result:", res.stdout, res.stderr);

    // Verify it was created
    const check = await ssh.execCommand("ls -la /var/www/jmj_app/public/assets/tailwind-compiled.css");
    console.log("File check:", check.stdout);

    ssh.dispose();
}
fix().catch(console.error);
