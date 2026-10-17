const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<!-- Promotional Banner Carousel \(Pure CSS\/HTML to bypass quota\) -->[\s\S]*?<!-- Carousel Dots -->[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/;

if (content.match(regex)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    console.log('Successfully removed the promotional banner carousel from tasks page.');
} else {
    console.log('Regex did not match for the promotional banner carousel.');
}
