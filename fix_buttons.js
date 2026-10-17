const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixButtons() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Make the button texts a bit smaller on mobile
    // Currently: .btn-glossy { padding: 6px 10px !important; font-size: 0.7rem !important; }
    html = html.replace(/font-size:\s*0\.7rem\s*!important;/g, 'font-size: 0.6rem !important;');
    // In desktop, it inherits from .btn-glossy standard size.
    // The user didn't specify if this is just mobile, but they uploaded a mobile screenshot.
    // "mobaile vew te..." from the last prompt suggests they are looking at mobile.

    // 2. Fix "Open in Safari" position
    // Currently, it's trapped inside a relative wrapper.
    // Let's extract it and put it AFTER the .btn-group, or just make it relative inside .btn-group?
    // If I make it a block element after the buttons, it will go to the next line.
    
    // Let's replace the whole HTML block for iOS button and Safari button.
    const oldBlock = `<div style="position: relative; display: inline-block;">
          <a href="#" onclick="alert('Our iOS App is currently in development and will be available soon on the App Store!'); return false;" class="btn-glossy" style="position: relative; opacity: 1;">
              <i class="fa-brands fa-apple"></i> iOS App
              <i class="fa-solid fa-lock" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; color: rgba(255,255,255,0.6); text-shadow: 0 1px 3px rgba(0,0,0,0.4); pointer-events: none;"></i>
          </a>
          <a href="/app.html" style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); color: #cbd5e1; font-size: 0.8rem; text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,0.8);" onmouseover="this.style.color='#fcd34d'" onmouseout="this.style.color='#cbd5e1'">
              <i class="fa-solid fa-arrow-right"></i> Open in Safari
          </a>
      </div>`;
      
    // New block: keep the relative wrapper just for the lock icon on iOS App.
    // Move Open in Safari OUTSIDE the btn-group entirely, so it sits below the group.
    const newBlock = `<div style="position: relative; display: inline-block;">
          <a href="#" onclick="alert('Our iOS App is currently in development and will be available soon on the App Store!'); return false;" class="btn-glossy" style="position: relative; opacity: 1;">
              <i class="fa-brands fa-apple"></i> iOS App
              <i class="fa-solid fa-lock" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; color: rgba(255,255,255,0.6); text-shadow: 0 1px 3px rgba(0,0,0,0.4); pointer-events: none;"></i>
          </a>
      </div>`;
      
    // Find the btn-group div and its closing tag, and inject the Safari button after it.
    // Since I can't easily parse HTML with regex, I'll just do a precise replace.
    let index = html.indexOf(oldBlock);
    if (index !== -1) {
        html = html.replace(oldBlock, newBlock);
        
        // Now find the closing </div> of the .btn-group
        // The btn-group contains: newBlock, Android a, Huawei a, </div>
        const androidHuawei = `
    <a href="#" onclick="promptPWAInstall(event); return false;" class="btn-glossy">
        <i class="fa-brands fa-android"></i> Android
    </a>
    <a href="#" onclick="promptPWAInstall(event); return false;" class="btn-glossy">
        <i class="fa-solid fa-bag-shopping"></i> Huawei
    </a>
</div>`;
        
        const newAndroidHuawei = `
    <a href="#" onclick="promptPWAInstall(event); return false;" class="btn-glossy">
        <i class="fa-brands fa-android"></i> Android
    </a>
    <a href="#" onclick="promptPWAInstall(event); return false;" class="btn-glossy">
        <i class="fa-solid fa-bag-shopping"></i> Huawei
    </a>
</div>
<!-- Perfect place for Safari button: aligned left like the text, below the buttons -->
<div style="margin-top: 15px; display: flex; justify-content: flex-start;">
    <a href="/app.html" style="color: #cbd5e1; font-size: 0.65rem; text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,0.8);" onmouseover="this.style.color='#fcd34d'" onmouseout="this.style.color='#cbd5e1'">
        <i class="fa-solid fa-arrow-right"></i> Open in Safari
    </a>
</div>`;
        
        html = html.replace(androidHuawei, newAndroidHuawei);
    } else {
        console.log("Could not find the exact old block, falling back to regex...");
        // Regex fallback
        // Remove the Open in Safari from its current spot
        html = html.replace(/<a href="\/app\.html"[^>]*>[\s\S]*?Open in Safari\s*<\/a>/, '');
        // Append it after .btn-group
        html = html.replace(/(<a href="#" onclick="promptPWAInstall[^>]*>[\s\S]*?Huawei\s*<\/a>\s*<\/div>)/, 
            `$1\n<div style="margin-top: 15px; display: flex; justify-content: flex-start;"><a href="/app.html" style="color: #cbd5e1; font-size: 0.65rem; text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap; text-shadow: 0 1px 3px rgba(0,0,0,0.8);" onmouseover="this.style.color='#fcd34d'" onmouseout="this.style.color='#cbd5e1'"><i class="fa-solid fa-arrow-right"></i> Open in Safari</a></div>`);
    }
    
    // Check if on mobile the btn-group is centered.
    // If btn-group is centered, the user might want left-aligned buttons like desktop?
    // In previous mobile CSS: .btn-group { flex-wrap: wrap !important; justify-content: center !important; }
    // Let's change it to justify-content: flex-start !important; so it aligns with the text!
    html = html.replace(/justify-content:\s*center\s*!important;/g, 'justify-content: flex-start !important;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Buttons adjusted and Safari button moved!");
    ssh.dispose();
}
fixButtons().catch(console.error);
