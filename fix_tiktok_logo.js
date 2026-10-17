const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the TikTok SVG URL with the square icon version
const oldUrl = 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg';
const newUrl = 'https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg';

if (content.includes(oldUrl)) {
    content = content.replace(newUrl, newUrl); // wait, replace all occurrences
    content = content.split(oldUrl).join(newUrl);
    fs.writeFileSync(file, content);
    console.log('Successfully updated the TikTok logo to the square icon version.');
} else {
    console.log('Old TikTok URL not found.');
}
