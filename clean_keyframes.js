const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanKeyframes() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Find everything from @keyframes dash-draw to the end of that block
    const regex = /@keyframes\s*dash-draw\s*\{[^}]*\}[^}]*\}[^}]*\}[^}]*\}/; // Try to capture all the junk
    // Actually, let's just find the exact string and replace it
    const badString = "@keyframes dash-draw { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } } 100% { stroke-dashoffset: 0; } } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -250; } }\n            100% { stroke-dashoffset: 0; }\n        }";
    
    // Let's use a more robust way to fix it
    // Find index of "@keyframes dash-draw"
    const startIndex = html.indexOf('@keyframes dash-draw');
    if (startIndex !== -1) {
        // We will just replace everything from startIndex up to the next "<script>" or something
        // Wait, where is it located?
        const endIndex = html.indexOf('</style>', startIndex);
        const sectionToReplace = html.substring(startIndex, endIndex);
        
        // sectionToReplace contains the messy keyframes.
        // Let's replace it with clean keyframes.
        const cleanKeyframes = "@keyframes dash-draw { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }\n    ";
        html = html.replace(sectionToReplace, cleanKeyframes);
        
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Cleaned up bad keyframes syntax!");
    } else {
        console.log("Could not find @keyframes dash-draw");
    }
    
    ssh.dispose();
}
cleanKeyframes().catch(console.error);
