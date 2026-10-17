const fs = require('fs');
let html = fs.readFileSync('public/security_change_password/code.html', 'utf8');

const markerStart = html.indexOf('padding: 0 48px 0 16px;');
if(markerStart > -1) {
    const formStart = html.indexOf('<form onsubmit="savePassword(event)" novalidate>', markerStart);
    if(formStart > -1) {
        const textToReplace = html.substring(markerStart, formStart);
        html = html.replace(textToReplace, '');
    }
}
fs.writeFileSync('public/security_change_password/code.html', html);
console.log('Fixed CSS blob');
