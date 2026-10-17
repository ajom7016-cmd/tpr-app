const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixEyeAndButton() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // 1. Add Eye Icon to password field
    // Find the password input wrapper
    const passInputHTML = `<input type="password" id="adminPass" value="admin123" class="w-full bg-white/50 border border-white/60 rounded-[24px] pl-12 pr-4 py-4 focus:outline-none focus:border-primary shadow-inner text-[16px] font-bold text-slate-800 backdrop-blur-md">`;
    const newPassInputHTML = `<input type="password" id="adminPass" value="admin123" class="w-full bg-white/50 border border-white/60 rounded-[24px] pl-12 pr-12 py-4 focus:outline-none focus:border-primary shadow-inner text-[16px] font-bold text-slate-800 backdrop-blur-md">
                        <button type="button" onclick="const pass=document.getElementById('adminPass'); const icon=this.querySelector('span'); if(pass.type==='password'){pass.type='text'; icon.innerText='visibility_off';}else{pass.type='password'; icon.innerText='visibility';}" class="absolute right-4 top-4 text-slate-500 hover:text-slate-800 transition-colors">
                            <span class="material-symbols-outlined text-[22px]">visibility</span>
                        </button>`;
                        
    if (code.includes(passInputHTML)) {
        code = code.replace(passInputHTML, newPassInputHTML);
    } else {
        // Fallback for slightly different original HTML
        const regexPass = /<input type="password" id="adminPass" value="admin123" class="[^"]+">/;
        code = code.replace(regexPass, (match) => {
            return match.replace('pr-4', 'pr-12') + `\n<button type="button" onclick="const pass=document.getElementById('adminPass'); const icon=this.querySelector('span'); if(pass.type==='password'){pass.type='text'; icon.innerText='visibility_off';}else{pass.type='password'; icon.innerText='visibility';}" class="absolute right-4 top-4 text-slate-500 hover:text-slate-800 transition-colors"><span class="material-symbols-outlined text-[22px]">visibility</span></button>`;
        });
    }

    // 2. Fix Login Button Color (it seems the replacement failed and it's rendering plain white/grey)
    const btnRegex = /<button onclick="loginAdmin\(\)" class="([^"]*)">([^<]*)<\/button>/;
    code = code.replace(btnRegex, `<button onclick="loginAdmin()" class="w-full btn-gradient text-white font-black py-4 rounded-[99px] transition-transform shadow-[0_8px_20px_rgba(234,88,12,0.3)] active:scale-95 text-[16px] tracking-wide mt-2">লগইন করুন</button>`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
    console.log("Added Eye Icon and Fixed Button Color!");
    ssh.dispose();
}
fixEyeAndButton().catch(console.error);
