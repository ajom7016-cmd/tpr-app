const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function deploy() {
    try {
        console.log('Connecting to VPS...');
        await ssh.connect({
            host: '104.247.110.22',
            username: 'root',
            password: 'Apple2010@'
        });
        console.log('Connected!');

        console.log('Fixing interrupted dpkg if any...');
        await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; dpkg --configure -a');

        console.log('Updating system (non-interactive)...');
        let res = await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; apt-get update -yq && apt-get -yq -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade');
        console.log(res.stdout || res.stderr);

        console.log('Installing curl, unzip, build-essential...');
        await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; apt-get install -yq curl unzip build-essential');

        console.log('Installing Node.js 20...');
        await ssh.execCommand('curl -fsSL https://deb.nodesource.com/setup_20.x | bash -');
        await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; apt-get install -yq nodejs');
        
        console.log('Installing pm2...');
        await ssh.execCommand('npm install -g pm2');

        console.log('Creating app directory...');
        await ssh.execCommand('mkdir -p /var/www/jmj_app');

        console.log('Uploading files (this will skip large irrelevant directories)...');
        const localDir = __dirname;
        const remoteDir = '/var/www/jmj_app';

        let uploadCount = 0;
        await ssh.putDirectory(localDir, remoteDir, {
            recursive: true,
            concurrency: 10,
            validate: function(itemPath) {
                const baseName = path.basename(itemPath);
                return baseName !== 'node_modules' && 
                       baseName !== 'python_portable' && 
                       baseName !== '.git' && 
                       baseName !== '.gemini' &&
                       !baseName.endsWith('.exe') &&
                       !baseName.endsWith('.apk');
            },
            tick: function(localPath, remotePath, error) {
                uploadCount++;
                if (uploadCount % 100 === 0) console.log(`Uploaded ${uploadCount} files...`);
                if (error) console.log('Failed to transfer', localPath);
            }
        });
        console.log(`Total uploaded files: ${uploadCount}`);

        console.log('Installing NPM dependencies on server...');
        res = await ssh.execCommand('npm install', { cwd: remoteDir });
        console.log('NPM INSTALL DONE.');

        console.log('Setting up iptables port forwarding (80 -> 3000)...');
        await ssh.execCommand('iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000');
        await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; apt-get install -yq iptables-persistent');
        await ssh.execCommand('netfilter-persistent save');

        console.log('Starting app with PM2...');
        await ssh.execCommand('pm2 stop server || true', { cwd: remoteDir });
        await ssh.execCommand('pm2 start server.js --name server', { cwd: remoteDir });
        await ssh.execCommand('pm2 save');
        await ssh.execCommand('pm2 startup');

        console.log('--- DEPLOYMENT COMPLETELY FINISHED ---');
        ssh.dispose();

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
        ssh.dispose();
    }
}

deploy();
