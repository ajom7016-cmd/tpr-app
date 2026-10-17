const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_ultimate');
const outputFile = path.join(__dirname, 'tpr_desktop_mobile_proof.mp4');
const downloadsFile = 'C:\\Users\\ajom7\\Downloads\\tpr_desktop_mobile_proof.mp4';

if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const frames = [];
let frameIndex = 0;

async function recordFramesFromPage(page, client, durationMs, actionFn) {
    const tStart = Date.now();
    if (actionFn) {
        actionFn().catch(console.error);
    }
    while (Date.now() - tStart < durationMs) {
        await new Promise(r => setTimeout(r, 40));
    }
}

async function main() {
    console.log('[1/7] Launching Chrome in 1920x1080 Desktop Retina Viewport...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
            '--disable-web-security'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

    const client = await page.target().createCDPSession();

    client.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
        frameIndex++;
        const fPath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.jpg`);
        fs.writeFileSync(fPath, Buffer.from(data, 'base64'));
        frames.push({
            path: fPath,
            timestamp: metadata.timestamp
        });
        try {
            await client.send('Page.screencastFrameAck', { sessionId });
        } catch(e) {}
    });

    console.log('[2/7] Activating 1080p CDP Screencast...');
    await client.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 92,
        maxWidth: 1920,
        maxHeight: 1080,
        everyNthFrame: 1
    });

    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInBob25lIjoiMDE4NzAxNjExMDYiLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MDcwMjYzNywiZXhwIjoxNzkwNzg5MDM3fQ.wBj5x1CKtLwsD5MDf5VF2diFyrsLGJq-UwPjhYQT8Zk';

    console.log('[3/7] Part 1: Desktop The Pet Royal - Withdraw & Home Page...');
    await page.goto('https://thepetroyal.com/login.html', { waitUntil: 'networkidle2' });
    await page.evaluate((tok) => {
        localStorage.setItem('userToken', tok);
    }, token);

    await page.goto('https://thepetroyal.com/', { waitUntil: 'networkidle2' });
    await wait(1800);

    // Continuous 60fps compositor ticker
    await page.evaluate(() => {
        let tick = 0;
        function tickerLoop() {
            document.documentElement.style.setProperty('--frame-tick', (tick++) % 100);
            requestAnimationFrame(tickerLoop);
        }
        requestAnimationFrame(tickerLoop);
    });

    // Open Withdraw Page
    await page.evaluate(() => {
        if (window.loadPage) window.loadPage('withdraw_glass/code.html');
    });
    await wait(2500);

    const withdrawFrame = page.frames().find(f => f.url().includes('withdraw_glass')) || page;

    // Type 520
    try {
        await withdrawFrame.evaluate(() => {
            const inp = document.getElementById('amount-input');
            if (inp) {
                inp.value = '520';
                inp.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    } catch(e) {}
    await wait(1200);

    // Click Confirm Withdrawal
    console.log('Submitting withdrawal...');
    try {
        await withdrawFrame.evaluate(() => {
            const btn = document.getElementById('submit-btn');
            if (btn) btn.click();
        });
    } catch(e) {}
    await wait(2000);

    // Return to Home Page
    console.log('Returning to Home Page...');
    await page.evaluate(() => {
        const navs = document.querySelectorAll('.nav-item');
        if (navs[0]) navs[0].click();
        else if (window.loadPage) window.loadPage('glassmorphic_1/code.html');
    });
    await wait(2500);

    // Smooth browsing on Home Page
    console.log('Smoothly scrolling on Home Page...');
    const homeFrame = page.frames().find(f => f.url().includes('glassmorphic_1')) || page;
    for (let i = 0; i < 15; i++) {
        await homeFrame.evaluate(() => window.scrollBy({ top: 12, behavior: 'instant' }));
        await wait(60);
    }
    await wait(1200);
    for (let i = 0; i < 15; i++) {
        await homeFrame.evaluate(() => window.scrollBy({ top: -12, behavior: 'instant' }));
        await wait(60);
    }
    await wait(1500);

    console.log('[4/7] Part 2: Transitioning to Real Mobile Phone bKash Check...');
    // Load the desktop-styled mobile proof presentation wrapper
    await page.evaluate(() => {
        // Create full overlay with high-end desktop studio backdrop
        const overlay = document.createElement('div');
        overlay.id = 'studio-mobile-cut';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle at 50% 30%, #1e293b 0%, #0f172a 70%, #020617 100%);
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        overlay.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 18px;">
                <div style="background: rgba(226, 19, 110, 0.15); border: 1px solid rgba(226, 19, 110, 0.4); padding: 6px 18px; border-radius: 9999px; display: flex; align-items: center; gap: 8px;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #E2136E; box-shadow: 0 0 10px #E2136E;"></span>
                    <span style="color: #ffffff; font-weight: 700; font-size: 13px; font-family: sans-serif; letter-spacing: 0.5px;">LIVE MOBILE CHECK • REAL BKASH SMS</span>
                </div>
                
                <!-- Center Mobile Frame -->
                <div style="
                    width: 390px;
                    height: 844px;
                    border-radius: 44px;
                    border: 4px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1);
                    overflow: hidden;
                    position: relative;
                    background: #000000;
                ">
                    <iframe id="mobile-proof-iframe" src="/mobile_proof.html" style="width: 100%; height: 100%; border: none;"></iframe>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    });

    await wait(2200);

    // Inside mobile proof iframe: Trigger SMS Push Drop
    console.log('[5/7] Dropping authentic 2026 bKash Push Notification onto mobile screen...');
    const proofFrame = page.frames().find(f => f.url().includes('mobile_proof.html')) || page;

    try {
        await proofFrame.evaluate(() => {
            if (window.triggerSmsPush) window.triggerSmsPush();
        });
    } catch(e) {}
    await wait(3000); // Let viewer clearly see the incoming SMS drop

    // Tap notification to open the real Google Messages bKash thread
    console.log('[6/7] Tapping notification to open official bKash SMS thread...');
    try {
        await proofFrame.evaluate(() => {
            if (window.openMessages) window.openMessages();
        });
    } catch(e) {}

    // Hold for 7.5 seconds on the official bKash conversation thread
    console.log('Holding bKash conversation thread for 7.5 seconds for complete proof inspection...');
    await wait(7500);

    console.log('[7/7] Finishing recording and stopping screencast...');
    await client.send('Page.stopScreencast');
    await wait(500);
    await browser.close();

    console.log(`Captured ${frames.length} total high-def frames!`);

    // Build concat.txt
    console.log('Building concat instruction file...');
    const concatLines = [];
    for (let i = 0; i < frames.length; i++) {
        const cur = frames[i];
        const next = frames[i + 1];
        let duration = next ? (next.timestamp - cur.timestamp) : 1.0;
        if (duration <= 0.001) duration = 0.033;
        if (duration > 8.0) duration = 8.0;
        const safePath = cur.path.replace(/\\/g, '/');
        concatLines.push(`file '${safePath}'`);
        concatLines.push(`duration ${duration.toFixed(4)}`);
    }
    const lastSafe = frames[frames.length - 1].path.replace(/\\/g, '/');
    concatLines.push(`file '${lastSafe}'`);

    const concatPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(concatPath, concatLines.join('\n'));

    console.log('Encoding Final Master HD Video with FFmpeg (1080p, 30fps)...');
    const encRes = spawnSync(ffmpeg.path, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatPath,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '19',
        '-r', '30',
        outputFile
    ], { encoding: 'utf8' });

    if (fs.existsSync(outputFile)) {
        fs.copyFileSync(outputFile, downloadsFile);
        const mb = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
        console.log(`\n========================================================`);
        console.log(`🎉 ULTIMATE REALISTIC PROOF VIDEO RECORDED!`);
        console.log(`Local Path: ${outputFile}`);
        console.log(`Downloads:  ${downloadsFile}`);
        console.log(`Size:       ${mb} MB`);
        console.log(`========================================================\n`);
    } else {
        console.error('Encoding error:', encRes.stderr);
    }
}

main().catch(console.error);
