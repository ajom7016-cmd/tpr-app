const fs = require('fs');
const path = require('path');

const files = ['index.html', 'app.html'];

files.forEach(filename => {
    const filePath = path.join(__dirname, 'public', filename);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add viewport-fit=cover
    content = content.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
    );

    // 2. Add iOS / Android notch and safe area support
    content = content.replace(
        'position: absolute; bottom: 13px; left: 0; right: 0; margin: 0 auto;',
        'position: absolute; bottom: calc(13px + env(safe-area-inset-bottom, 0px)); left: 0; right: 0; margin: 0 auto;'
    );

    content = content.replace(
        '#global-header {\n        position: relative;\n        width: 100%;\n        z-index: 50;\n        flex-shrink: 0;\n    }',
        '#global-header {\n        position: relative;\n        width: 100%;\n        z-index: 50;\n        flex-shrink: 0;\n        padding-top: env(safe-area-inset-top, 0px);\n    }'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated mobile safe-area in ${filename}`);
});
