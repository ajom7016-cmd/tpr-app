const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_pure_drop');
const outputFile = path.join(__dirname, 'tpr_bkash_pure_drop.mp4');
const downloadsFile = 'C:\\Users\\ajom7\\Downloads\\tpr_bkash_pure_drop.mp4';

if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const frames = [];
let frameIndex = 0;

async function main() {
    console.log('[1/5] Launching Chrome in Mobile Retina 390x844 (780x1688 HD)...');

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

    console.log('[2/5] Activating Screencast Stream...');
    await client.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 95,
        everyNthFrame: 1
    });

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    console.log('[3/5] Navigating to Real Mobile Screen...');
    await page.goto('https://thepetroyal.com/real_bkash_drop.html', { waitUntil: 'networkidle2' });

    // Active 60fps compositor ticker
    await page.evaluate(() => {
        let tick = 0;
        function tickerLoop() {
            document.documentElement.style.setProperty('--frame-tick', (tick++) % 100);
            requestAnimationFrame(tickerLoop);
        }
        requestAnimationFrame(tickerLoop);
    });

    // Hold on clean phone screen for 2.2 seconds
    console.log('Holding on mobile phone screen for 2.2 seconds...');
    await wait(2200);

    // Drop notification smoothly from top
    console.log('[4/5] Dropping authentic bKash notification with spring physics...');
    await page.evaluate(() => {
        if (window.dropNotification) window.dropNotification();
    });

    // Hold notification on screen for 8.5 seconds so viewers can easily read the proof
    console.log('Holding bKash notification for 8.5 seconds for complete proof inspection...');
    await wait(8500);

    // Stop screencast
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
        let duration = next ? (next.timestamp - cur.timestamp) : 8.5;
        if (duration <= 0.001) duration = 0.033;
        if (duration > 8.5) duration = 8.5;
        const relFile = path.basename(cur.path);
        concatLines.push(`file '${relFile}'`);
        concatLines.push(`duration ${duration.toFixed(4)}`);
    }
    const lastFile = path.basename(frames[frames.length - 1].path);
    concatLines.push(`file '${lastFile}'`);

    const concatPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(concatPath, concatLines.join('\n'));

    console.log('[5/5] Encoding Final Ultra-Smooth MP4 Video with FFmpeg (780x1688, 30fps)...');
    const encRes = spawnSync(ffmpeg.path, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '18',
        '-r', '30',
        outputFile
    ], { cwd: tmpDir, encoding: 'utf8' });

    if (fs.existsSync(outputFile)) {
        fs.copyFileSync(outputFile, downloadsFile);
        const mb = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
        console.log(`\n========================================================`);
        console.log(`🎉 PURE BKASH DROP PROOF VIDEO RECORDED SUCCESSFULLY!`);
        console.log(`Local Path: ${outputFile}`);
        console.log(`Downloads:  ${downloadsFile}`);
        console.log(`Size:       ${mb} MB`);
        console.log(`========================================================\n`);
    } else {
        console.error('Encoding error:', encRes.stderr);
    }
}

main().catch(console.error);
