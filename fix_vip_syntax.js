const fs = require('fs');
let file = 'public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /async function subscribeVIP[\s\S]*?<\/script>/;

const newScript = `async function subscribeVIP(level, taskLimit, perTask) {
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
                    
                    if (res.ok) {
                        alert('Successfully subscribed to VIP ' + level + '!\\nYou now have ' + taskLimit + ' daily tasks.');
                        
                        // Redirect to tasks page
                        if (window.parent && window.parent.loadPage) {
                            window.parent.loadPage('glassmorphic_2/code.html');
                            // Also update bottom nav
                            const navBtns = window.parent.document.querySelectorAll('.nav-btn');
                            if(navBtns.length > 1) {
                                navBtns.forEach(b => b.classList.remove('active'));
                                navBtns[1].classList.add('active'); // Tasks is index 1
                            }
                        } else {
                            window.location.href = '../glassmorphic_2/code.html';
                        }
                    } else {
                        alert('Failed to upgrade. Please login again.');
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

content = content.replace(regex, newScript);
fs.writeFileSync(file, content);
console.log('Fixed syntax error in vip.html');
