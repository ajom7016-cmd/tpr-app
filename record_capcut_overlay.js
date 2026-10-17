const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_capcut');
const outputFileGreen = path.join(__dirname, 'tpr_bkash_capcut_greenscreen.mp4');
const downloadsFileGreen = 'C:\\Users\\ajom7\\Downloads\\tpr_bkash_capcut_greenscreen.mp4';

const outputFileBlack = path.join(__dirname, 'tpr_bkash_capcut_blackscreen.mp4');
const downloadsFileBlack = 'C:\\Users\\ajom7\\Downloads\\tpr_bkash_capcut_blackscreen.mp4';

async function recordVariant(url, outLocal, outDown) {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.mkdirSync(tmpDir, { recursive: true });
    if (fs.existsSync(outLocal)) fs.unlinkSync(outLocal);

    const frames = [];
    let frameIndex = 0;

    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1080,1920',
            '--disable-web-security'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

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

    await client.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 95,
        maxWidth: 1080,
        maxHeight: 1920,
        everyNthFrame: 1
    });

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Active 60fps compositor ticker
    await page.evaluate(() => {
        let tick = 0;
        function tickerLoop() {
            document.documentElement.style.setProperty('--frame-tick', (tick++) % 100);
            requestAnimationFrame(tickerLoop);
        }
        requestAnimationFrame(tickerLoop);
    });

    // Hold empty screen before drop for 1.5 seconds
    await wait(1500);

    // Drop notification smoothly from top
    await page.evaluate(() => {
        if (window.dropNotification) window.dropNotification();
    });

    // Hold notification for 8.0 seconds so viewers can easily read the proof
    await wait(8000);

    await client.send('Page.stopScreencast');
    await wait(300);
    await browser.close();

    console.log(`Captured ${frames.length} frames for ${path.basename(outLocal)}`);

    // Build relative concat.txt
    const concatLines = [];
    for (let i = 0; i < frames.length; i++) {
        const cur = frames[i];
        const next = frames[i + 1];
        let duration = next ? (next.timestamp - cur.timestamp) : 8.0;
        if (duration <= 0.001) duration = 0.033;
        if (duration > 8.0) duration = 8.0;
        const relFile = path.basename(cur.path);
        concatLines.push(`file '${relFile}'`);
        concatLines.push(`duration ${duration.toFixed(4)}`);
    }
    const lastFile = path.basename(frames[frames.length - 1].path);
    concatLines.push(`file '${lastFile}'`);

    const concatPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(concatPath, concatLines.join('\n'));

    // Encode with FFmpeg
    spawnSync(ffmpeg.path, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '18',
        '-r', '30',
        outLocal
    ], { cwd: tmpDir, encoding: 'utf8' });

    if (fs.existsSync(outLocal)) {
        fs.copyFileSync(outLocal, outDown);
        console.log(`Saved: ${outDown} (${(fs.statSync(outLocal).size / 1024).toFixed(1)} KB)`);
    }
}

async function main() {
    console.log('Recording CapCut Green Screen Overlay (Chroma Key)...');
    await recordVariant('https://thepetroyal.com/capcut_greenscreen.html', outputFileGreen, downloadsFileGreen);

    console.log('Recording CapCut Black Screen Overlay (Blend Filter/Screen)...');
    await recordVariant('https://thepetroyal.com/capcut_blackscreen.html', outputFileBlack, downloadsFileBlack);

    console.log('ALL CAPCUT OVERLAYS RECORDED SUCCESSFULLY!');
}

main().catch(console.error);
