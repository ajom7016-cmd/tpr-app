const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Find everything from <script> to </script> at the bottom of the file
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>') + 9;

if (scriptStart !== -1 && scriptEnd !== -1) {
    const newScript = `<script>
        async function subscribeVIP(level, taskLimit, perTask) {
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    const res = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ level: level })
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok) {
                        alert('Successfully subscribed to VIP ' + level + '!\\nYou now have ' + taskLimit + ' daily tasks.');
                        
                        if (window.parent && window.parent.loadPage) {
                            window.parent.loadPage('glassmorphic_2/code.html');
                            const navBtns = window.parent.document.querySelectorAll('.nav-btn');
                            if(navBtns.length > 1) {
                                navBtns.forEach(b => b.classList.remove('active'));
                                navBtns[1].classList.add('active');
                            }
                        } else {
                            window.location.href = '../glassmorphic_2/code.html';
                        }
                    } else {
                        if (data.error === 'Insufficient balance') {
                            let btn = window.event ? (window.event.target.closest('button') || window.event.target) : null;
                            if (btn) {
                                btn.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
                                setTimeout(() => btn.style.animation = '', 500);
                            }
                            
                            const modal = document.createElement('div');
                            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
                            
                            modal.innerHTML = \`
                                <div style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 20px; padding: 25px; width: 85%; max-width: 340px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); transform: translateY(20px); transition: transform 0.3s ease;">
                                    <i class="fa-solid fa-wallet" style="font-size: 50px; color: #f97316; filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.5)); margin-bottom: 15px;"></i>
                                    <h3 style="color: white; font-size: 22px; font-weight: 800; margin-bottom: 8px;">Insufficient Balance</h3>
                                    <p style="color: #9ca3af; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">\${data.message}</p>
                                    <div style="display: flex; gap: 10px; flex-direction: column;">
                                        <button id="recharge-now-btn" style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; border: none; border-radius: 12px; padding: 14px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); cursor: pointer;">Recharge Now <i class="fa-solid fa-arrow-right" style="margin-left: 8px;"></i></button>
                                        <button id="cancel-recharge-btn" style="background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 12px; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer;">Cancel</button>
                                    </div>
                                </div>
                            \`;
                            
                            document.body.appendChild(modal);
                            
                            requestAnimationFrame(() => {
                                modal.style.opacity = '1';
                                modal.querySelector('div').style.transform = 'translateY(0)';
                            });
                            
                            modal.querySelector('#recharge-now-btn').onclick = () => {
                                modal.remove();
                                if (window.parent && window.parent.loadPage) {
                                    window.parent.loadPage('deposit_glass/code.html');
                                }
                            };
                            
                            modal.querySelector('#cancel-recharge-btn').onclick = () => {
                                modal.style.opacity = '0';
                                modal.querySelector('div').style.transform = 'translateY(20px)';
                                setTimeout(() => modal.remove(), 300);
                            };
                        } else {
                            alert(data.error || 'Failed to upgrade. Please login again.');
                        }
                    }
                } else {
                    alert('Please login to subscribe.');
                }
            } catch (e) {
                console.error('Subscription error', e);
                alert('Error processing subscription.');
            }
        }
    </script>`;
    
    const finalContent = content.substring(0, scriptStart) + newScript + content.substring(scriptEnd);
    fs.writeFileSync(file, finalContent);
    console.log("Successfully hard-replaced the entire script block");
} else {
    console.log("Could not find script block");
}
