const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function makeLight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Converting index.html to Light Mode...");
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Body & Main Wrapper
    html = html.replace('background-color: #2a2d34; /* Dark outer background matching the mockup */', 'background-color: #f1f5f9; /* Light outer background */');
    html = html.replace('color: #ffffff;', 'color: #1e293b;');
    html = html.replace('background-color: #1e2126;', 'background-color: #ffffff;');
    html = html.replace('box-shadow: 0 0 50px rgba(0,0,0,0.5);', 'box-shadow: 0 20px 60px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);');

    // 2. Mockup Wrapper (The Phone outline)
    // Find .mockup-wrapper and change its border/shadow
    html = html.replace('border: 6px solid #2a2d34;', 'border: 8px solid #ffffff;');
    html = html.replace('box-shadow: 0 30px 60px rgba(0,0,0,0.6),', 'box-shadow: 0 30px 60px rgba(0,0,0,0.15),');
    html = html.replace('inset 0 0 0 2px rgba(255,255,255,0.1);', 'inset 0 0 0 1px rgba(0,0,0,0.05);');

    // 3. Navbar
    html = html.replace('color: white;', 'color: #1e293b;');
    
    // 4. Hero text
    // The hero has white text. If the background image is clean_bg.jfif, it might still need white text if the image is dark.
    // Let's change the glass panel to a light frosted glass!
    html = html.replace('background: rgba(25, 27, 33, 0.6);', 'background: rgba(255, 255, 255, 0.7);');
    html = html.replace('border: 1px solid rgba(255, 255, 255, 0.1);', 'border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 20px 40px rgba(0,0,0,0.05);');
    
    // Change text inside the hero panel to dark
    html = html.replace('color: #fff;', 'color: #1e293b;');
    html = html.replace('color: #e2e8f0;', 'color: #475569;');
    
    // 5. Stat items (Inside glass panel)
    html = html.replace('background: rgba(255,255,255,0.05);', 'background: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.8);');

    // 6. Section Titles
    html = html.replace('color: #ffffff;', 'color: #1e293b;'); // General fallback
    html = html.replace('color: #a0aec0;', 'color: #64748b;');

    // 7. Footer
    html = html.replace('background: #1a1c23;', 'background: #f8fafc; border-top: 1px solid #e2e8f0;');
    html = html.replace('color: #718096;', 'color: #64748b;');
    
    // 8. Buttons
    // Make sure the primary buttons stand out on white
    // "Start Earning" is likely orange, so it's fine.
    
    // Re-apply the preloader background to be white (just in case the regex broke it)
    html = html.replace('background-color: #0b0f19;', 'background-color: #ffffff;');
    html = html.replace('color: #ffffff; margin: 0 0 5px 0; letter-spacing: -0.5px;">Loading...', 'color: #1a1a1a; margin: 0 0 5px 0; letter-spacing: -0.5px;">Loading...');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Converted to Light Theme!");
    ssh.dispose();
}
makeLight().catch(console.error);
