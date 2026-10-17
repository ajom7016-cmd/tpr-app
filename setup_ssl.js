const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function setup() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Removing iptables rule...");
    await ssh.execCommand('iptables -t nat -D PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000');
    // Also save iptables so it doesn't come back on reboot
    await ssh.execCommand('netfilter-persistent save');
    
    console.log("Installing Caddy...");
    await ssh.execCommand('apt install -y debian-keyring debian-archive-keyring apt-transport-https curl');
    await ssh.execCommand("curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg");
    await ssh.execCommand("curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list");
    await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt update');
    await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt install -y caddy');
    
    console.log("Configuring Caddyfile...");
    const caddyfile = `
thepetroyal.com, www.thepetroyal.com {
    reverse_proxy localhost:3000
}

http://104.247.110.22 {
    reverse_proxy localhost:3000
}
    `;
    let base64Caddy = Buffer.from(caddyfile).toString('base64');
    await ssh.execCommand(`echo "${base64Caddy}" | base64 -d > /etc/caddy/Caddyfile`);
    
    console.log("Restarting Caddy to provision SSL...");
    await ssh.execCommand('systemctl restart caddy');
    
    console.log("Updating capacitor config to use new domain...");
    // Update local Capacitor config
    const fs = require('fs');
    const capPath = 'C:\\Users\\ajom7\\Downloads\\TPR\\TPR_Android_v6\\capacitor.config.json';
    let capConfig = JSON.parse(fs.readFileSync(capPath, 'utf8'));
    capConfig.server = {
        url: 'https://thepetroyal.com/app.html',
        cleartext: true
    };
    fs.writeFileSync(capPath, JSON.stringify(capConfig, null, 2));
    
    console.log("Done!");
    ssh.dispose();
}
setup().catch(console.error);
