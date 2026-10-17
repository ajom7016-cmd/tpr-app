const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMapAndHero() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // --- 1. Fix the Map ---
    // Remove invert filter from world-map
    html = html.replace(/filter:\s*invert\(1\);/g, '');
    
    // Change map title to orange
    html = html.replace(/\.map-title \{[^}]*\}/, '.map-title { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); z-index: 10; font-size: 2.5rem; font-weight: 800; color: #ea580c; letter-spacing: 1px; text-align: center; width: 100%; white-space: nowrap; }');
    // Change map title in media query to orange just in case
    html = html.replace('.map-title { font-size: 1.5rem !important; top: 15px !important; }', '.map-title { font-size: 1.5rem !important; top: 15px !important; color: #ea580c !important; background: none !important; -webkit-text-fill-color: #ea580c !important; }');
    
    // Change map nodes to orange (from yellow/gold)
    html = html.replace(/background-color:\s*#fcd34d;/g, 'background-color: #ea580c;');
    html = html.replace(/rgba\(252, 211, 77/g, 'rgba(234, 88, 12');
    
    // Change arc stroke to orange
    html = html.replace(/stroke:\s*rgba\(252, 211, 77/g, 'stroke: rgba(234, 88, 12');
    
    // Change node text to dark grey
    html = html.replace(/color:\s*#d1d5db;/g, 'color: #475569;');
    
    // Ensure map-wrapper doesn't have a weird dark background 
    html = html.replace(/background-color:\s*#171a1f;/g, 'background-color: transparent;');
    
    
    // --- 2. Fix the Hero Zoom ---
    // Zoom in the background image on mobile so the sofa armrests perfectly frame the glass panel
    html = html.replace(/background-size:\s*100%\s*auto\s*!important;/g, 'background-size: 150% auto !important;');
    // Set hero height to match the zoomed image height
    html = html.replace(/height:\s*55vw\s*!important;/g, 'height: 80vw !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Map and Hero zoom fixed!");
    ssh.dispose();
}
fixMapAndHero().catch(console.error);
