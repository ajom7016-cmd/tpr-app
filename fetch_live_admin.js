const http = require('http');
http.get('http://104.247.110.22/admin.html', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("Nav Buttons:\n", data.match(/<button.*?id="nav-.*?<\/button>/g).join('\n'));
        console.log("\nTab Contents:\n", data.match(/<div.*?id="tab-.*?class=".*?>/g).join('\n'));
        console.log("\nStyle block:\n", data.substring(data.indexOf('<style>'), data.indexOf('</style>') + 8));
    });
});
