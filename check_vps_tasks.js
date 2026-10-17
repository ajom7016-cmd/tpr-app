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
    const script = `
const db = require('./database');
setTimeout(() => {
    db.all("SELECT id, title, reward, type, link FROM tasks", (err, rows) => {
        console.log("Tasks count:", rows ? rows.length : 0);
        console.log("Tasks:", JSON.stringify(rows, null, 2));
        process.exit(0);
    });
}, 500);
`;
    const encoded = Buffer.from(script).toString('base64');
    const res = await runRemote(`cd /var/www/jmj_app && node -e "eval(Buffer.from('${encoded}', 'base64').toString())"`);
    console.log(res.output.trim());
}

main().catch(console.error);
