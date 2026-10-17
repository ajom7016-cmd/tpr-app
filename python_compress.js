const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function pythonCompress() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Install python3-pip and pillow
    console.log("Installing python3-pip...");
    await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pip');
    console.log("Installing pillow...");
    await ssh.execCommand('pip3 install pillow');
    
    // Create python script
    const pyScript = `
from PIL import Image

try:
    img = Image.open('/var/www/jmj_app/public/clean_bg.jfif')
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
    img.save('/var/www/jmj_app/public/clean_bg_py.jpg', 'JPEG', quality=60)
    print("clean_bg compressed!")
    
    img2 = Image.open('/var/www/jmj_app/public/cutout_hd.png')
    img2.thumbnail((800, 800), Image.Resampling.LANCZOS)
    img2.save('/var/www/jmj_app/public/cutout_hd_py.png', 'PNG', optimize=True)
    print("cutout_hd compressed!")
    
    img3 = Image.open('/var/www/jmj_app/public/assets/bg_main.jpg')
    if img3.mode != 'RGB':
        img3 = img3.convert('RGB')
    img3.thumbnail((1080, 1080), Image.Resampling.LANCZOS)
    img3.save('/var/www/jmj_app/public/assets/bg_main_py.jpg', 'JPEG', quality=60)
    print("bg_main compressed!")
    
except Exception as e:
    print("Error:", e)
`;
    
    let b64 = Buffer.from(pyScript).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /root/compress.py`);
    
    console.log("Running Python compression...");
    let res = await ssh.execCommand('python3 /root/compress.py');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Update index.html to use Python compressed images
    let htmlRes = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = htmlRes.stdout;
    html = html.replace(/clean_bg\.jfif/g, 'clean_bg_py.jpg');
    html = html.replace(/bg_main\.jpg/g, 'bg_main_py.jpg');
    html = html.replace(/cutout_hd\.png/g, 'cutout_hd_py.png');
    let b64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    // Update app.html
    let appHtmlRes = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = appHtmlRes.stdout;
    appHtml = appHtml.replace(/bg_main_optimized\.jpg/g, 'bg_main_py.jpg');
    appHtml = appHtml.replace(/bg_main\.jpg/g, 'bg_main_py.jpg');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Python compressed images applied!");
    ssh.dispose();
}
pythonCompress().catch(console.error);
