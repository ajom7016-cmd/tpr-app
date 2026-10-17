const http = require('http');
http.get('http://104.247.110.22/admin.html', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const lines = data.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('switchTab')) {
                console.log('Line ' + i + ': ' + lines[i].trim());
            }
            if (lines[i].includes('id="tab-')) {
                console.log('Line ' + i + ': ' + lines[i].trim());
            }
        }
        console.log("\nStyle block:\n", data.substring(data.indexOf('<style>'), data.indexOf('</style>') + 8));
    });
});
