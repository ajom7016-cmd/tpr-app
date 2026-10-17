const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_desktop');
const outputFile = path.join(__dirname, 'tpr_bkash_proof_desktop.mp4');
const downloadsFile = 'C:\\Users\\ajom7\\Downloads\\tpr_bkash_proof_desktop.mp4';

// Clean temporary folder
if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const frames = [];

async function main() {
    console.log('[1/6] Launching Chrome in Desktop 1920x1080 Mode...');
    const b64 = fs.readFileSync(path.join(__dirname, 'public/assets/bkash.png')).toString('base64');

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

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInBob25lIjoiMDE4NzAxNjExMDYiLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MDcwMjYzNywiZXhwIjoxNzkwNzg5MDM3fQ.wBj5x1CKtLwsD5MDf5VF2diFyrsLGJq-UwPjhYQT8Zk';

    // Hook CDP Screencast for 1080p desktop capture
    const client = await page.target().createCDPSession();
    let frameIndex = 0;

    client.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
        frameIndex++;
        const fPath = path.join(tmpDir, `f_${String(frameIndex).padStart(6, '0')}.jpg`);
        fs.writeFileSync(fPath, Buffer.from(data, 'base64'));
        frames.push({
            path: fPath,
            timestamp: metadata.timestamp
        });
        try {
            await client.send('Page.screencastFrameAck', { sessionId });
        } catch(e) {}
    });

    console.log('[2/6] Activating 1080p Screencast Stream...');
    await client.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 92,
        maxWidth: 1920,
        maxHeight: 1080,
        everyNthFrame: 1
    });

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    // Setup local storage session
    console.log('[3/6] Loading App & Injecting Session...');
    await page.goto('https://thepetroyal.com/login.html', { waitUntil: 'networkidle2' });
    await page.evaluate((tok) => {
        localStorage.setItem('userToken', tok);
    }, token);

    // Navigate to Main App on Desktop
    await page.goto('https://thepetroyal.com/', { waitUntil: 'networkidle2' });
    await wait(2000);

    // Inject 60FPS continuous animation ticker and smooth notification helper
    await page.evaluate((imgB64) => {
        // Continuous RAF compositor ticker for ultra-smooth 60fps frame generation
        let tick = 0;
        function tickerLoop() {
            document.documentElement.style.setProperty('--frame-tick', (tick++) % 100);
            requestAnimationFrame(tickerLoop);
        }
        requestAnimationFrame(tickerLoop);

        window.triggerSmoothBkashPush = (amt = '520.00', trx = '9K3F89LA21') => {
            const device = document.querySelector('.device-mockup') || document.body;
            const notif = document.createElement('div');
            notif.id = 'bkash-push-alert';
            notif.style.cssText = `
                position: absolute;
                top: -120px;
                left: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(28px);
                -webkit-backdrop-filter: blur(28px);
                border-radius: 22px;
                padding: 13px 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(226, 19, 110, 0.15);
                border: 1px solid rgba(226, 19, 110, 0.35);
                z-index: 99999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                gap: 13px;
                align-items: flex-start;
                transition: transform 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.25);
                transform: translateY(0);
            `;

            notif.innerHTML = `
                <div style="width: 44px; height: 44px; border-radius: 13px; background: #ffffff; border: 1px solid rgba(226, 19, 110, 0.18); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(226, 19, 110, 0.18); padding: 5px;">
                    <img src="data:image/png;base64,${imgB64}" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 800; font-size: 15px; color: #E2136E; letter-spacing: -0.2px;">bKash</span>
                            <span style="font-size: 10px; font-weight: 700; background: rgba(226, 19, 110, 0.1); color: #E2136E; padding: 1px 6px; border-radius: 6px;">2026</span>
                        </div>
                        <span style="font-size: 11px; font-weight: 600; color: #94a3b8;">now</span>
                    </div>
                    <div style="font-weight: 800; font-size: 13.5px; color: #0f172a; line-height: 1.35; margin-bottom: 2px;">
                        You have received Tk ${amt} from TPR ROYAL.
                    </div>
                    <div style="font-size: 11.5px; color: #475569; line-height: 1.4; word-break: break-all;">
                        Fee: Tk 0.00 | Ref: TPR | TrxID: ${trx} | 29/09/2026 11:30 PM | Balance: Tk 1,520.00
                    </div>
                </div>
            `;

            device.appendChild(notif);
            requestAnimationFrame(() => {
                notif.style.transform = 'translateY(134px)';
            });
        };
    }, b64);

    console.log('[4/6] Step 1: Starting at Withdraw Screen...');
    // Open Withdraw Page inside iframe
    await page.evaluate(() => {
        if (window.loadPage) window.loadPage('withdraw_glass/code.html');
    });
    await wait(3000);

    // Target the withdraw iframe
    const framesList = page.frames();
    const withdrawFrame = framesList.find(f => f.url().includes('withdraw_glass')) || page;

    // Type 520 in amount
    console.log('Typing amount 520...');
    try {
        await withdrawFrame.evaluate(() => {
            const inp = document.getElementById('amount-input');
            if (inp) {
                inp.value = '520';
                inp.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    } catch(e) {}
    await wait(1500);

    // Click Confirm Withdrawal
    console.log('Submitting withdrawal...');
    try {
        await withdrawFrame.evaluate(() => {
            const btn = document.getElementById('submit-btn');
            if (btn) btn.click();
        });
    } catch(e) {}
    await wait(2200);

    console.log('[5/6] Step 2: Smoothly Returning to Home Page...');
    // Return to Home Page
    await page.evaluate(() => {
        const navs = document.querySelectorAll('.nav-item');
        if (navs[0]) navs[0].click();
        else if (window.loadPage) window.loadPage('glassmorphic_1/code.html');
    });
    await wait(3000);

    // On Home Page: Slow, ultra-smooth browsing and scrolling
    console.log('Smoothly scrolling on Home Page...');
    const homeFrame = page.frames().find(f => f.url().includes('glassmorphic_1')) || page;

    for (let i = 0; i < 20; i++) {
        await homeFrame.evaluate(() => window.scrollBy({ top: 12, behavior: 'instant' }));
        await wait(60);
    }
    await wait(1800);

    for (let i = 0; i < 20; i++) {
        await homeFrame.evaluate(() => window.scrollBy({ top: -12, behavior: 'instant' }));
        await wait(60);
    }
    await wait(2000);

    console.log('[6/6] Step 3: Sudden Arrival of 2026 bKash Payment Received Notification!');
    await page.evaluate(() => {
        window.triggerSmoothBkashPush('520.00', '9K3F89LA21');
    });

    // Hold for 7.5 seconds on the Home Page so viewers can easily read every single detail
    console.log('Holding notification on Home Page for 7.5 seconds...');
    await wait(7500);

    // Stop recording
    console.log('Stopping screencast...');
    await client.send('Page.stopScreencast');
    await wait(400);
    await browser.close();

    console.log(`Total captured frames: ${frames.length}`);

    // Build concat.txt
    console.log('Building concat instruction file...');
    const concatLines = [];
    for (let i = 0; i < frames.length; i++) {
        const cur = frames[i];
        const next = frames[i + 1];
        let duration = next ? (next.timestamp - cur.timestamp) : 1.0;
        if (duration <= 0.001) duration = 0.033; // ~30fps min
        if (duration > 8.0) duration = 8.0;
        const safePath = cur.path.replace(/\\/g, '/');
        concatLines.push(`file '${safePath}'`);
        concatLines.push(`duration ${duration.toFixed(4)}`);
    }
    const lastSafe = frames[frames.length - 1].path.replace(/\\/g, '/');
    concatLines.push(`file '${lastSafe}'`);

    const concatPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(concatPath, concatLines.join('\n'));

    console.log('Encoding 1080p MP4 Video with FFmpeg (High Quality, 30fps)...');
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
        // Copy to Downloads folder as requested
        fs.copyFileSync(outputFile, downloadsFile);
        const mb = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
        console.log(`\n========================================================`);
        console.log(`🎉 DESKTOP HD PROMO VIDEO RECORDED SUCCESSFULLY!`);
        console.log(`Saved to: ${outputFile}`);
        console.log(`Copied to Downloads: ${downloadsFile}`);
        console.log(`Size: ${mb} MB`);
        console.log(`========================================================\n`);
    } else {
        console.error('Encoding error:', encRes.stderr);
    }
}

main().catch(console.error);
