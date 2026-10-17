const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_screencast');
const outputFile = path.join(__dirname, 'tpr_app_walkthrough.mp4');

// Ensure tmpDir is fresh
if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

const frames = [];

async function main() {
    console.log('[1/8] Starting Chrome for Video Recording (Retina Mobile Viewport 390x844)...');
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

    // Hook CDP Screencast
    const client = await page.target().createCDPSession();
    let frameIndex = 0;

    client.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
        frameIndex++;
        const fPath = path.join(tmpDir, `frame_${String(frameIndex).padStart(6, '0')}.jpg`);
        fs.writeFileSync(fPath, Buffer.from(data, 'base64'));
        frames.push({
            path: fPath,
            timestamp: metadata.timestamp // seconds
        });
        try {
            await client.send('Page.screencastFrameAck', { sessionId });
        } catch(e) {}
    });

    console.log('[2/8] Activating CDP Screencast Stream...');
    await client.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 90,
        everyNthFrame: 1
    });

    // Helper functions
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const injectTouchAndNotification = async () => {
        await page.evaluate(() => {
            window.showTouchIndicator = (x, y) => {
                const dot = document.createElement('div');
                dot.style.cssText = `
                    position: fixed;
                    left: ${x - 20}px;
                    top: ${y - 20}px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(234, 88, 12, 0.45);
                    border: 2px solid rgba(255, 255, 255, 0.95);
                    box-shadow: 0 0 16px rgba(234, 88, 12, 0.7);
                    pointer-events: none;
                    z-index: 99999999;
                    transform: scale(0.5);
                    transition: all 0.35s cubic-bezier(0.1, 0.9, 0.2, 1);
                    opacity: 1;
                `;
                document.body.appendChild(dot);
                requestAnimationFrame(() => {
                    dot.style.transform = 'scale(1.4)';
                    dot.style.opacity = '0';
                });
                setTimeout(() => dot.remove(), 400);
            };

            window.showBkashPush = (amt = '520.00', trx = '9K3F89LA21') => {
                const notif = document.createElement('div');
                notif.id = 'bkash-push-alert';
                notif.style.cssText = `
                    position: fixed;
                    top: 14px;
                    left: 12px;
                    right: 12px;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 13px 16px;
                    box-shadow: 0 16px 36px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08);
                    border: 1px solid rgba(226, 19, 110, 0.3);
                    z-index: 99999999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    display: flex;
                    gap: 13px;
                    align-items: flex-start;
                    animation: slideDownNotification 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                `;

                notif.innerHTML = `
                    <style>
                        @keyframes slideDownNotification {
                            0% { transform: translateY(-130px); opacity: 0; }
                            100% { transform: translateY(0); opacity: 1; }
                        }
                    </style>
                    <div style="width: 44px; height: 44px; border-radius: 12px; background: #E2136E; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(226, 19, 110, 0.35);">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                            <span style="font-weight: 800; font-size: 15px; color: #E2136E; letter-spacing: -0.2px;">bKash</span>
                            <span style="font-size: 11px; font-weight: 700; color: #94a3b8;">now</span>
                        </div>
                        <div style="font-weight: 800; font-size: 13.5px; color: #0f172a; line-height: 1.3; margin-bottom: 3px;">
                            You have received Tk ${amt} from TPR ROYAL.
                        </div>
                        <div style="font-size: 11.5px; color: #475569; line-height: 1.4; word-break: break-all;">
                            Fee: Tk 0.00 | Ref: TPR | TrxID: ${trx} | 29/09/2026 10:55 PM | Balance: Tk 1,520.00
                        </div>
                    </div>
                `;
                document.body.appendChild(notif);
            };
        });
    };

    console.log('[3/8] Navigating to Login Page (https://thepetroyal.com/login.html)...');
    await page.goto('https://thepetroyal.com/login.html', { waitUntil: 'networkidle2' });
    await injectTouchAndNotification();
    await wait(2000);

    // Typing login credentials
    console.log('Typing phone: 01870161106...');
    await page.click('#login-contact');
    await wait(200);
    await page.type('#login-contact', '01870161106', { delay: 90 });
    await wait(400);

    console.log('Typing password: ••••••...');
    await page.click('#login-password');
    await wait(200);
    await page.type('#login-password', '123456', { delay: 90 });
    await wait(800);

    console.log('Clicking Log In button...');
    const btnBox = await (await page.$('#btn-login')).boundingBox();
    if (btnBox) {
        await page.evaluate((x, y) => window.showTouchIndicator(x, y), btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
    }
    await wait(150);
    await page.click('#btn-login');

    // Wait for Dashboard navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 12000 }).catch(() => {});
    await wait(3000);
    await injectTouchAndNotification();

    console.log('[4/8] Scene 1: Home Dashboard Showcase...');
    // Slow smooth scrolling down
    for (let i = 0; i < 15; i++) {
        await page.evaluate(() => window.scrollBy({ top: 20, behavior: 'instant' }));
        await wait(80);
    }
    await wait(2000);
    // Smooth scroll back up
    for (let i = 0; i < 15; i++) {
        await page.evaluate(() => window.scrollBy({ top: -20, behavior: 'instant' }));
        await wait(60);
    }
    await wait(2000);

    console.log('[5/8] Scene 2: VIP Plan Overview (VIP 1 Active)...');
    // Click 3rd nav item (VIP / PLAN)
    await page.evaluate(() => {
        const navs = document.querySelectorAll('.nav-item');
        if (navs[2]) {
            const rect = navs[2].getBoundingClientRect();
            window.showTouchIndicator(rect.x + rect.width / 2, rect.y + rect.height / 2);
            navs[2].click();
        } else if (window.loadPage) {
            window.loadPage('investment_premium_glass/vip.html');
        }
    });
    // Hold on VIP page for 5 seconds
    await wait(5000);

    console.log('[6/8] Scene 3: Tasks Page & Completing 4 Pet Tasks...');
    // Click 2nd nav item (TASKS)
    await page.evaluate(() => {
        const navs = document.querySelectorAll('.nav-item');
        if (navs[1]) {
            const rect = navs[1].getBoundingClientRect();
            window.showTouchIndicator(rect.x + rect.width / 2, rect.y + rect.height / 2);
            navs[1].click();
        } else if (window.loadPage) {
            window.loadPage('glassmorphic_2/code.html');
        }
    });
    await wait(3000);

    // Complete all 4 pet tasks
    for (let id = 1; id <= 4; id++) {
        console.log(`Starting Task ${id}...`);
        await page.evaluate((taskId) => {
            if (window.loadPage) window.loadPage('task_action/code.html?taskId=' + taskId);
        }, id);
        // Processing screen
        await wait(2500);

        if (id < 4) {
            // Return to tasks
            await page.evaluate(() => {
                if (window.loadPage) window.loadPage('glassmorphic_2/code.html');
            });
            await wait(2000);
        }
    }

    console.log('[7/8] Scene 4: Profile Page & bKash Withdrawal...');
    // Open Withdraw Page directly inside iframe / main app
    await page.evaluate(() => {
        if (window.loadPage) window.loadPage('withdraw_glass/code.html');
    });
    await wait(3500);

    // Find the withdraw iframe
    const framesList = page.frames();
    let withdrawFrame = framesList.find(f => f.url().includes('withdraw_glass')) || page;

    console.log('Selecting bKash and typing amount 520...');
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

    console.log('Clicking Confirm Withdrawal button...');
    try {
        await withdrawFrame.evaluate(() => {
            const btn = document.getElementById('submit-btn');
            if (btn) btn.click();
        });
    } catch(e) {}
    await wait(2500);

    console.log('[8/8] Scene 5: Displaying Real bKash Payment Received Proof...');
    await page.evaluate(() => {
        window.showBkashPush('520.00', '9K3F89LA21');
    });
    // Hold bKash push notification for 6.5 seconds so viewers can easily read every word
    await wait(6500);

    // Final hold on Dashboard
    await page.evaluate(() => {
        if (window.loadPage) window.loadPage('glassmorphic_1/code.html');
    });
    await wait(3000);

    console.log('Stopping Screencast...');
    await client.send('Page.stopScreencast');
    await wait(500);
    await browser.close();

    console.log(`Captured ${frames.length} screencast frames!`);

    if (frames.length === 0) {
        console.error('No frames captured!');
        return;
    }

    // Build concat.txt
    console.log('Building concat instruction file...');
    const concatLines = [];
    for (let i = 0; i < frames.length; i++) {
        const cur = frames[i];
        const next = frames[i + 1];
        let duration = next ? (next.timestamp - cur.timestamp) : 1.0;
        if (duration <= 0.001) duration = 0.04; // minimum frame time (~25fps)
        if (duration > 8.0) duration = 8.0;     // cap very long pauses
        const safePath = cur.path.replace(/\\/g, '/');
        concatLines.push(`file '${safePath}'`);
        concatLines.push(`duration ${duration.toFixed(4)}`);
    }
    // Repeat last frame
    const lastSafe = frames[frames.length - 1].path.replace(/\\/g, '/');
    concatLines.push(`file '${lastSafe}'`);

    const concatPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(concatPath, concatLines.join('\n'));

    console.log('Encoding MP4 video with FFmpeg...');
    const encRes = spawnSync(ffmpeg.path, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatPath,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '20',
        '-r', '30',
        outputFile
    ], { encoding: 'utf8' });

    if (fs.existsSync(outputFile)) {
        const stat = fs.statSync(outputFile);
        const mb = (stat.size / (1024 * 1024)).toFixed(2);
        console.log(`\n========================================================`);
        console.log(`🎉 VIDEO RECORDED SUCCESSFULLY!`);
        console.log(`File: ${outputFile}`);
        console.log(`Size: ${mb} MB`);
        console.log(`========================================================\n`);
    } else {
        console.error('Encoding error:', encRes.stderr);
    }
}

main().catch(console.error);
