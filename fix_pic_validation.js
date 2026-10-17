const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixPicValidation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // Replace the strict includes('data:image') check
    const oldCheck1 = `if (pic && pic.includes('data:image')) {`;
    const newCheck1 = `if (pic && pic.length > 10) {`;
    
    const oldCheck2 = `if(hdr && hdr.src && hdr.src.includes('data:image'))`;
    const newCheck2 = `if(hdr && hdr.src && hdr.src.length > 20 && !hdr.src.includes('.html'))`;
    
    const oldCheck3 = `if (newPic && newPic.includes('data:image')) {`;
    const newCheck3 = `if (newPic && newPic.length > 10) {`;
    
    code = code.replace(new RegExp(oldCheck1.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\$&'), 'g'), newCheck1);
    code = code.replace(new RegExp(oldCheck2.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\$&'), 'g'), newCheck2);
    code = code.replace(new RegExp(oldCheck3.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\$&'), 'g'), newCheck3);
    
    // Fallback: Just replace manually if regex fails
    code = code.replace(/pic && pic.includes\('data:image'\)/g, "pic && pic.length > 10");
    code = code.replace(/hdr.src.includes\('data:image'\)/g, "hdr.src.length > 20 && !hdr.src.includes('.html')");
    code = code.replace(/newPic && newPic.includes\('data:image'\)/g, "newPic && newPic.length > 10");
    
    // Bump cache
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v18');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.16';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("Picture validation strictness removed!");
    ssh.dispose();
}
fixPicValidation().catch(console.error);
