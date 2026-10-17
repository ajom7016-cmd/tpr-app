const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMapAndSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // --- 1. Revert Map to Light Grey ---
    html = html.replace('.world-map {\n            position: absolute;\n            inset: 0;\n            background: url(\'/world_map.svg\') center/80% no-repeat;\n            opacity: 1;\n            filter: brightness(0);\n        }', '.world-map {\n            position: absolute;\n            inset: 0;\n            background: url(\'/world_map.svg\') center/80% no-repeat;\n            opacity: 0.8;\n        }');
    
    // Nodes to subtle orange without giant glow
    html = html.replace(/\.node\s*\{\s*position:\s*absolute;\s*width:\s*8px;\s*height:\s*8px;\s*background-color:\s*#ea580c;\s*border-radius:\s*50%;\s*box-shadow:\s*0\s*0\s*10px\s*3px\s*rgba\(234,88,12,0.8\),\s*0\s*0\s*20px\s*6px\s*rgba\(234,88,12,0.4\);\s*z-index:\s*10;\s*transform:\s*translate\(-50%,\s*-50%\);\s*\}/, '.node { position: absolute; width: 6px; height: 6px; background-color: #ea580c; border-radius: 50%; box-shadow: 0 0 10px 2px rgba(234,88,12,0.5); z-index: 10; transform: translate(-50%, -50%); }');
    
    // Text to smaller and lighter
    html = html.replace(/\.node\s*span\s*\{\s*font-size:\s*0\.85rem\s*!important;\s*font-weight:\s*700\s*!important;\s*color:\s*#1e293b\s*!important;\s*position:\s*absolute;\s*top:\s*15px;\s*left:\s*50%;\s*transform:\s*translateX\(-50%\);\s*\}/, '.node span { font-size: 0.75rem !important; font-weight: 600 !important; color: #475569 !important; position: absolute; top: 12px; left: 50%; transform: translateX(-50%); }');
    
    // Arcs to very thin dashed lines
    html = html.replace(/\.arc\s*\{\s*fill:\s*none;\s*stroke:\s*rgba\(234,88,12,0\.6\);\s*stroke-width:\s*1\.5;\s*stroke-dasharray:\s*4\s*4;\s*animation:\s*dash\s*20s\s*linear\s*infinite;\s*\}/, '.arc { fill: none; stroke: rgba(234,88,12,0.3); stroke-width: 1; stroke-dasharray: 4 4; animation: dash 20s linear infinite; }');
    
    // --- 2. 3D Spinner ---
    // The user wants a "3D" spinner. Let's create a beautiful 3D rotating rings spinner.
    const newSpinnerHTML = `
    <div style="position: relative; width: 80px; height: 80px; transform-style: preserve-3d; perspective: 800px;">
        <div style="position: absolute; inset: 0; border-radius: 50%; border: 4px solid transparent; border-top-color: #ea580c; border-bottom-color: #ea580c; animation: spin-3d-x 1.2s linear infinite;"></div>
        <div style="position: absolute; inset: 0; border-radius: 50%; border: 4px solid transparent; border-left-color: #00d2ff; border-right-color: #00d2ff; animation: spin-3d-y 1.2s linear infinite;"></div>
        <div style="position: absolute; inset: 15px; border-radius: 50%; border: 3px solid transparent; border-top-color: #1e293b; animation: spin-3d-z 1s linear infinite;"></div>
    </div>
    <div style="margin-top: 30px; font-family: 'Outfit', sans-serif; text-align: center; z-index: 10;">
        <h2 style="font-size: 1.3rem; font-weight: 700; color: #1e293b; margin: 0; letter-spacing: -0.5px;">Loading...</h2>
        <p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">TPR Experience</p>
    </div>
    `;
    
    const newSpinnerKeyframes = `
    <style>
        @keyframes spin-3d-x { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); } }
        @keyframes spin-3d-y { 0% { transform: rotateX(180deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); } }
        @keyframes spin-3d-z { 0% { transform: rotateZ(0deg); } 100% { transform: rotateZ(360deg); } }
    </style>
    `;

    // Replace the old spinner HTML (find the <div style="position: relative; width: 100px; height: 100px; ...)
    const oldSpinnerHTMLStart = html.indexOf('<div style="position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">');
    const oldSpinnerHTMLEnd = html.indexOf('<h2 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.5px;">Loading...</h2>\n        <p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">TPR Experience</p>\n    </div>');
    
    if(oldSpinnerHTMLStart !== -1 && oldSpinnerHTMLEnd !== -1) {
        const fullOldSpinnerHTML = html.substring(oldSpinnerHTMLStart, oldSpinnerHTMLEnd + '<h2 style="font-size: 1.3rem; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.5px;">Loading...</h2>\n        <p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">TPR Experience</p>\n    </div>'.length);
        html = html.replace(fullOldSpinnerHTML, newSpinnerHTML);
    }
    
    // Replace the keyframes
    html = html.replace('@keyframes tpr-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }', '@keyframes spin-3d-x { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); } }\n        @keyframes spin-3d-y { 0% { transform: rotateX(180deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); } }\n        @keyframes spin-3d-z { 0% { transform: rotateZ(0deg); } 100% { transform: rotateZ(360deg); } }');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Map fixed and 3D spinner added!");
    ssh.dispose();
}
fixMapAndSpinner().catch(console.error);
