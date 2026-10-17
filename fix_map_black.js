const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMap() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // The user wants the map SVG to be PITCH BLACK. 
    // If the original SVG is light grey, filter: brightness(0) makes it black.
    html = html.replace('.world-map {\n            position: absolute;\n            inset: 0;\n            background: url(\'/world_map.svg\') center/80% no-repeat;\n            opacity: 1.08;\n            \n        }', '.world-map {\n            position: absolute;\n            inset: 0;\n            background: url(\'/world_map.svg\') center/80% no-repeat;\n            opacity: 1.08;\n            filter: brightness(0);\n        }');
    
    // Just in case the regex doesn't match exactly because of spaces/newlines:
    // Let's use a more robust replacement for world-map
    html = html.replace(/\.world-map\s*\{[^}]*\}/, ".world-map {\n            position: absolute;\n            inset: 0;\n            background: url('/world_map.svg') center/80% no-repeat;\n            opacity: 1;\n            filter: brightness(0);\n        }");

    // The user wants the orange arcs to be more visible and the map title to be orange.
    // The map nodes should have an orange glow.
    // Currently they are orange but let's make sure they glow properly like the screenshot.
    html = html.replace(/\.node\s*\{[^}]*\}/, ".node { position: absolute; width: 8px; height: 8px; background-color: #ea580c; border-radius: 50%; box-shadow: 0 0 10px 3px rgba(234,88,12,0.8), 0 0 20px 6px rgba(234,88,12,0.4); z-index: 10; transform: translate(-50%, -50%); }");
    
    // The text on nodes (USA, UK, etc.) in the screenshot is dark blue/grey, let's use #1e293b
    html = html.replace(/\.node\s*span\s*\{[^}]*\}/, ".node span { font-size: 0.85rem !important; font-weight: 700 !important; color: #1e293b !important; position: absolute; top: 15px; left: 50%; transform: translateX(-50%); }");
    
    // The arcs should be orange
    html = html.replace(/\.arc\s*\{[^}]*\}/, ".arc { fill: none; stroke: rgba(234,88,12,0.6); stroke-width: 1.5; stroke-dasharray: 4 4; animation: dash 20s linear infinite; }");
    
    // The map wrapper needs a white background and a subtle drop shadow
    html = html.replace(/\.map-wrapper\s*\{[^}]*\}/, ".map-wrapper { position: relative; background-color: #ffffff; border-radius: 30px; margin: 40px auto 40px auto; max-width: 1100px; min-height: 400px; padding: 60px 40px; z-index: 20; box-shadow: 0 10px 40px rgba(0,0,0,0.05); text-align: center; overflow: hidden; }");

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Map redesigned to black on white with orange glowing dots!");
    ssh.dispose();
}
fixMap().catch(console.error);
