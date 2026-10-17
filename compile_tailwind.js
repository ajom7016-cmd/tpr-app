const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function compileTailwind() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Setting up Tailwind compilation...");
    
    // 1. Create a minimal tailwind.config.js in /var/www/jmj_app/
    const tailwindConfig = `
module.exports = {
  content: ["./public/**/*.html", "./public/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    await ssh.execCommand(`echo '${tailwindConfig}' > /var/www/jmj_app/tailwind.config.js`);

    // 2. Create input CSS file
    const inputCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
    await ssh.execCommand(`echo '${inputCss}' > /var/www/jmj_app/input.css`);

    // 3. Install tailwindcss globally or locally if needed
    console.log("Installing tailwindcss...");
    await ssh.execCommand("cd /var/www/jmj_app && npm install tailwindcss");

    // 4. Run tailwindcss to generate the static CSS file
    console.log("Compiling CSS...");
    const res = await ssh.execCommand("cd /var/www/jmj_app && npx tailwindcss -i ./input.css -o ./public/assets/tailwind-compiled.css --minify");
    console.log("Compile result:", res.stdout, res.stderr);

    // 5. Replace the CDN script with the compiled CSS link in ALL html files
    console.log("Replacing CDN links in HTML files...");
    const resFiles = await ssh.execCommand("find /var/www/jmj_app/public -name '*.html'");
    const files = resFiles.stdout.split('\n').filter(Boolean);
    
    for (let file of files) {
        let contentRes = await ssh.execCommand(`cat "${file}"`);
        let content = contentRes.stdout;
        let original = content;
        
        // Remove the CDN script
        content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/gi, '');
        content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com\?v=.*?"><\/script>/gi, '');
        
        // Add the compiled CSS link right before </head> or after <title>
        if (!content.includes('tailwind-compiled.css')) {
            const cssLink = `<link rel="stylesheet" href="/assets/tailwind-compiled.css?v=${Date.now()}">`;
            if (content.includes('</head>')) {
                content = content.replace('</head>', `    ${cssLink}\n</head>`);
            } else {
                // If no </head>, just put it at the top
                content = cssLink + '\n' + content;
            }
        }
        
        if (content !== original) {
            let b64 = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > "${file}"`);
            console.log(`Updated ${file}`);
        }
    }

    console.log("All done! Tailwind is now fully compiled and instant.");
    ssh.dispose();
}
compileTailwind().catch(console.error);
