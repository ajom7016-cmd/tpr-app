const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// The user is complaining the modal is DARK. This is because the overlay container has a dark background.
// We must change the overlay container's background from rgba(0,0,0,0.4) to something light/transparent
content = content.replace(/background:\s*rgba\(0,0,0,0\.4\);/g, 'background: rgba(255, 255, 255, 0.1);');
content = content.replace(/background:\s*rgba\(0,0,0,0\.8\);/g, 'background: rgba(255, 255, 255, 0.1);');

// Make sure the modal itself has a nice frosty white tint so it doesn't look dark
const newModal = `modal.innerHTML = \`
    <div style="background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 15px 35px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.5); border-radius: 28px; padding: 30px 20px; width: 90%; max-width: 340px; text-align: center; transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="margin: 0 auto 20px auto; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.4); color: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.6);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
        </div>
        <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #000;">Low Balance</h3>
        <p style="color: #333; font-size: 15px; line-height: 1.5; margin-bottom: 25px; font-weight: 500;">\${data.message}</p>
        <button id="recharge-now-btn" style="width: 100%; padding: 16px; border-radius: 99px; font-weight: 800; font-size: 16px; border: none; cursor: pointer; background: #fff; color: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">Add Funds</button>
        <button id="cancel-recharge-btn" style="background: transparent; color: #333; margin-top: 15px; font-weight: 700; font-size: 15px; border: none; cursor: pointer;">Cancel</button>
    </div>
\`;`;

const regex = /modal\.innerHTML\s*=\s*`[\s\S]*?`;/g;
content = content.replace(regex, newModal);
fs.writeFileSync(file, content);
console.log('Fixed the dark overlay causing the glass to appear dark');
