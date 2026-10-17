const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// The exact HTML to inject
const newModal = `modal.innerHTML = \`
    <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.3); border-radius: 24px; padding: 30px 20px; width: 90%; max-width: 340px; text-align: center; transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="margin: 0 auto 20px auto; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.2); color: #fff;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
        </div>
        <h3 style="font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #ffffff; font-family: sans-serif;">Low Balance</h3>
        <p style="color: #e2e8f0; font-size: 14px; line-height: 1.5; margin-bottom: 25px; font-family: sans-serif;">\${data.message}</p>
        <button id="recharge-now-btn" style="width: 100%; padding: 16px; border-radius: 99px; font-weight: 800; font-size: 16px; border: none; cursor: pointer; background: rgba(255,255,255,0.9); color: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Add Funds</button>
        <button id="cancel-recharge-btn" style="background: transparent; color: #ffffff; margin-top: 15px; font-weight: 600; font-size: 15px; border: none; cursor: pointer;">Cancel</button>
    </div>
\`;`;

// Replace the existing modal.innerHTML
const regex = /modal\.innerHTML\s*=\s*`[\s\S]*?`;/g;
content = content.replace(regex, newModal);
fs.writeFileSync(file, content);
console.log('Applied exact Vision Pro UI without any over-smartness');
