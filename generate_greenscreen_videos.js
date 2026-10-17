const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');

const appDir = path.join('C:', 'Users', 'ajom7', 'Downloads', 'TPR', 'JMJ_App');
const downloadsDir = path.join('C:', 'Users', 'ajom7', 'Downloads');
const assetsDir = path.join(appDir, 'public', 'assets');
const b64Logo = fs.readFileSync(path.join(assetsDir, 'bkash.png')).toString('base64');

// HTML 1: Realistic Phone Mockup on Green Screen
const phoneHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Phone bKash Green Screen</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: #00FF00; /* Pure Chroma Key Green */
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    /* Modern Premium Smartphone Frame */
    .phone-wrapper {
      width: 780px;
      height: 1600px;
      background: #111827;
      border-radius: 76px;
      padding: 16px;
      box-shadow: 
        0 40px 100px rgba(0, 0, 0, 0.7),
        0 15px 35px rgba(0, 0, 0, 0.5),
        inset 0 0 0 4px #334155,
        inset 0 0 0 7px #0f172a;
      position: relative;
    }

    /* Screen Inside Phone */
    .phone-screen {
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 60%, #020617 100%);
      border-radius: 62px;
      overflow: hidden;
      position: relative;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Dynamic Island Pill */
    .dynamic-island {
      position: absolute;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      height: 48px;
      background: #000000;
      border-radius: 28px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 18px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    }
    .camera-lens {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #1e293b, #050b14);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    /* Status Bar */
    .status-bar {
      height: 70px;
      padding: 24px 44px 0 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      z-index: 999;
      position: relative;
    }
    .status-icons {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
    }

    /* Lock Screen Clock & Date */
    .clock-widget {
      text-align: center;
      margin-top: 60px;
    }
    .clock-date {
      font-size: 22px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .clock-time {
      font-size: 110px;
      font-weight: 800;
      letter-spacing: -3px;
      line-height: 1;
      color: #f8fafc;
      text-shadow: 0 8px 30px rgba(0,0,0,0.5);
    }

    /* bKash Heads-up Notification Card */
    #bkash-card {
      position: absolute;
      top: -260px; /* Hidden above */
      left: 20px;
      right: 20px;
      background: #ffffff;
      border-radius: 32px;
      padding: 24px 26px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1.5px solid rgba(226, 19, 110, 0.2);
      z-index: 2000;
      display: flex;
      gap: 20px;
      align-items: flex-start;
      color: #0f172a;
    }

    .bkash-logo-box {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: #ffffff;
      border: 2px solid rgba(226, 19, 110, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 6px 18px rgba(226, 19, 110, 0.18);
      padding: 6px;
    }
    .bkash-logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .notif-title {
      font-size: 26px;
      font-weight: 800;
      color: #E2136E;
      letter-spacing: -0.3px;
    }
    .notif-time {
      font-size: 17px;
      font-weight: 600;
      color: #64748b;
    }
    .notif-body {
      font-size: 23px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      margin-bottom: 6px;
    }
    .notif-sub {
      font-size: 15px;
      color: #475569;
      font-family: 'JetBrains Mono', monospace;
      line-height: 1.4;
      white-space: nowrap;
    }

    /* Forced repaint anchor for 60fps CDP capture */
    #repaint-anchor {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 2px;
      height: 2px;
      background: rgba(0, 255, 0, 0.99);
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="repaint-anchor"></div>
  <div class="phone-wrapper">
    <div class="phone-screen">
      <!-- Dynamic Island -->
      <div class="dynamic-island">
        <div class="camera-lens"></div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <span>11:30</span>
        <div class="status-icons">
          <span>5G</span>
          <span>●●●●</span>
          <span>98%</span>
        </div>
      </div>

      <!-- Clock Widget -->
      <div class="clock-widget">
        <div class="clock-date">Monday, 5 October</div>
        <div class="clock-time">11:30</div>
      </div>

      <!-- bKash Heads-Up Card -->
      <div id="bkash-card">
        <div class="bkash-logo-box">
          <img src="data:image/png;base64,${b64Logo}" alt="bKash" />
        </div>
        <div style="flex: 1; min-width: 0;">
          <div class="notif-header">
            <span class="notif-title">bKash</span>
            <span class="notif-time">now</span>
          </div>
          <div class="notif-body">
            You have received <b>Tk 520.00</b> from <b>TPR App</b>.
          </div>
          <div class="notif-sub">
            Fee Tk 0.00. Balance Tk 1,520.00. TrxID 9K3F89LA21 at 05/10/2026 11:30
          </div>
        </div>
      </div>

      <!-- App Dock -->
      <div class="app-dock">
        <div class="dock-btn" style="background: #2563eb;">📞</div>
        <div class="dock-btn" style="background: #10b981;">💬</div>
        <div class="dock-btn" style="background: #ffffff;"><img src="data:image/png;base64,${b64Logo}" style="width: 44px; height: 44px; object-fit: contain;" /></div>
        <div class="dock-btn" style="background: #e11d48;">🎬</div>
      </div>
    </div>
  </div>

  <script>
    let tick = 0;
    function forceRepaint() {
      const a = document.getElementById('repaint-anchor');
      if (a) a.style.opacity = (0.95 + (tick++ % 2) * 0.04).toFixed(3);
      requestAnimationFrame(forceRepaint);
    }
    requestAnimationFrame(forceRepaint);

    function triggerDrop() {
      const card = document.getElementById('bkash-card');
      const startY = -260;
      const targetY = 100;
      const duration = 650;
      const t0 = performance.now();

      function step(now) {
        const elapsed = now - t0;
        const p = Math.min(1, elapsed / duration);
        const ease = Math.sin(-13 * (p + 1) * Math.PI / 2) * Math.pow(2, -10 * p) + 1;
        const currentY = startY + (targetY - startY) * ease;
        card.style.transform = 'translateY(' + (currentY - startY).toFixed(2) + 'px)';
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          card.style.transform = 'translateY(' + (targetY - startY) + 'px)';
        }
      }
      requestAnimationFrame(step);
    }
    window.triggerDrop = triggerDrop;
  </script>
</body>
</html>`;

// HTML 2: Pure Notification Card on Green Screen (Chroma Key Overlay)
const notifHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>bKash Notification Green Screen</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: #00FF00; /* Pure Chroma Green */
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      overflow: hidden;
      user-select: none;
      position: relative;
    }

    #bkash-notification {
      position: absolute;
      top: -260px;
      left: 5%;
      width: 90%;
      background: #ffffff;
      border-radius: 40px;
      padding: 30px 34px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), 0 6px 20px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(0, 0, 0, 0.06);
      z-index: 9999;
      display: flex;
      gap: 26px;
      align-items: flex-start;
    }

    .bkash-logo-box {
      width: 96px;
      height: 96px;
      border-radius: 26px;
      background: #ffffff;
      border: 2px solid rgba(226, 19, 110, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 8px 22px rgba(226, 19, 110, 0.22);
      padding: 8px;
    }
    .bkash-logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .notif-title {
      font-size: 34px;
      font-weight: 800;
      color: #E2136E;
      letter-spacing: -0.5px;
    }
    .notif-time {
      font-size: 22px;
      font-weight: 600;
      color: #64748b;
    }
    .notif-body {
      font-size: 29px;
      color: #0f172a;
      line-height: 1.35;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .notif-sub {
      font-size: 17px;
      color: #475569;
      line-height: 1.45;
      font-family: 'JetBrains Mono', monospace;
      white-space: nowrap;
    }

    #repaint-anchor {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 2px;
      height: 2px;
      background: rgba(0, 255, 0, 0.99);
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div id="repaint-anchor"></div>
  <div id="bkash-notification">
    <div class="bkash-logo-box">
      <img src="data:image/png;base64,${b64Logo}" alt="bKash" />
    </div>
    <div style="flex: 1; min-width: 0;">
      <div class="notif-header">
        <div class="notif-title">bKash</div>
        <span class="notif-time">now</span>
      </div>
      <div class="notif-body">
        You have received <b>Tk 520.00</b> from <b>TPR App</b>.
      </div>
      <div class="notif-sub">
        Fee Tk 0.00. Balance Tk 1,520.00. TrxID 9K3F89LA21 at 05/10/2026 11:30
      </div>
    </div>
  </div>

  <script>
    let tick = 0;
    function forceRepaint() {
      const a = document.getElementById('repaint-anchor');
      if (a) a.style.opacity = (0.95 + (tick++ % 2) * 0.04).toFixed(3);
      requestAnimationFrame(forceRepaint);
    }
    requestAnimationFrame(forceRepaint);

    function triggerDrop() {
      const notif = document.getElementById('bkash-notification');
      const duration = 650;
      const startY = -260;
      const targetY = 90;
      const t0 = performance.now();

      function frame(now) {
        const elapsed = now - t0;
        const p = Math.min(1, elapsed / duration);
        const ease = Math.sin(-13 * (p + 1) * Math.PI / 2) * Math.pow(2, -10 * p) + 1;
        const currentY = startY + (targetY - startY) * ease;
        notif.style.transform = 'translateY(' + (currentY - startY).toFixed(2) + 'px)';
        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          notif.style.transform = 'translateY(' + (targetY - startY) + 'px)';
        }
      }
      requestAnimationFrame(frame);
    }
    window.triggerDrop = triggerDrop;
  </script>
</body>
</html>`;

const phoneHtmlPath = path.join(appDir, 'public', 'phone_greenscreen.html');
const notifHtmlPath = path.join(appDir, 'public', 'notif_greenscreen.html');

fs.writeFileSync(phoneHtmlPath, phoneHtmlContent, 'utf8');
fs.writeFileSync(notifHtmlPath, notifHtmlContent, 'utf8');
console.log('Generated HTML files successfully!');

async function recordHtmlToMp4(htmlPath, outLocalMp4, outDownloadsMp4, previewJpg) {
  const tmpFramesDir = path.join(appDir, 'temp_frames_' + Date.now());
  if (fs.existsSync(tmpFramesDir)) fs.rmSync(tmpFramesDir, { recursive: true, force: true });
  fs.mkdirSync(tmpFramesDir, { recursive: true });

  const frames = [];
  let frameIndex = 0;

  console.log(`Starting record for: ${path.basename(outLocalMp4)}...`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1080,1920',
      '--disable-web-security',
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

  const client = await page.target().createCDPSession();

  client.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frameIndex++;
    const fPath = path.join(tmpFramesDir, `f_${String(frameIndex).padStart(6, '0')}.jpg`);
    fs.writeFileSync(fPath, Buffer.from(data, 'base64'));
    frames.push({
      path: fPath,
      timestamp: metadata.timestamp,
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
    everyNthFrame: 1,
  });

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load' });

  // Ticker for smooth compositor frames
  await page.evaluate(() => {
    let tick = 0;
    function ticker() {
      document.documentElement.style.setProperty('--tick', (tick++) % 100);
      requestAnimationFrame(ticker);
    }
    requestAnimationFrame(ticker);
  });

  // Hold initial screen 1.5s
  await wait(1500);

  // Trigger smooth drop
  await page.evaluate(() => {
    if (window.triggerDrop) window.triggerDrop();
  });

  // Hold card on screen for 6.5s
  await wait(6500);

  // Take preview screenshot
  if (previewJpg) {
    await page.screenshot({ path: previewJpg, quality: 90, type: 'jpeg' });
  }

  await client.send('Page.stopScreencast');
  await wait(300);
  await browser.close();

  console.log(`Captured ${frames.length} frames.`);

  // Build concat.txt
  const concatLines = [];
  for (let i = 0; i < frames.length; i++) {
    const cur = frames[i];
    const next = frames[i + 1];
    let duration = next ? (next.timestamp - cur.timestamp) : 6.5;
    if (duration <= 0.001) duration = 0.033;
    if (duration > 6.5) duration = 6.5;
    concatLines.push(`file '${path.basename(cur.path)}'`);
    concatLines.push(`duration ${duration.toFixed(4)}`);
  }
  concatLines.push(`file '${path.basename(frames[frames.length - 1].path)}'`);

  const concatPath = path.join(tmpFramesDir, 'concat.txt');
  fs.writeFileSync(concatPath, concatLines.join('\n'));

  // Encode with FFmpeg
  console.log('Encoding with FFmpeg...');
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
    outLocalMp4,
  ], { cwd: tmpFramesDir, encoding: 'utf8' });

  if (fs.existsSync(outLocalMp4)) {
    fs.copyFileSync(outLocalMp4, outDownloadsMp4);
    const szMb = (fs.statSync(outDownloadsMp4).size / (1024 * 1024)).toFixed(2);
    console.log(`Saved: ${outDownloadsMp4} (${szMb} MB)`);
  }

  // Cleanup temporary frames
  fs.rmSync(tmpFramesDir, { recursive: true, force: true });
}

async function main() {
  // 1. Phone mockup on green screen
  const phoneLocalMp4 = path.join(appDir, 'phone_bkash_greenscreen.mp4');
  const phoneDownMp4 = path.join(downloadsDir, 'phone_bkash_greenscreen.mp4');
  const phonePreview = path.join(appDir, 'phone_bkash_preview.jpg');
  await recordHtmlToMp4(phoneHtmlPath, phoneLocalMp4, phoneDownMp4, phonePreview);

  // 2. Direct Notification Card overlay on green screen
  const notifLocalMp4 = path.join(appDir, 'tpr_bkash_capcut_greenscreen.mp4');
  const notifDownMp4 = path.join(downloadsDir, 'tpr_bkash_capcut_greenscreen.mp4');
  const notifPreview = path.join(appDir, 'notif_bkash_preview.jpg');
  await recordHtmlToMp4(notifHtmlPath, notifLocalMp4, notifDownMp4, notifPreview);

  console.log('ALL GREEN SCREEN VIDEOS CREATED SUCCESSFULLY!');
}

main().catch(console.error);
