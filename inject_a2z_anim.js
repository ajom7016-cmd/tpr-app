const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function injectA2Z() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const path = require('path');

const publicDir = '/var/www/jmj_app/public';

// Recursive function to get all HTML files
function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allFiles = getAllHtmlFiles(publicDir);
const excludeFiles = ['app.html', 'index.html', 'admin.html', 'landing.html', 'login.html', 'login_backup.html'];

const universalCss = '<style id="stagger-anim">\\n' +
'@keyframes popUpStagger {\\n' +
'    0% { opacity: 0; transform: translateY(30px) scale(0.96); }\\n' +
'    100% { opacity: 1; transform: translateY(0) scale(1); }\\n' +
'}\\n' +
'/* Target children of main, or children of the primary wrapper div, or task container */\\n' +
'body > main > *:not(script):not(style), \\n' +
'body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:not(script):not(style), \\n' +
'#tasks-container > div, \\n' +
'#history-container > div {\\n' +
'    animation: popUpStagger 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both !important;\\n' +
'}\\n' +
'body > main > *:nth-child(1), body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:nth-child(1), #tasks-container > *:nth-child(1), #history-container > *:nth-child(1) { animation-delay: 0.08s !important; }\\n' +
'body > main > *:nth-child(2), body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:nth-child(2), #tasks-container > *:nth-child(2), #history-container > *:nth-child(2) { animation-delay: 0.15s !important; }\\n' +
'body > main > *:nth-child(3), body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:nth-child(3), #tasks-container > *:nth-child(3), #history-container > *:nth-child(3) { animation-delay: 0.22s !important; }\\n' +
'body > main > *:nth-child(4), body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:nth-child(4), #tasks-container > *:nth-child(4), #history-container > *:nth-child(4) { animation-delay: 0.29s !important; }\\n' +
'body > main > *:nth-child(5), body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:nth-child(5), #tasks-container > *:nth-child(5), #history-container > *:nth-child(5) { animation-delay: 0.36s !important; }\\n' +
'body > main > *:nth-child(6), body > div:not(.bg-3d):not(.cropper-container):not(.modal) > *:nth-child(6), #tasks-container > *:nth-child(6), #history-container > *:nth-child(6) { animation-delay: 0.43s !important; }\\n' +
'body > main > *:nth-child(7), body > div:not(.bg-3d) > *:nth-child(7) { animation-delay: 0.50s !important; }\\n' +
'body > main > *:nth-child(8), body > div:not(.bg-3d) > *:nth-child(8) { animation-delay: 0.57s !important; }\\n' +
'body > main > *:nth-child(9), body > div:not(.bg-3d) > *:nth-child(9) { animation-delay: 0.64s !important; }\\n' +
'body > main > *:nth-child(10), body > div:not(.bg-3d) > *:nth-child(10) { animation-delay: 0.71s !important; }\\n' +
'</style>';

let modifiedCount = 0;

for (let file of allFiles) {
    const baseName = path.basename(file);
    if (!excludeFiles.includes(baseName)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('</head>')) {
            // Remove any old staggered css
            content = content.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
            // Inject the universal one
            content = content.replace('</head>', universalCss + '\\n</head>');
            fs.writeFileSync(file, content);
            modifiedCount++;
        }
    }
}

// Cache Busting
const appFile = path.join(publicDir, 'app.html');
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '11.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

console.log('Injected A2Z animations into ' + modifiedCount + ' files!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/inject_a2z.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/inject_a2z.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v120\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
injectA2Z().catch(console.error);
