const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function secureDownloadButtons() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Secure the Windows Button
    // The Windows button has: <i class="fa-brands fa-windows"></i> Windows
    // It currently uses: onclick="promptPWAInstall(event); return false;"
    // We replace it precisely using regex.
    html = html.replace(
        /<a href="#" onclick="promptPWAInstall\(event\); return false;" class="btn-glossy" style="position: absolute; top: -25px; right: 25px; padding: 10px 20px; font-size: 0\.9rem; z-index: 50; box-shadow: 0 10px 20px rgba\(0,0,0,0\.5\);">\s*<i class="fa-brands fa-windows"><\/i> Windows\s*<\/a>/g,
        `<a href="#" onclick="if(!/Windows/i.test(navigator.userAgent)) { alert('This option is exclusively for Windows Computers. Please choose your correct device below.'); return false; } promptPWAInstall(event); return false;" class="btn-glossy" style="position: absolute; top: -25px; right: 25px; padding: 10px 20px; font-size: 0.9rem; z-index: 50; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                        <i class="fa-brands fa-windows"></i> Windows
                    </a>`
    );

    // 2. Secure the Android Button
    html = html.replace(
        /<a href="#" onclick="promptPWAInstall\(event\); return false;" class="btn-glossy">\s*<i class="fa-brands fa-android"><\/i> Android\s*<\/a>/g,
        `<a href="#" onclick="if(!/Android/i.test(navigator.userAgent)) { alert('This option is exclusively for Android phones. Please choose your correct device.'); return false; } promptPWAInstall(event); return false;" class="btn-glossy">
        <i class="fa-brands fa-android"></i> Android
    </a>`
    );

    // 3. Secure the Huawei Button
    html = html.replace(
        /<a href="#" onclick="promptPWAInstall\(event\); return false;" class="btn-glossy">\s*<i class="fa-solid fa-bag-shopping"><\/i> Huawei\s*<\/a>/g,
        `<a href="#" onclick="if(!/Android/i.test(navigator.userAgent)) { alert('This option is exclusively for Huawei/Android phones. Please choose your correct device.'); return false; } promptPWAInstall(event); return false;" class="btn-glossy">
        <i class="fa-solid fa-bag-shopping"></i> Huawei
    </a>`
    );

    // 4. Secure the iOS Button
    // Currently: onclick="alert('Our iOS App is currently in development and will be available soon on the App Store!'); return false;"
    html = html.replace(
        /<a href="#" onclick="alert\('Our iOS App is currently in development and will be available soon on the App Store!'\); return false;" class="btn-glossy" style="position: relative; opacity: 1;">/g,
        `<a href="#" onclick="if(!/iPhone|iPad|iPod|Mac/i.test(navigator.userAgent)) { alert('This option is exclusively for Apple/iOS devices. Please choose your correct device.'); return false; } alert('Our iOS App is currently in development and will be available soon on the App Store!'); return false;" class="btn-glossy" style="position: relative; opacity: 1;">`
    );

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Download buttons secured by OS!");
    ssh.dispose();
}
secureDownloadButtons().catch(console.error);
