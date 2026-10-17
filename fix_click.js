const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the wrongly placed function from the tailwind script tag
const wrongInjection = /<script src="https:\/\/cdn\.tailwindcss\.com">[\s\S]*?async function startMultiTask[\s\S]*?console\.error\(e\);\n\s*\}\n\s*\}\n\s*<\/script>/;
content = content.replace(wrongInjection, '<script src="https://cdn.tailwindcss.com"></script>');

// 2. Insert it properly at the end of the correct <script> tag before the closing </body>
const correctJs = `
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
                            // Show a lock icon and "Locked"
                            btn.innerHTML = '<span class="material-symbols-outlined text-[14px]">lock</span>';
                            btn.className = 'flex items-center justify-center text-white/50 bg-white/10 px-7 py-1.5 rounded-full cursor-not-allowed';
                            btn.style = 'border: 1px solid rgba(255,255,255,0.1);';
                        }
                        
                        // Update Progress Bar
                        completed++;
                        const limitMap = {0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14};
                        const totalLimit = limitMap[vipLevelGlobal] || 1;
                        
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
`;

// Also fix the button initial render state in generateTasks if limit is already 0
content = content.replace(/<button disabled class="text-white\/50 text-\[12px\] font-black px-7 py-1\.5 rounded-full bg-white\/10 cursor-not-allowed">Done<\/button>/g, '<button disabled class="flex items-center justify-center text-white/50 bg-white/10 px-7 py-1.5 rounded-full cursor-not-allowed" style="border: 1px solid rgba(255,255,255,0.1);"><span class="material-symbols-outlined text-[14px]">lock</span></button>');

// Insert correctJs at the end of the main script
content = content.replace(/<\/script>\s*<\/body>/, correctJs + '\n</script>\n</body>');

fs.writeFileSync(file, content);
console.log('Fixed script injection and added lock icon.');
