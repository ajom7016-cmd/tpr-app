const fs = require('fs');
let content = fs.readFileSync('public/login.html', 'utf8');

// For email or phone
content = content.replace('--gap-width: 104px;', '--gap-width: 106px;');
// For password
content = content.replace('--gap-width: 65px;', '--gap-width: 67px;');
// For Name
content = content.replace('--gap-width: 45px;', '--gap-width: 47px;');
// For New Password in reset
content = content.replace('--gap-width: 95px;', '--gap-width: 97px;');
// Confirm password in registration? Let's search and add 2
content = content.replace(/--gap-width:\s*(\d+)px;/g, (match, p1) => {
    return --gap-width: px;;
});

fs.writeFileSync('public/login.html', content);
console.log('Done login.html');
