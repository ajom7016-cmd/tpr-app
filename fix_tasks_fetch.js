const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /let tasks = \[\];[\s\S]*?const limitMap/m;

const fixedFetch = `let tasks = [];
            let vipInfo = { level: 0 };
            
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    // Fetch Tasks manually
                    const resTasks = await fetch('/api/tasks?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if (resTasks.ok) {
                        tasks = await resTasks.json();
                    }
                    
                    // Fetch Profile manually for VIP limit
                    const resProf = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if (resProf.ok) {
                        const p = await resProf.json();
                        if(p && p.vip_plan !== 'Free') {
                            vipInfo.level = parseInt(p.vip_plan.replace('VIP ', '')) || 1;
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching tasks/profile for iframe", e);
            }
            
            const limitMap`;

if (content.match(regex)) {
    content = content.replace(regex, fixedFetch);
    fs.writeFileSync(file, content);
    console.log('Fixed tasks fetching logic in glassmorphic_2.');
} else {
    console.log('Regex did not match.');
}
