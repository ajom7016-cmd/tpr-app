const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Adding FOUC Mask (Blank Screen, No Spinner)...");
    
    // FOUC Mask for Light pages (app.html)
    const foucMaskLight = `
<style id="fouc-mask">body { visibility: hidden; opacity: 0; background-color: #f1f5f9 !important; }</style>
<script>
  (function(){
      function reveal(){
          const m = document.getElementById('fouc-mask');
          if(m) m.remove();
          document.body.style.visibility = 'visible';
          document.body.style.opacity = '1';
      }
      window.addEventListener('load', () => setTimeout(reveal, 150));
      setTimeout(reveal, 1000); // 1s max fallback
  })();
</script>
`;

    // FOUC Mask for Dark pages (index.html)
    const foucMaskDark = foucMaskLight.replace('#f1f5f9', '#0b0f19');

    async function applyMask(filepath, isDark) {
        let res = await ssh.execCommand(`cat ${filepath}`);
        let html = res.stdout;
        let original = html;
        
        const mask = isDark ? foucMaskDark : foucMaskLight;
        
        // Remove any old preloader remnants just in case
        const regex = /<style id="fouc-mask">[\s\S]*?<\/script>/g;
        html = html.replace(regex, '');
        
        // Add color-scheme meta to prevent Chrome from forcing dark mode black flashes
        if (!html.includes('color-scheme')) {
            html = html.replace('<head>', '<head>\n    <meta name="color-scheme" content="light dark">');
        }

        // Add the FOUC mask inside <head> so it executes immediately before body renders
        if (html.includes('</head>')) {
            html = html.replace('</head>', `    ${mask}\n</head>`);
        }
        
        if (html !== original) {
            let b64 = Buffer.from(html).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > ${filepath}`);
            console.log(`Applied FOUC mask to ${filepath}`);
        }
    }

    await applyMask('/var/www/jmj_app/public/app.html', false);
    await applyMask('/var/www/jmj_app/public/index.html', true);

    console.log("FOUC masks applied successfully!");
    ssh.dispose();
}
fix().catch(console.error);
