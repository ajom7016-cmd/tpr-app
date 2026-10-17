const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixHideClassFinal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    if (!code.includes('.hide { display: none !important; }')) {
        code = code.replace('</style>', '    .hide { display: none !important; }\n        .hidden { display: none !important; }\n    </style>');
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
        console.log("Fixed the .hide class bug permanently!");
    } else {
        console.log("Class already exists.");
    }
    ssh.dispose();
}
fixHideClassFinal().catch(console.error);
