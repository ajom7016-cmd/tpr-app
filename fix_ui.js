const fs = require('fs');

// 1. Fix server.js Taka sign
const serverFile = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/server.js';
let serverContent = fs.readFileSync(serverFile, 'utf8');
serverContent = serverContent.replace(/message: 'You need .*? to subscribe/, "message: 'You need \\u09F3' + price + ' to subscribe");
fs.writeFileSync(serverFile, serverContent);

// 2. Fix vip.html modal UI (replace FA with inline SVG)
const vipFile = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let vipContent = fs.readFileSync(vipFile, 'utf8');

const oldModal = /modal\.innerHTML = `[\s\S]*?`;/;

const newModal = `modal.innerHTML = \`
    <div style="background: rgba(15, 23, 42, 0.98); border: 1px solid rgba(249, 115, 22, 0.4); border-radius: 24px; padding: 30px 20px; width: 90%; max-width: 340px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7), 0 0 20px rgba(249,115,22,0.2); transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        
        <!-- Animated Glowing Wallet Icon (SVG) -->
        <div style="width: 80px; height: 80px; margin: 0 auto 15px auto; background: rgba(249, 115, 22, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 15px rgba(249,115,22,0.2), 0 0 15px rgba(249,115,22,0.3);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 0px 5px rgba(249,115,22,0.8));">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
        </div>
        
        <h3 style="color: #ffffff; font-size: 24px; font-weight: 900; margin-bottom: 10px; font-family: sans-serif; letter-spacing: -0.5px;">Balance Low</h3>
        <p style="color: #cbd5e1; font-size: 15px; margin-bottom: 25px; line-height: 1.6; font-family: sans-serif; padding: 0 10px;">\${data.message}</p>
        
        <div style="display: flex; gap: 12px; flex-direction: column;">
            <button id="recharge-now-btn" style="background: linear-gradient(135deg, #ff8a00, #e52e71); color: white; border: none; border-radius: 14px; padding: 16px; font-size: 17px; font-weight: 800; box-shadow: 0 8px 20px rgba(229, 46, 113, 0.3); cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; transition: transform 0.2s;">
                Recharge Now 
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
            <button id="cancel-recharge-btn" style="background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;">Cancel</button>
        </div>
    </div>
\`;`;

vipContent = vipContent.replace(oldModal, newModal);
fs.writeFileSync(vipFile, vipContent);

console.log('Fixed Taka encoding and updated to SVG UI');
