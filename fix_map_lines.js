const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixMap() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // We will replace the specific lines in our mixed-theme-overrides block
    
    // 1. Make the map darker
    // Current: .world-map { filter: invert(0) !important; opacity: 0.1 !important; }
    html = html.replace(
        '.world-map {\n            filter: invert(0) !important;\n            opacity: 0.1 !important;\n        }',
        '.world-map {\n            filter: invert(0) !important;\n            opacity: 0.25 !important;\n        }'
    );
    
    // 2. Make the animation lines highly visible
    // Current: .arc { stroke: rgba(249, 115, 22, 0.3) !important; }
    html = html.replace(
        '.arc {\n            stroke: rgba(249, 115, 22, 0.3) !important;\n        }',
        '.arc {\n            stroke: #ea580c !important;\n            stroke-width: 1.5px !important;\n            opacity: 0.8 !important;\n        }'
    );

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Map color and animation lines fixed!");
    } else {
        console.log("No changes made. Regex might not have matched.");
    }

    ssh.dispose();
}
fixMap().catch(console.error);
