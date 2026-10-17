const fs = require('fs');

const files = [
    'public/glassmorphic_1/code.html',
    'public/glassmorphic_2/code.html',
    'public/login.html'
];

files.forEach(f => {
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(/<script>\s*<script\s+src="([^"]+)"><\/script>\s*<\/script>/g, '<script src="$1"></script>');
    fs.writeFileSync(f, s, 'utf8');
    console.log('Fixed nested script in:', f);
});
