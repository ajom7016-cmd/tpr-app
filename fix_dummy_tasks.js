const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const fallbackRegex = /\/\/ Fallback: If for any reason[\s\S]*?}, 800\);/g;

const noTasksHtml = `
            setTimeout(() => {
                const container = document.getElementById('recent-earnings-container');
                if (container && container.innerHTML.trim() === '') {
                    container.innerHTML = '<div class="col-span-2 text-center text-slate-400 py-6 font-medium text-[13px]">No tasks completed today.</div>';
                }
            }, 800);
`;

content = content.replace(fallbackRegex, noTasksHtml);

fs.writeFileSync(file, content);
console.log('Fixed fallback data!');
