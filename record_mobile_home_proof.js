const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_home_proof');
const outputFile = path.join(__dirname, 'tpr_mobile_home_proof.mp4');
const downloadsFile = 'C:\\Users\\ajom7\\Downloads\\tpr_mobile_home_proof.mp4';

if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const frames = [];
let frameIndex = 0;

async function main() {
    console.log('[1/5] Launching Chrome in Mobile Retina 390x844 Viewport...');
    const b64 = fs.readFileSync(path.join(__dirname, 'public/assets/bkash.png')).toString('base64');

    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=390,844',
            '--disable-web-security'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

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

    console.log('[2/5] Activating Screencast Stream...');
    await client.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 95,
        everyNthFrame: 1
    });

    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInBob25lIjoiMDE4NzAxNjExMDYiLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MDcwMjYzNywiZXhwIjoxNzkwNzg5MDM3fQ.wBj5x1CKtLwsD5MDf5VF2diFyrsLGJq-UwPjhYQT8Zk';

    console.log('[3/5] Loading Home Page in Mobile View...');
    await page.goto('https://thepetroyal.com/login.html', { waitUntil: 'networkidle2' });
    await page.evaluate((tok) => {
        localStorage.setItem('userToken', tok);
    }, token);

    await page.goto('https://thepetroyal.com/', { waitUntil: 'networkidle2' });
    await wait(2000);

    // Continuous 60fps compositor ticker for buttery smooth playback
    await page.evaluate(() => {
        let tick = 0;
        function tickerLoop() {
            document.documentElement.style.setProperty('--frame-tick', (tick++) % 100);
            requestAnimationFrame(tickerLoop);
        }
        requestAnimationFrame(tickerLoop);
    });

    // Ensure we are on Home tab (glassmorphic_1)
    await page.evaluate(() => {
        if (window.loadPage) window.loadPage('glassmorphic_1/code.html');
    });
    await wait(2500);

    // Smooth gentle scroll down on the Home page
    console.log('Smoothly scrolling on Home Page...');
    const homeFrame = page.frames().find(f => f.url().includes('glassmorphic_1')) || page;
    for (let i = 0; i < 20; i++) {
        await homeFrame.evaluate(() => window.scrollBy({ top: 10, behavior: 'instant' }));
        await wait(50);
    }
    await wait(1500);

    for (let i = 0; i < 20; i++) {
        await homeFrame.evaluate(() => window.scrollBy({ top: -10, behavior: 'instant' }));
        await wait(50);
    }
    await wait(1800);

    // Trigger authentic 2026 bKash Push Notification drop from top
    console.log('[4/5] Dropping authentic 2026 bKash Push Notification onto Home Page...');
    await page.evaluate((imgB64) => {
        const notif = document.createElement('div');
        notif.id = 'bkash-push-alert';
        notif.style.cssText = `
            position: fixed;
            top: -130px;
            left: 12px;
            right: 12px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
            border-radius: 22px;
            padding: 13px 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.25), 0 4px 14px rgba(226, 19, 110, 0.18);
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
                    You have received Tk 520.00 from TPR ROYAL.
                </div>
                <div style="font-size: 11.5px; color: #475569; line-height: 1.4; word-break: break-all;">
                    Fee: Tk 0.00 | Ref: TPR | TrxID: 9K3F89LA21 | 29/09/2026 11:30 PM | Balance: Tk 1,520.00
                </div>
            </div>
        `;

        document.body.appendChild(notif);
        requestAnimationFrame(() => {
            notif.style.transform = 'translateY(144px)';
        });
    }, b64);

    // Hold notification on Home Page for 8 full seconds
    console.log('Holding notification on Home Page for 8 seconds...');
    await wait(8000);

    // Stop recording
    console.log('Stopping screencast...');
    await client.send('Page.stopScreencast');
    await wait(400);
    await browser.close();

    console.log(`Captured ${frames.length} total frames!`);

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

    console.log('[5/5] Encoding Mobile HD MP4 with FFmpeg (Retina 780x1688, 30fps)...');
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
        console.log(`🎉 MOBILE HOME PROOF VIDEO RECORDED SUCCESSFULLY!`);
        console.log(`Local Path: ${outputFile}`);
        console.log(`Downloads:  ${downloadsFile}`);
        console.log(`Size:       ${mb} MB`);
        console.log(`========================================================\n`);
    } else {
        console.error('Encoding error:', encRes.stderr);
    }
}

main().catch(console.error);
