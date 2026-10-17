const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixMapBulletproof() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // We are going to replace the empty .world-map div with a robust aspect-ratio container!
    // Instead of using background image, we will use an <img> tag to force the container's aspect ratio.
    // First, let's remove the .world-map background CSS entirely so it doesn't interfere.
    html = html.replace(/background:\s*url\('\/world_map\.svg'\)[^;]+;/g, '/* map background removed in favor of img */');
    
    // Now, find the <div class="world-map"></div> and replace it with our img structure
    // But wait, we need the dots and svg to be INSIDE the container that has the img.
    // Actually, .map-wrapper is the parent. We can just create a <div class="map-inner" style="position: relative; width: 100%;">
    // and put the img, svg, and dots inside it!
    
    const wrapperStart = html.indexOf('<div class="map-wrapper">');
    const titleStart = html.indexOf('<div class="map-title">');
    
    if (wrapperStart !== -1 && titleStart !== -1) {
        let insideWrapper = html.substring(wrapperStart + '<div class="map-wrapper">'.length, titleStart);
        
        // Remove the empty <div class="world-map"></div>
        insideWrapper = insideWrapper.replace('<div class="world-map"></div>', '');
        
        // Wrap everything in map-inner
        const bulletproofMap = `
        <div class="map-inner" style="position: relative; width: 100%; margin: 0 auto; max-width: 950px;">
            <!-- The img forces the container height to perfectly match the SVG's natural aspect ratio -->
            <img src="/world_map.svg" style="width: 100%; height: auto; opacity: 0.15; display: block; pointer-events: none;" alt="Map">
            
            ${insideWrapper}
        </div>
        `;
        
        html = html.substring(0, wrapperStart + '<div class="map-wrapper">'.length) + bulletproofMap + html.substring(titleStart);
        
        // Remove min-height from map-wrapper so it collapses around map-inner perfectly
        html = html.replace(/min-height:\s*400px;/g, '');
        // For mobile, there might be a min-height unset, that's fine.
        
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Bulletproof map alignment applied!");
    } else {
        console.log("Could not find wrapper or title");
    }
    ssh.dispose();
}
fixMapBulletproof().catch(console.error);
