const fs = require('fs');
const path = require('path');
const puppeteer = require('./node_modules/puppeteer-core');

const appDir = path.join('C:', 'Users', 'ajom7', 'Downloads', 'TPR', 'JMJ_App');
const downloadsDir = path.join('C:', 'Users', 'ajom7', 'Downloads');
const brainDir = path.join('C:', 'Users', 'ajom7', '.gemini', 'antigravity', 'brain', 'd4755013-1434-4938-8116-d1b6a02bbf20');

// Concept 4: Geometric Cyber Gold Hexagon / Diamond Crest Monogram
const concept4Html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Plus+Jakarta+Sans:wght@800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1024px;
      height: 1024px;
      background: #090d16;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .tile {
      width: 820px;
      height: 820px;
      background: radial-gradient(circle at 35% 30%, #1e293b 0%, #0f172a 60%, #020617 100%);
      border-radius: 190px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 40px 100px rgba(0,0,0,0.85),
        0 15px 35px rgba(0,0,0,0.5),
        inset 0 1px 2px rgba(255,255,255,0.25),
        inset 0 -2px 4px rgba(0,0,0,0.8);
      border: 3px solid rgba(255,255,255,0.06);
      position: relative;
    }
    .glow {
      position: absolute;
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(226, 19, 110, 0.12) 40%, transparent 70%);
      filter: blur(40px);
    }
    svg {
      width: 580px;
      height: 580px;
      filter: drop-shadow(0 25px 40px rgba(0, 0, 0, 0.7)) drop-shadow(0 4px 12px rgba(245, 158, 11, 0.35));
    }
  </style>
</head>
<body>
  <div class="tile">
    <div class="glow"></div>
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldLinear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF4D0" />
          <stop offset="25%" stop-color="#F5BA42" />
          <stop offset="55%" stop-color="#D98218" />
          <stop offset="85%" stop-color="#FBD97A" />
          <stop offset="100%" stop-color="#B26309" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFE494" />
          <stop offset="100%" stop-color="#D97706" />
        </linearGradient>
      </defs>

      <!-- Outer Beveled Shield / Crest Frame -->
      <polygon points="200,28 350,105 350,265 200,368 50,265 50,105" 
               fill="url(#shieldGrad)" stroke="url(#goldLinear)" stroke-width="12" stroke-linejoin="round" />
      <polygon points="200,48 332,116 332,254 200,346 68,254 68,116" 
               fill="#0A101D" stroke="rgba(245, 186, 66, 0.3)" stroke-width="3" stroke-linejoin="round" />

      <!-- Minimalist Crown Peaks at Crest -->
      <path d="M140,118 L165,150 L200,100 L235,150 L260,118 L250,172 L150,172 Z" 
            fill="url(#goldLinear)" />

      <!-- Interlocked Modern Typography 'TPR' -->
      <!-- T Bar -->
      <rect x="110" y="185" width="180" height="26" rx="10" fill="url(#goldLinear)" />
      <!-- T Stem / P & R Spine -->
      <rect x="187" y="185" width="26" height="135" rx="10" fill="url(#goldLinear)" />

      <!-- P Loop -->
      <path d="M187,185 L242,185 C268,185 288,202 288,228 C288,254 268,271 242,271 L187,271" 
            stroke="url(#goldLinear)" stroke-width="26" stroke-linecap="round" fill="none" />

      <!-- R Diagonal Kick -->
      <path d="M228,260 L278,320" 
            stroke="url(#goldLinear)" stroke-width="26" stroke-linecap="round" />

      <!-- Center Prestige Star Emblem -->
      <polygon points="200,70 205,82 218,85 208,93 211,105 200,98 189,105 192,93 182,85 195,82" 
               fill="#FFFDF0" />
    </svg>
  </div>
