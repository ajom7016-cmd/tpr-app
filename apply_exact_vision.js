const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// The exact HTML to inject, this time with the exact gradient background built-in
const newModal = `modal.innerHTML = \`
    <div style="background: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop') center/cover; border-radius: 24px; padding: 30px 20px; width: 90%; max-width: 340px; text-align: center; transform: translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
        
        <!-- White glass overlay to make it look like the preview -->
        <div style="position: absolute; inset: 0; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); z-index: 1;"></div>
        
        <div style="position: relative; z-index: 2;">
            <div style="margin: 0 auto 20px auto; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(255,255,255,0.25); color: #fff; border: 1px solid rgba(255,255,255,0.4);">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
            </div>
            <h3 style="font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #ffffff; font-family: sans-serif; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Low Balance</h3>
            <p style="color: #f1f5f9; font-size: 14px; line-height: 1.5; margin-bottom: 25px; font-family: sans-serif; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">\${data.message}</p>
            <button id="recharge-now-btn" style="width: 100%; padding: 16px; border-radius: 99px; font-weight: 800; font-size: 16px; border: none; cursor: pointer; background: rgba(255,255,255,0.95); color: #000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">Add Funds</button>
            <button id="cancel-recharge-btn" style="background: transparent; color: #ffffff; margin-top: 15px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">Cancel</button>
        </div>
    </div>
\`;`;

// Fix the dark background behind the modal too so it's not pitch black
const regex = /modal\.innerHTML\s*=\s*`[\s\S]*?`;/g;
content = content.replace(regex, newModal);
content = content.replace('background: rgba(0,0,0,0.8)', 'background: rgba(0,0,0,0.4)');

fs.writeFileSync(file, content);
console.log('Applied exact color gradient to the modal');
