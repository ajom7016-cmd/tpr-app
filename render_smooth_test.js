const fs = require('fs');
const path = require('path');
const puppeteer = require('./node_modules/puppeteer-core');
const ffmpeg = require('./node_modules/@ffmpeg-installer/ffmpeg');
const { spawnSync } = require('child_process');

const appDir = path.join('C:', 'Users', 'ajom7', 'Downloads', 'TPR', 'JMJ_App');
const downloadsDir = path.join('C:', 'Users', 'ajom7', 'Downloads');
const assetsDir = path.join(appDir, 'public', 'assets');
const b64Logo = fs.readFileSync(path.join(assetsDir, 'bkash.png')).toString('base64');

// HTML for Smooth Phone on Green Screen
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0">
  <title>Butter Smooth Phone bKash</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1920px;
      background: #00FF00; /* Pure Chroma Green */
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

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

    .clock-widget {
      text-align: center;
      margin-top: 165px;
    }
    .clock-date {
      font-size: 22px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .clock-time {
      font-size: 100px;
      font-weight: 800;
      letter-spacing: -3px;
      line-height: 1;
      color: #f8fafc;
      text-shadow: 0 8px 30px rgba(0,0,0,0.5);
    }

    #bkash-card {
      position: absolute;
      top: -260px;
      left: 20px;
      right: 20px;
      background: #ffffff;
      border-radius: 32px;
      padding: 22px 24px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.2);
      border: 1.5px solid rgba(226, 19, 110, 0.2);
      z-index: 2000;
      display: flex;
      gap: 18px;
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
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      margin-bottom: 5px;
    }
    .notif-sub {
      font-size: 14.5px;
      color: #475569;
      font-family: 'JetBrains Mono', monospace;
      line-height: 1.4;
      white-space: nowrap;
    }

    .app-dock {
      position: absolute;
      bottom: 40px;
      left: 30px;
      right: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border-radius: 36px;
      padding: 16px 28px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .dock-btn {
      width: 68px;
      height: 68px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
  </style>
</head>
<body>
  <div class="phone-wrapper">
    <div class="phone-screen">
      <div class="dynamic-island"><div class="camera-lens"></div></div>
      <div class="status-bar">
        <span>11:30</span>
        <div class="status-icons"><span>5G</span><span>●●●●</span><span>98%</span></div>
      </div>
      <div class="clock-widget">
        <div class="clock-date">Monday, 5 October</div>
        <div class="clock-time">11:30</div>
      </div>
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
      <div class="app-dock">
        <div class="dock-btn" style="background: #2563eb;">📞</div>
        <div class="dock-btn" style="background: #10b981;">💬</div>
        <div class="dock-btn" style="background: #ffffff;"><img src="data:image/png;base64,${b64Logo}" style="width: 44px; height: 44px; object-fit: contain;" /></div>
        <div class="dock-btn" style="background: #e11d48;">🎬</div>
      </div>
    </div>
  </div>

  <script>
    window.setCardPosition = function(topPx) {
      const card = document.getElementById('bkash-card');
      card.style.top = topPx + 'px';
    };
  </script>
</body>
</html>`;

const htmlFilePath = path.join(appDir, 'public', 'smooth_phone.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

async function main() {
  const framesDir = path.join(appDir, 'frames_smooth');
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

  // 1. Initial State (Hidden above)
  console.log('[2/4] Capturing Initial Frame...');
  await page.evaluate(() => window.setCardPosition(-260));
  const startFrame = path.join(framesDir, 'frame_start.jpg');
  await page.screenshot({ path: startFrame, type: 'jpeg', quality: 95 });

  // 2. Drop Animation (48 frames @ 60fps = 0.8s silky smooth with easeOutBack overshoot)
  const totalDropFrames = 48;
  const startY = -260;
  const targetY = 90;

  function easeOutBack(x) {
    const c1 = 1.25;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  console.log(`[3/4] Rendering ${totalDropFrames} butter-smooth animation frames...`);
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

  // 3. Final State (Landed perfectly)
  await page.evaluate((y) => window.setCardPosition(y), targetY);
  const endFrame = path.join(framesDir, 'frame_end.jpg');
  await page.screenshot({ path: endFrame, type: 'jpeg', quality: 95 });

  // Save preview image for user verification
  const previewPath = path.join(downloadsDir, 'phone_bkash_preview.jpg');
  fs.copyFileSync(endFrame, previewPath);

  await browser.close();
  console.log('All individual frames captured with 100% precision!');

  // Build concat file with exact timestamps
  console.log('[4/4] Encoding Constant 60 FPS MP4 with FFmpeg...');
  const concatLines = [];
  
  // Hold initial state for 1.2 seconds
  concatLines.push(`file 'frame_start.jpg'`);
  concatLines.push(`duration 1.200000`);

  // Each drop frame for exactly 1/60th of a second
  for (const fn of dropFiles) {
    concatLines.push(`file '${fn}'`);
    concatLines.push(`duration 0.016667`);
  }

  // Hold final state for 6.5 seconds
  concatLines.push(`file 'frame_end.jpg'`);
  concatLines.push(`duration 6.500000`);
  concatLines.push(`file 'frame_end.jpg'`);

  const concatPath = path.join(framesDir, 'concat.txt');
  fs.writeFileSync(concatPath, concatLines.join('\n'));

  const outputLocal = path.join(appDir, 'phone_bkash_greenscreen.mp4');
  const outputDownloads = path.join(downloadsDir, 'phone_bkash_greenscreen.mp4');

  // FFmpeg command ensuring strictly Constant 60 FPS, YUV420P, High Profile
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
