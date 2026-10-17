const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// The file currently has:
// <script src="https://cdn.tailwindcss.com">
//         async function startMultiTask(taskId, reward) {
// ...
//         }
// </script>
// We need to change that back to just <script src="https://cdn.tailwindcss.com"></script>

const badScriptStart = '<script src="https://cdn.tailwindcss.com">';
const badScriptEnd = '</script>';

let startIndex = content.indexOf(badScriptStart);
if (startIndex !== -1) {
    let endIndex = content.indexOf(badScriptEnd, startIndex);
    if (endIndex !== -1) {
        // Remove everything between the start and end, and replace with empty tag
        let part1 = content.substring(0, startIndex);
        let part2 = content.substring(endIndex + badScriptEnd.length);
        content = part1 + '<script src="https://cdn.tailwindcss.com"></script>' + part2;
    }
}

// Now insert the REAL startMultiTask at the very end of the file before </body> if it's not already there.
const realScript = `
<script>
async function startMultiTask(taskId, reward) {
    try {
        let token = localStorage.getItem('userToken');
        if (!token && window.parent) {
            try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
        }
        
        if (token) {
            let limitEl = document.getElementById('task-limit-' + taskId);
            let currentLimit = parseInt(limitEl.getAttribute('data-limit'));
            
            if (currentLimit <= 0) return;
            
            // OPTIONAL: Add a small alert or visual feedback here so the user knows it's working
            
            const res = await fetch('/api/tasks/complete', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ taskId })
            });
            
            if (res.ok) {
                const data = await res.json();
                
                currentLimit--;
                limitEl.setAttribute('data-limit', currentLimit);
                limitEl.innerText = currentLimit + ' TASKS TODAY';
                
                if (currentLimit <= 0) {
                    let btn = document.getElementById('btn-task-' + taskId);
                    btn.disabled = true;
                    btn.innerHTML = '<span class="material-symbols-outlined text-[14px]">lock</span>';
                    btn.className = 'flex items-center justify-center text-white/50 bg-white/10 px-7 py-1.5 rounded-full cursor-not-allowed';
                    btn.style = 'border: 1px solid rgba(255,255,255,0.1);';
                }
                
                // Update Progress Bar
                completed++;
                const limitMap = {0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14};
                const totalLimit = limitMap[window.vipLevelGlobal] || 1;
                
                document.getElementById('task-progress-text').innerText = completed + '/' + totalLimit;
                let progressPercent = totalLimit > 0 ? (completed / totalLimit) * 100 : 0;
                document.getElementById('task-progress-bar').style.width = progressPercent + '%';
                
                let currentEarnings = parseFloat(document.getElementById('user-total-earnings').innerText.replace(/,/g, ''));
                currentEarnings += reward;
                document.getElementById('user-total-earnings').innerText = currentEarnings.toLocaleString('en-IN', {minimumFractionDigits: 2});
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to complete task');
            }
        }
    } catch (e) {
        console.error(e);
    }
}
</script>
`;

if (!content.includes('async function startMultiTask')) {
    content = content.replace('</body>', realScript + '\n</body>');
}

fs.writeFileSync(file, content);
console.log('Fixed script injection.');
