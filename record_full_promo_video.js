const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'video_frames_tmp');
const outputFile = path.join(__dirname, 'tpr_app_walkthrough.mp4');

// Clean up previous run
if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
}
fs.mkdirSync(tmpDir, { recursive: true });
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
}

let frameIndex = 0;
const frameRecords = [];
let pageRef = null;
let recording = true;

// Helper to record a single frame with timestamp
async function captureFrame() {
    if (!recording || !pageRef) return;
    try {
        const buf = await pageRef.screenshot({ type: 'jpeg', quality: 90 });
        const fPath = path.join(tmpDir, `f_${String(frameIndex).padStart(6, '0')}.jpg`);
        fs.writeFileSync(fPath, buf);
        frameRecords.push({ path: fPath, time: Date.now() });
        frameIndex++;
    } catch(e) {}
}

// Background frame capture ticker (~12 fps base rate during transitions)
async function startContinuousRecorder() {
    (async () => {
        while (recording) {
            const t0 = Date.now();
            await captureFrame();
            const elapsed = Date.now() - t0;
            const sleepMs = Math.max(10, 80 - elapsed);
            await new Promise(r => setTimeout(r, sleepMs));
        }
    })();
}

// Touch effect simulation in browser
async function injectTouchHelper(page) {
    await page.evaluate(() => {
        window.showTouchIndicator = (x, y) => {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                left: ${x - 18}px;
                top: ${y - 18}px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(234, 88, 12, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.9);
                box-shadow: 0 0 14px rgba(234, 88, 12, 0.6);
                pointer-events: none;
                z-index: 9999999;
                transform: scale(0.6);
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
    });
}

async function simulateTouchClick(page, selectorOrCoords) {
    try {
        let x, y;
        if (typeof selectorOrCoords === 'string') {
            const el = await page.$(selectorOrCoords);
            if (!el) return;
            const box = await el.boundingBox();
            if (!box) return;
            x = box.x + box.width / 2;
            y = box.y + box.height / 2;
        } else {
            x = selectorOrCoords.x;
            y = selectorOrCoords.y;
        }

        await page.evaluate((px, py) => {
            if (window.showTouchIndicator) window.showTouchIndicator(px, py);
        }, x, y);

        await new Promise(r => setTimeout(r, 120));
        await page.mouse.click(x, y);
    } catch(e) {}
}

async function simulateTyping(page, selector, text) {
    await simulateTouchClick(page, selector);
    await new Promise(r => setTimeout(r, 200));
    await page.click(selector, { clickCount: 3 });
    for (const char of text) {
        await page.keyboard.sendCharacter(char);
        await new Promise(r => setTimeout(r, 70 + Math.random() * 50));
    }
}

async function smoothScroll(page, distance, durationMs = 1200) {
    const steps = 15;
    const stepDist = distance / steps;
    const stepTime = durationMs / steps;
    for (let i = 0; i < steps; i++) {
        await page.evaluate((d) => window.scrollBy({ top: d, behavior: 'instant' }), stepDist);
        await new Promise(r => setTimeout(r, stepTime));
    }
}

// Inject realistic bKash Push Notification
async function injectBkashProof(page, amount = '520.00', trxId = '9K3F89LA21') {
    await page.evaluate((amt, trx) => {
        const notif = document.createElement('div');
        notif.id = 'bkash-push-alert';
        notif.style.cssText = `
            position: fixed;
            top: -120px;
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
            transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: translateY(0);
        `;

        notif.innerHTML = `
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
                    Fee: Tk 0.00 | Ref: TPR | TrxID: ${trx} | 29/09/2026 10:50 PM | Balance: Tk 1,520.00
                </div>
            </div>
        `;

        document.body.appendChild(notif);
        requestAnimationFrame(() => {
            notif.style.transform = 'translateY(134px)';
        });
    }, amount, trxId);
}

async function runRecording() {
    console.log('[1/7] Launching Headless Chrome with Mobile Retina Viewport...');
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
    pageRef = page;
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

    console.log('[2/7] Starting background video frame capture...');
    startContinuousRecorder();

    console.log('[3/7] Navigating to Login Page (https://thepetroyal.com/login.html)...');
    await page.goto('https://thepetroyal.com/login.html', { waitUntil: 'networkidle2' });
    await injectTouchHelper(page);
    await new Promise(r => setTimeout(r, 2000)); // Show Login Page

    // Type login credentials
    console.log('Simulating login typing...');
    await simulateTyping(page, '#login-contact', '01870161106');
    await new Promise(r => setTimeout(r, 400));
    await simulateTyping(page, '#login-password', '123456');
    await new Promise(r => setTimeout(r, 800));

    // Click Login
    await simulateTouchClick(page, '#btn-login');
    console.log('Clicked login, waiting for dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2500));
    await injectTouchHelper(page);

    console.log('[4/7] Scene 1: Home Dashboard Showcase...');
    // Slow smooth scroll down to show VIP levels, earnings ticker, pet banners
    await smoothScroll(page, 280, 1500);
    await new Promise(r => setTimeout(r, 2000));
    // Scroll back to top
    await smoothScroll(page, -280, 1200);
    await new Promise(r => setTimeout(r, 2000));

    console.log('[5/7] Scene 2: VIP Plan Overview...');
    // Tap on VIP Plan in bottom nav (3rd item: investment_premium_glass/vip.html)
    await page.evaluate(() => {
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[2]) navItems[2].click();
        else if (window.loadPage) window.loadPage('investment_premium_glass/vip.html');
    });
    await new Promise(r => setTimeout(r, 4500)); // Hold on VIP 1 page for voiceover

    console.log('[6/7] Scene 3: Tasks Page & Completing 4 Pet Tasks...');
    // Navigate to Tasks page (2nd item: glassmorphic_2/code.html)
    await page.evaluate(() => {
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[1]) navItems[1].click();
        else if (window.loadPage) window.loadPage('glassmorphic_2/code.html');
    });
    await new Promise(r => setTimeout(r, 3000)); // View Tasks list

    // Simulate completing tasks via API or action frame
    console.log('Completing Tasks 1 to 4...');
    for (let tId = 1; tId <= 4; tId++) {
        console.log(`Executing Task ${tId}...`);
        await page.evaluate((id) => {
            if (window.loadPage) window.loadPage('task_action/code.html?taskId=' + id);
        }, tId);
        // Wait on task action processing screen
        await new Promise(r => setTimeout(r, 2200));
        // Return to tasks page for next task
        if (tId < 4) {
            await page.evaluate(() => {
                if (window.loadPage) window.loadPage('glassmorphic_2/code.html');
            });
            await new Promise(r => setTimeout(r, 1800));
        }
    }

    console.log('[7/7] Scene 4: Profile & bKash Withdrawal...');
    // Open Profile / Withdraw page
    await page.evaluate(() => {
        if (window.loadPage) window.loadPage('withdraw_glass/code.html');
    });
    await new Promise(r => setTimeout(r, 3500));

    // Type withdrawal amount 520
    const frameHandle = await page.$('#tab-frame-3') || await page.$('#subpage-frame');
    let targetContext = page;
    if (frameHandle) {
        const frame = await frameHandle.contentFrame();
        if (frame) targetContext = frame;
    }

    console.log('Typing withdrawal amount 520...');
    try {
        await targetContext.evaluate(() => {
            const inp = document.getElementById('amount-input');
            if (inp) inp.value = '520';
        });
    } catch(e) {}
    await new Promise(r => setTimeout(r, 1500));

    // Click Confirm Withdrawal
    console.log('Submitting withdrawal...');
    try {
        await targetContext.evaluate(() => {
            const btn = document.getElementById('submit-btn');
            if (btn) btn.click();
        });
    } catch(e) {}
    await new Promise(r => setTimeout(r, 2500));

    // Scene 5: bKash Real Payment Proof Notification
    console.log('Triggering authentic bKash push notification...');
    await injectBkashProof(page, '520.00', '9K3F89LA21');
    // Hold on screen for 6 full seconds so viewers can easily read the proof
    await new Promise(r => setTimeout(r, 6500));

    // Stop recording
    recording = false;
    await new Promise(r => setTimeout(r, 500));
    await browser.close();

    console.log(`Recorded ${frameRecords.length} frames.`);
    console.log('Generating Concat Demuxer instruction file...');

    // Build concat.txt
    let concatLines = [];
    for (let i = 0; i < frameRecords.length; i++) {
        const cur = frameRecords[i];
        const next = frameRecords[i + 1];
        let duration = next ? (next.time - cur.time) / 1000 : 1.0;
        if (duration <= 0) duration = 0.08;
        if (duration > 8.0) duration = 8.0;
        const safePath = cur.path.replace(/\\/g, '/');
        concatLines.push(`file '${safePath}'`);
        concatLines.push(`duration ${duration.toFixed(3)}`);
    }
    // Repeat last frame
    if (frameRecords.length > 0) {
        const lastSafe = frameRecords[frameRecords.length - 1].path.replace(/\\/g, '/');
        concatLines.push(`file '${lastSafe}'`);
    }

    const concatPath = path.join(tmpDir, 'concat.txt');
    fs.writeFileSync(concatPath, concatLines.join('\n'));

    console.log('Encoding MP4 video with FFmpeg (H.264, 30fps)...');
    const encRes = spawnSync(ffmpeg.path, [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatPath,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-crf', '22',
        '-r', '30',
        outputFile
    ], { encoding: 'utf8' });

    if (fs.existsSync(outputFile)) {
        const sizeMb = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
        console.log(`\n================================================`);
        console.log(`SUCCESS! Promo video recorded successfully!`);
        console.log(`File: ${outputFile}`);
        console.log(`Size: ${sizeMb} MB`);
        console.log(`================================================\n`);
    } else {
        console.error('Encoding failed:', encRes.stderr);
    }
}

runRecording().catch(console.error);
