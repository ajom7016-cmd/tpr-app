const { Client } = require('ssh2');

function runRemote(cmd) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        let output = '';
        conn.on('ready', () => {
            conn.exec(cmd, (err, stream) => {
                if (err) return reject(err);
                stream.on('close', (code) => {
                    conn.end();
                    resolve({ code, output });
                }).on('data', data => {
                    output += data.toString();
                }).stderr.on('data', data => {
                    output += data.toString();
                });
            });
        }).on('error', reject).connect({
            host: '104.247.110.22',
            port: 22,
            username: 'root',
            password: 'Apple2010@'
        });
    });
}

async function main() {
    const nodeCmd = `node -e "const db = require('./database'); setTimeout(() => { db.all('SELECT id, name, phone, balance, vip_plan FROM users', (err, rows) => { console.log(JSON.stringify(rows)); process.exit(0); }); }, 500);"`;
    const res = await runRemote(`cd /var/www/jmj_app && ${nodeCmd}`);
    console.log("Result:", res.output.trim());
}

main().catch(console.error);
