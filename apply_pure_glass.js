const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// The Pure "True Glassmorphism" modal (No artificial colors, just frosted glass)
const newModal = `modal.innerHTML = \`
    <div style="background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(40px) saturate(150%); -webkit-backdrop-filter: blur(40px) saturate(150%); border-radius: 28px; padding: 35px 25px; width: 90%; max-width: 340px; text-align: center; transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 25px 50px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.5);">
        
        <div style="position: relative; z-index: 2;">
            <div style="margin: 0 auto 20px auto; width: 68px; height: 68px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.4); color: #1e293b; border: 1px solid rgba(255,255,255,0.7); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
            </div>
            <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #1e293b; font-family: sans-serif; text-shadow: 0 1px 2px rgba(255,255,255,0.5);">Low Balance</h3>
            <p style="color: #475569; font-size: 15px; line-height: 1.5; margin-bottom: 25px; font-family: sans-serif; font-weight: 600;">\${data.message}</p>
            <button id="recharge-now-btn" style="width: 100%; padding: 16px; border-radius: 99px; font-weight: 800; font-size: 16px; border: none; cursor: pointer; background: #ea580c; color: #fff; box-shadow: 0 8px 25px rgba(234, 88, 12, 0.4); transition: transform 0.2s;">Add Funds</button>
            <button id="cancel-recharge-btn" style="background: transparent; color: #64748b; margin-top: 15px; font-weight: 700; font-size: 15px; border: none; cursor: pointer;">Cancel</button>
        </div>
    </div>
\`;`;

// Replace the existing modal.innerHTML
const regex = /modal\.innerHTML\s*=\s*`[\s\S]*?`;/g;
content = content.replace(regex, newModal);
fs.writeFileSync(file, content);
console.log('Applied PURE colorless glassmorphism');
