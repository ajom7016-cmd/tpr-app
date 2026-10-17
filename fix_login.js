const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');
html = html.replace('<script src="/js/app.js"></script>', '<script>document.write(\'<script src="/js/app.js?v=\' + new Date().getTime() + \'"><\\/script>\');</script>');
fs.writeFileSync('public/login.html', html);
console.log('Fixed login.html');
