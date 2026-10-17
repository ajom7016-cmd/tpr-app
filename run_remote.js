const { Client } = require('ssh2');

const command = process.argv[2] || 'uptime';

const conn = new Client();
conn.on('ready', () => {
    conn.exec(command, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code) => {
            conn.end();
            process.exit(code);
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (err) => {
    console.error('SSH Error:', err);
}).connect({
    host: '104.247.110.22',
    port: 22,
    username: 'root',
    password: 'Apple2010@'
});
