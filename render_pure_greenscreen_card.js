const fs = require('fs');
const path = require('path');
const puppeteer = require('./node_modules/puppeteer-core');
const ffmpeg = require('./node_modules/@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');

const appDir = path.join('C:', 'Users', 'ajom7', 'Downloads', 'TPR', 'JMJ_App');
const downloadsDir = path.join('C:', 'Users', 'ajom7', 'Downloads');
const assetsDir = path.join(appDir, 'public', 'assets');
const b64Logo = fs.readFileSync(path.join(assetsDir, 'bkash.png')).toString('base64');

// Pure Chroma Green HTML with ONLY the bKash Notification Card
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Pure Green Screen bKash Card</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: #00FF00; /* Pure Chroma Key Green for CapCut */
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      overflow: hidden;
      user-select: none;
      position: relative;
    }

    #bkash-notification {
      position: absolute;
      top: -300px; /* Off-screen initial */
      left: 50px;
      right: 50px;
      background: #ffffff;
      border-radius: 40px;
      padding: 30px 34px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), 0 6px 20px rgba(0, 0, 0, 0.2);
      border: 2px solid rgba(0, 0, 0, 0.05);
      z-index: 9999;
      display: flex;
      gap: 24px;
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
      font-size: 30px;
      color: #0f172a;
      line-height: 1.35;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .notif-sub {
      font-size: 18.5px;
      color: #475569;
      line-height: 1.45;
      font-family: 'JetBrains Mono', monospace;
      white-space: nowrap;
    }
  </style>
</head>
<body>
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
        You have received <b>Tk 150.00</b> from <b>TPR App</b>.
      </div>
      <div class="notif-sub">
        Fee Tk 0.00. Balance Tk 1,150.00. TrxID 9K3F89LA21 at 05/10/2026 11:30
      </div>
    </div>
  </div>

  <script>
    window.setCardPosition = function(topPx) {
      const card = document.getElementById('bkash-notification');
      card.style.top = topPx + 'px';
    };
  </script>
</body>
</html>`;

const htmlFilePath = path.join(appDir, 'public', 'pure_card_greenscreen.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

async function main() {
  const framesDir = path.join(appDir, 'frames_pure_card');
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('[1/4] Launching Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1080,1920']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file:///' + htmlFilePath.replace(/\\/g, '/'), { waitUntil: 'load' });

  // 1. Initial State: Card off-screen (-300px)
  console.log('[2/4] Capturing Initial Green Screen Frame...');
  await page.evaluate(() => window.setCardPosition(-300));
  const startFrame = path.join(framesDir, 'frame_start.jpg');
  await page.screenshot({ path: startFrame, type: 'jpeg', quality: 95 });

  // 2. Drop Animation (48 frames @ 60fps = 0.8s silky smooth with natural overshoot)
  const totalDropFrames = 48;
  const startY = -300;
  const targetY = 90;

  function easeOutBack(x) {
    const c1 = 1.25;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  console.log(`[3/4] Rendering ${totalDropFrames} butter-smooth animation frames at 60 FPS...`);
  const dropFiles = [];
  for (let i = 0; i < totalDropFrames; i++) {
    const progress = (i + 1) / totalDropFrames;
    const easeVal = easeOutBack(progress);
    const currentY = startY + (targetY - startY) * easeVal;
    
    await page.evaluate((y) => window.setCardPosition(y), currentY);
    const frameName = `drop_${String(i).padStart(3, '0')}.jpg`;
    const framePath = path.join(framesDir, frameName);
    await page.screenshot({ path: framePath, type: 'jpeg', quality: 95 });
    dropFiles.push(frameName);
  }

  // 3. Final State: Landed cleanly at targetY (90px)
  await page.evaluate((y) => window.setCardPosition(y), targetY);
  const endFrame = path.join(framesDir, 'frame_end.jpg');
  await page.screenshot({ path: endFrame, type: 'jpeg', quality: 95 });

  // Save preview image to Downloads
  const previewPath = path.join(downloadsDir, 'pure_bkash_card_preview.jpg');
  fs.copyFileSync(endFrame, previewPath);

  await browser.close();
  console.log('All individual frames captured with 100% precision!');

  // Build concat file with exact timestamps
  console.log('[4/4] Encoding Constant 60 FPS MP4 with FFmpeg...');
  const concatLines = [];
  
  // Hold empty green screen for 1.2 seconds
  concatLines.push(`file 'frame_start.jpg'`);
  concatLines.push(`duration 1.200000`);

  // Each drop frame for exactly 1/60th of a second (0.016667s)
  for (const fn of dropFiles) {
    concatLines.push(`file '${fn}'`);
    concatLines.push(`duration 0.016667`);
  }

  // Hold final card state for 6.5 seconds
  concatLines.push(`file 'frame_end.jpg'`);
  concatLines.push(`duration 6.500000`);
  concatLines.push(`file 'frame_end.jpg'`);

  const concatPath = path.join(framesDir, 'concat.txt');
  fs.writeFileSync(concatPath, concatLines.join('\n'));

  const outputLocal = path.join(appDir, 'tpr_bkash_capcut_greenscreen.mp4');
  const outputDownloads = path.join(downloadsDir, 'tpr_bkash_capcut_greenscreen.mp4');

  // FFmpeg command strictly Constant 60 FPS, YUV420P
  spawnSync(ffmpeg.path, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat.txt',
    '-vsync', 'cfr',
    '-r', '60',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'slow',
    '-crf', '16',
    outputLocal
  ], { cwd: framesDir, encoding: 'utf8' });

  if (fs.existsSync(outputLocal)) {
    fs.copyFileSync(outputLocal, outputDownloads);
    const sizeMb = (fs.statSync(outputDownloads).size / (1024 * 1024)).toFixed(2);
    console.log(`SUCCESS! Saved: ${outputDownloads} (${sizeMb} MB)`);
  }

  // Cleanup temporary frames directory
  fs.rmSync(framesDir, { recursive: true, force: true });
}

main().catch(console.error);