</body>
</html>`;

// Concept 5: Minimalist Royal Crown Emblem (Sleek Apple iOS 18 Design Award Winner)
const concept5Html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1024px;
      height: 1024px;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .tile {
      width: 820px;
      height: 820px;
      background: linear-gradient(145deg, #1e1b4b 0%, #0f172a 50%, #020617 100%);
      border-radius: 190px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 40px 110px rgba(0,0,0,0.9),
        0 15px 35px rgba(0,0,0,0.6),
        inset 0 1px 2px rgba(255,255,255,0.3),
        inset 0 -2px 5px rgba(0,0,0,0.8);
      border: 3px solid rgba(255,255,255,0.08);
      position: relative;
    }
    .glow {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(245, 158, 11, 0.2) 45%, transparent 75%);
      filter: blur(50px);
    }
    svg {
      width: 540px;
      height: 540px;
      filter: drop-shadow(0 25px 45px rgba(0, 0, 0, 0.75)) drop-shadow(0 4px 18px rgba(245, 158, 11, 0.4));
    }
  </style>
</head>
<body>
  <div class="tile">
    <div class="glow"></div>
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFEBB0" />
          <stop offset="25%" stop-color="#F5BA42" />
          <stop offset="60%" stop-color="#D97706" />
          <stop offset="85%" stop-color="#FCD34D" />
          <stop offset="100%" stop-color="#92400E" />
        </linearGradient>
        <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C084FC" />
          <stop offset="100%" stop-color="#7E22CE" />
        </linearGradient>
      </defs>

      <!-- 3 Sleek Royal Arch Crowns forming T, P, R geometry -->
      <!-- Center Peak -->
      <path d="M200,50 L225,120 L175,120 Z" fill="url(#crownGold)" />
      <!-- Left Wing -->
      <path d="M125,85 L160,135 L115,145 Z" fill="url(#crownGold)" />
      <!-- Right Wing -->
      <path d="M275,85 L285,145 L240,135 Z" fill="url(#crownGold)" />

      <!-- Royal Arch Base -->
      <path d="M100,160 Q200,140 300,160 L295,185 Q200,165 105,185 Z" fill="url(#crownGold)" />

      <!-- Minimalist Bold Monogram TPR -->
      <g transform="translate(0, 20)">
        <!-- T -->
        <rect x="75" y="195" width="80" height="20" rx="8" fill="url(#crownGold)" />
        <rect x="105" y="195" width="20" height="100" rx="8" fill="url(#crownGold)" />

        <!-- P -->
        <rect x="175" y="195" width="20" height="100" rx="8" fill="url(#crownGold)" />
        <path d="M185,195 L220,195 C240,195 255,208 255,228 C255,248 240,260 220,260 L185,260" 
              stroke="url(#crownGold)" stroke-width="20" stroke-linecap="round" fill="none" />

        <!-- R -->
        <rect x="270" y="195" width="20" height="100" rx="8" fill="url(#crownGold)" />
        <path d="M280,195 L310,195 C328,195 340,207 340,224 C340,240 328,250 310,250 L280,250" 
              stroke="url(#crownGold)" stroke-width="20" stroke-linecap="round" fill="none" />
        <path d="M305,245 L335,295" stroke="url(#crownGold)" stroke-width="20" stroke-linecap="round" />
      </g>

      <!-- Royal Diamond Accent at Center -->
      <polygon points="200,325 212,340 200,355 188,340" fill="#FDE68A" />
    </svg>
  </div>
</body>
</html>`;

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1024,1024']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 1 });

  // Render Concept 4
  console.log('Rendering Concept 4...');
  await page.setContent(concept4Html);
  const c4Path = path.join(downloadsDir, 'tpr_logo_concept_4_cyber_shield.png');
  const c4Brain = path.join(brainDir, 'tpr_logo_concept_4_cyber_shield.png');
  await page.screenshot({ path: c4Path, type: 'png' });
  fs.copyFileSync(c4Path, c4Brain);

  // Render Concept 5
  console.log('Rendering Concept 5...');
  await page.setContent(concept5Html);
  const c5Path = path.join(downloadsDir, 'tpr_logo_concept_5_royal_crest.png');
  const c5Brain = path.join(brainDir, 'tpr_logo_concept_5_royal_crest.png');
  await page.screenshot({ path: c5Path, type: 'png' });
  fs.copyFileSync(c5Path, c5Brain);

  await browser.close();
  console.log('Concepts 4 and 5 rendered successfully in 1024x1024 HD!');
}

main().catch(console.error);
