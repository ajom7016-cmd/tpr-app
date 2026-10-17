const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

// Target pages inside public directory
const pages = [
    'investment_premium_glass/vip.html',
    'user_profile_premium_glass/code.html',
    'glassmorphic_1/code.html',
    'glassmorphic_2/code.html',
    'glassmorphic_3/code.html',
    'deposit_glass/code.html',
    'withdraw_glass/code.html',
    'refer_glass/code.html',
    'leaderboard_glass/code.html',
    'profile_settings_glass/code.html',
    'bank_details_glass/code.html',
    'security_glass/code.html',
    'security_2fa/code.html',
    'security_biometric/code.html',
    'security_change_password/code.html',
    'security_change_pin/code.html',
    'security_deactivate/code.html',
    'security_devices/code.html'
];

function cleanPage(content, relativePath) {
    let html = content;

    // 1. Remove bg-3d HTML block safely if present
    if (html.includes('<div class="bg-3d">')) {
        const start = html.indexOf('<div class="bg-3d">');
        // Find closing div of bg-3d
        // In our templates, bg-3d contains either 2 or 4 child divs
        const endSearch = html.indexOf('</div>', start);
        if (endSearch !== -1) {
            // Find the proper closing div of the bg-3d block
            const closingTag = '</div>';
            // In vip.html, it's followed by header:
            if (html.includes('<div class="px-6 pb-2">')) {
                const headerStart = html.indexOf('<div class="px-6 pb-2">');
                html = html.substring(0, start) + '<!-- Transparent Background -->' + html.substring(headerStart);
            } else if (html.includes('<div class="max-w-[400px]')) {
                const mainStart = html.indexOf('<div class="max-w-[400px]');
                html = html.substring(0, start) + '<!-- Transparent Background -->' + html.substring(mainStart);
            } else {
                // Generic replacement
                html = html.replace(/<div class="bg-3d">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, '<!-- Transparent Background -->');
                html = html.replace(/<div class="bg-3d">[\s\S]*?<\/div>/, '<!-- Transparent Background -->');
            }
        }
    }

    // 2. Remove old heavy CSS animations & 3D background styles
    html = html.replace(/\/\* Ultra Premium Animated 3D Background - Light Mode \*\/[\s\S]*?@keyframes float[\s\S]*?\}\s*\}/g, '');
    html = html.replace(/\/\* Glassmorphic 3D blocks in background \*\/[\s\S]*?\.bg-block-2\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.bg-3d\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.orb-1\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.orb-2\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/\.orb-3\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/@keyframes float\s*\{[\s\S]*?\}\s*\}/g, '');
    html = html.replace(/@keyframes pulse-bg\s*\{[\s\S]*?\}\s*\}/g, '');

    // 3. Remove old smoothLoad animation and opacity: 0
    html = html.replace(/animation:\s*smoothLoad[^;]+;/g, '');
    html = html.replace(/@keyframes smoothLoad\s*\{[\s\S]*?\}\s*\}/g, '');
    html = html.replace(/@keyframes fastEntrance\s*\{[\s\S]*?\}\s*\}/g, '');
    html = html.replace(/animation:\s*fastEntrance[^;]+;/g, '');
    html = html.replace(/opacity:\s*0\s*;/g, '');

    // 4. Force transparent background on body and html
    html = html.replace(/body\s*\{[\s\S]*?background-color:\s*#[a-fA-F0-9]+;?/g, (m) => m.replace(/background-color:\s*#[a-fA-F0-9]+;?/, 'background-color: transparent !important;'));
    html = html.replace(/<body[^>]*>/, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important; background-color: transparent !important;">');

    // 5. If vip.html, ensure cards have proper height & spacing so buttons never overlap
    if (relativePath.includes('vip.html')) {
        html = html.replace(/h-\[225px\](?!\s*mb-12)/g, 'min-h-[245px] pb-8 mb-14');
        html = html.replace(/h-\[225px\] mb-12/g, 'min-h-[245px] pb-8 mb-14');
        html = html.replace(/space-y-12/g, 'space-y-14');
    }

    return html;
}

async function run() {
    const baseDir = 'C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public';
    console.log("Cleaning all pages locally...");

    for (let rel of pages) {
        const fullPath = path.join(baseDir, rel);
        if (fs.existsSync(fullPath)) {
            console.log(`Processing: ${rel}`);
            let content = fs.readFileSync(fullPath, 'utf8');
            let cleaned = cleanPage(content, rel);
            fs.writeFileSync(fullPath, cleaned, 'utf8');
        } else {
            console.log(`Skipping (not found): ${rel}`);
        }
    }

    console.log("Connecting to SSH at 104.247.110.22...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Uploading cleaned pages to live server...");
    for (let rel of pages) {
        const localPath = path.join(baseDir, rel);
        if (fs.existsSync(localPath)) {
            const remotePath = `/var/www/jmj_app/public/${rel.replace(/\\/g, '/')}`;
            await ssh.putFile(localPath, remotePath);
            await ssh.execCommand(`chmod 644 ${remotePath}`);
            console.log(`Uploaded -> ${remotePath}`);
        }
    }

    // Also upload to vip_final.html and code_final.html in case any route points there
    const vipLocal = path.join(baseDir, 'investment_premium_glass/vip.html');
    await ssh.putFile(vipLocal, '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    
    const profLocal = path.join(baseDir, 'user_profile_premium_glass/code.html');
    await ssh.putFile(profLocal, '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html');

    console.log("Clearing and reloading PM2...");
    await ssh.execCommand('pm2 reload all');

    console.log("ALL PAGES CLEANED, TRANSPARENT, AND DEPLOYED SUCCESSFULLY!");
    ssh.dispose();
}

run().catch(err => {
    console.error("FATAL ERROR:", err);
    process.exit(1);
});
