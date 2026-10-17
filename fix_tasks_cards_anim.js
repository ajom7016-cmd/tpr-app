const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTasksCardsAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Inject CSS animation
const cssAnim = \`
<style>
@keyframes popUp {
    0% { opacity: 0; transform: translateY(15px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
.task-card-anim {
    animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
}
</style>
<main\`;
content = content.replace('<main', cssAnim);

// Add class and staggered delay to the injected task cards
content = content.replace(
    /class="bg-white\\/10 backdrop-blur-\\[15px\\] border border-white\\/20 rounded-\\[26px\\] py-2\\.5 px-4 shadow-sm flex items-center justify-between group transition-all hover:bg-white\\/20 mb-3"/g, 
    'class="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[26px] py-2.5 px-4 shadow-sm flex items-center justify-between group transition-all hover:bg-white/20 mb-3 task-card-anim"'
);

// We also need to add staggered delay if possible, but just having the class is enough for a smooth pop-in instead of a hard jump!
// Let's also do it for the "locked" task cards:
content = content.replace(
    /class="bg-white\\/30 backdrop-blur-\\[15px\\] border border-white\\/40 rounded-\\[26px\\] py-2\\.5 px-4 shadow-sm flex items-center justify-between opacity-60 mb-3 relative overflow-hidden"/g,
    'class="bg-white/30 backdrop-blur-[15px] border border-white/40 rounded-[26px] py-2.5 px-4 shadow-sm flex items-center justify-between opacity-60 mb-3 relative overflow-hidden task-card-anim"'
);

// Also the top profile card
content = content.replace(
    /class="bg-white\\/30 backdrop-blur-xl border border-white\\/50 rounded-3xl p-5 shadow-sm relative overflow-hidden"/g,
    'class="bg-white/30 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-sm relative overflow-hidden task-card-anim"'
);


fs.writeFileSync(file, content);
console.log('Task cards smooth pop-in animation applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_tasks_anim.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_tasks_anim.js');
    console.log(res.stdout);
    
    // Bump cache
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v68\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
fixTasksCardsAnim().catch(console.error);
