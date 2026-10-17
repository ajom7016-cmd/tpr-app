const fs = require('fs');
let app = fs.readFileSync('public/js/app.js', 'utf8');
app = app.replace('fetch(\\/profile\,', 'fetch(\\/profile?t=\ + new Date().getTime(),');
fs.writeFileSync('public/js/app.js', app);
console.log('Fixed app.js');
