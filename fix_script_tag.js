const fs = require('fs');

let file = 'public/login.html';
let text = fs.readFileSync(file, 'utf8');

const badScript = `<script>document.write('<script src="/js/app.js?v=' + new Date().getTime() + '"><\\/script>');</script>`;
const goodScript = `<script src="/js/app.js"></script>`;

text = text.replace(badScript, goodScript);

// Also let's fix the other window.APP calls just in case app.js STILL fails. Wait, if app.js fails, index.html would fail too!
// So fixing the script tag is the ROOT fix.

fs.writeFileSync(file, text);
console.log('Fixed script tag in login.html');
