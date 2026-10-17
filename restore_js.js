const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// The block to replace:
const brokenScriptStart = "let recentTasks = [];";
const brokenScriptEnd = "window.addEventListener('scroll'";

const fixedScript = `let recentTasks = [];
                    try {
                        if (typeof window.APP.getRecentEarnings === 'function') {
                            recentTasks = await window.APP.getRecentEarnings();
                        }
                    } catch(e) {
                        console.error('Error fetching recent tasks', e);
                    }
                    if (!Array.isArray(recentTasks)) recentTasks = [];

                    const svgMap = {
                        'youtube': '<svg class="w-9 h-9 shrink-0 drop-shadow-sm" viewBox="0 0 576 512" fill="#FF0000"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>',
                        'facebook': '<svg class="w-9 h-9 shrink-0 drop-shadow-sm" viewBox="0 0 512 512" fill="#1877F2"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>',
                        'telegram': '<svg class="w-9 h-9 shrink-0 drop-shadow-sm" viewBox="0 0 496 512"><path fill="#24A1DE" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/></svg>',
                        'tiktok': '<svg class="w-8 h-8 mx-0.5 shrink-0 drop-shadow-sm" viewBox="0 0 448 512" fill="#000000"><path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>',
                        'default': '<svg class="w-9 h-9 shrink-0 drop-shadow-sm" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
                    };

                    const nameMap = {
                        'youtube': 'YouTube Task',
                        'facebook': 'Facebook Task',
                        'telegram': 'Telegram Task',
                        'tiktok': 'TikTok Task',
                        'video': 'Video Task',
                        'social': 'Social Task',
                        'quiz': 'Math Quiz'
                    };

                    const requiredPlatforms = ['youtube', 'facebook', 'telegram', 'tiktok'];
                    let completedMap = {};
                    recentTasks.forEach(t => completedMap[t.type] = t);
                    
                    let finalTasks = [];
                    for(let type of requiredPlatforms) {
                        if(completedMap[type]) {
                            finalTasks.push(completedMap[type]);
                        } else {
                            finalTasks.push({
                                type: type,
                                reward: 0,
                                completed_at: null
                            });
                        }
                    }

                    let html = '';
                    for (const task of finalTasks) {
                        let icon = svgMap[task.type] || svgMap['default'];
                        let name = nameMap[task.type] || (task.type ? (task.type.charAt(0).toUpperCase() + task.type.slice(1) + ' Task') : 'Task');
                        
                        let timeStr = '00:00';
                        if (task.completed_at) {
                            let timeString = task.completed_at;
                            if (typeof timeString === 'string' && !timeString.endsWith('Z') && !timeString.includes('T')) {
                                timeString = timeString.replace(' ', 'T') + 'Z';
                            } else if (typeof timeString === 'string' && !timeString.endsWith('Z')) {
                                timeString += 'Z';
                            }
                            let dateObj = new Date(timeString);
                            timeStr = dateObj.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
                        }
                        
                        let rewardHtml = task.reward > 0 
                            ? \`<span class="block text-[14px] font-black text-green-600">+ ৳ \${task.reward}</span>\` 
                            : \`<span class="block text-[14px] font-black text-slate-400">00</span>\`;
                        
                        html += \`
                        <div class="list-card p-3 h-[72px] flex items-center justify-between searchable-item relative overflow-hidden">
                            <div class="flex items-center gap-2 sm:gap-3 z-10">
                                \${icon}
                                <div>
                                    <h4 class="text-[14px] font-bold text-slate-800 leading-tight whitespace-nowrap tracking-tight">\${name}</h4>
                                    <span class="text-[11px] font-bold text-slate-500 block mt-0.5">\${timeStr}</span>
                                </div>
                            </div>
                            <div class="text-right shrink-0 absolute right-3 bottom-3 z-10">
                                \${rewardHtml}
                            </div>
                        </div>
                        \`;
                    }
                    
                    document.getElementById('recent-earnings-container').innerHTML = html;
                }
            }

            // `;

const startIndex = content.indexOf(brokenScriptStart);
const endIndex = content.indexOf(brokenScriptEnd);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + fixedScript + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log('Restored entire JS block in glassmorphic_1');
} else {
    console.log('Could not find start/end indices');
}
