const fs = require('fs');
const path = require('path');

const downloadsDir = path.join('C:', 'Users', 'ajom7', 'Downloads');

function toBase64(filename) {
  const p = path.join(downloadsDir, filename);
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(p).toString('base64');
  return `data:${mime};base64,${data}`;
}

const img1 = toBase64('tpr_logo_concept_1_royal_gold.jpg');
const img2 = toBase64('tpr_logo_concept_2_glass_titanium.jpg');
const img3 = toBase64('tpr_logo_concept_3_golden_ribbon.jpg');
const img4 = toBase64('tpr_logo_concept_4_cyber_shield.png');
const img5 = toBase64('tpr_logo_concept_5_royal_crest.png');

const html = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TPR App - ৫টি প্রিমিয়াম লোগো কালেকশন</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Hind+Siliguri:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090d16;
      color: #f8fafc;
      font-family: 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif;
      padding: 40px 20px 80px 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .badge {
      display: inline-block;
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    p.subtitle {
      color: #94a3b8;
      font-size: 17px;
      max-width: 700px;
      margin: 0 auto;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 30px;
    }
    .card {
      background: #111827;
      border-radius: 28px;
      padding: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.15);
    }
    .img-wrapper {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 20px;
      overflow: hidden;
      background: #000;
      margin-bottom: 20px;
      position: relative;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
    }
    .img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }
    .card:hover .img-wrapper img {
      transform: scale(1.03);
    }
    .card-num {
      font-size: 13px;
      font-weight: 700;
      color: #fbbf24;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .card-title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .card-desc {
      color: #94a3b8;
      font-size: 14.5px;
      line-height: 1.5;
      margin-bottom: 18px;
      flex-grow: 1;
    }
    .tag-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tag {
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">👑 TPR Official Logo Collection</div>
      <h1>৫টি প্রিমিয়াম লোগো কালেকশন</h1>
      <p class="subtitle">আপনার পছন্দ অনুযায়ী <b>পেটের কোনো চিহ্ন ছাড়াই</b>, ১০০% খাঁটি রাজকীয় ও লাক্সারি ফিনটেক ব্র্যান্ডিং দিয়ে তৈরি ৫টি ৩ডি লোগো নিচে দেখুন।</p>
    </div>

    <div class="grid">
      <!-- 1 -->
      <div class="card">
        <div class="img-wrapper">
          <img src="${img1}" alt="Concept 1" />
        </div>
        <div class="card-num">কনসেপ্ট ১</div>
        <div class="card-title">রয়্যাল গোল্ড ক্রাউন ও শিল্ড</div>
        <div class="card-desc">খোদাই করা ২৪ ক্যারেট শ্যাম্পেন গোল্ডের রাজকীয় মুকুট এবং মেটালিক অবসিডিয়ান শিল্ডে নিখুঁত TPR মনোগ্রাম। সুইস ব্যাংক ও লাক্সারি ভিআইপি স্টাইল।</div>
        <div class="tag-row">
          <span class="tag">#24kGold</span>
          <span class="tag">#RoyalShield</span>
          <span class="tag">#VIP</span>
        </div>
      </div>

      <!-- 2 -->
      <div class="card">
        <div class="img-wrapper">
          <img src="${img2}" alt="Concept 2" />
        </div>
        <div class="card-num">কনসেপ্ট ২</div>
        <div class="card-title">ভিশন-ওএস গ্লাস ও টাইটানিয়াম</div>
        <div class="card-desc">ফ্রস্টেড অপটিক্যাল ক্রিস্টাল গ্লাস ও পালিশ করা ক্রোম টাইটানিয়ামে তৈরি আধুনিক TPR লেটারমার্ক। হালকা রংধনু আলোর প্রতিফলন যুক্ত অ্যাপল স্টাইল।</div>
        <div class="tag-row">
          <span class="tag">#VisionOS</span>
          <span class="tag">#Glassmorphic</span>
          <span class="tag">#FutureTech</span>
        </div>
      </div>

      <!-- 3 -->
      <div class="card">
        <div class="img-wrapper">
          <img src="${img3}" alt="Concept 3" />
        </div>
        <div class="card-num">কনসেপ্ট ৩</div>
        <div class="card-title">৩ডি ভাস্কর্য গোল্ডেন রিবন</div>
        <div class="card-desc">একটি অবিচ্ছিন্ন সোনালী ৩ডি রিবন দিয়ে পেঁচিয়ে তৈরি অত্যাধুনিক TPR মনোগ্রাম। মিডনাইট-নেভি টাইলসে খাঁটি বিলিয়নিয়ার ইনভেস্টমেন্ট অ্যাপের মতো লুক।</div>
        <div class="tag-row">
          <span class="tag">#SculpturalGold</span>
          <span class="tag">#LuxuryFintech</span>
          <span class="tag">#Elite</span>
        </div>
      </div>

      <!-- 4 -->
      <div class="card">
        <div class="img-wrapper">
          <img src="${img4}" alt="Concept 4" />
        </div>
        <div class="card-num">কনসেপ্ট ৪</div>
        <div class="card-title">সাইবার গোল্ড হেক্সাগন শিল্ড</div>
        <div class="card-desc">আধুনিক জ্যামিতিক হেক্সাগন গোল্ডেন ফ্রেমের ভেতর রাজকীয় মুকুটের চূড়া এবং ইন্টারলকড টাইপোগ্রাফি। ক্রিপ্টো ও সিকিউর ফিনটেক প্ল্যাটফর্মের জন্য আদর্শ।</div>
        <div class="tag-row">
          <span class="tag">#HexagonShield</span>
          <span class="tag">#CyberGold</span>
          <span class="tag">#Geometric</span>
        </div>
      </div>

      <!-- 5 -->
      <div class="card">
        <div class="img-wrapper">
          <img src="${img5}" alt="Concept 5" />
        </div>
        <div class="card-num">কনসেপ্ট ৫</div>
        <div class="card-title">মিনিমালিস্ট রয়্যাল ক্রাউন</div>
        <div class="card-desc">অ্যাপল ডিজাইন অ্যাওয়ার্ড উইনার স্টাইলে ৩-শীর্ষ মিনিমালিস্ট মুকুট ও আধুনিক বোল্ড গোল্ডেন TPR টাইপোগ্রাফি। অত্যন্ত পরিষ্কার ও দূর থেকে চেনার উপযোগী।</div>
        <div class="tag-row">
          <span class="tag">#Minimalist</span>
          <span class="tag">#ModernCrown</span>
          <span class="tag">#CleanVector</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

const outPath = path.join(downloadsDir, 'tpr_logo_showcase.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Saved showcase HTML to:', outPath);
