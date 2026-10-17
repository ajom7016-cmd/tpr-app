const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function advancedSEO() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Generate robots.txt
    const robots = `User-agent: *
Allow: /
Sitemap: https://thepetroyal.com/sitemap.xml`;
    await ssh.execCommand(`echo "${robots}" > /var/www/jmj_app/public/robots.txt`);
    
    // 2. Generate sitemap.xml
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thepetroyal.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://thepetroyal.com/download</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    await ssh.execCommand(`echo '${sitemap}' > /var/www/jmj_app/public/sitemap.xml`);
    
    // 3. Advanced Schema.org JSON-LD and Twitter Cards for landing.html & login.html
    const ultraSEO = `
    <!-- High-Research SEO & Social Media Optimization -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="TPR App - Premium Earning Platform">
    <meta name="twitter:description" content="Join The Pet Royal (TPR) App today. Complete daily tasks and earn rewards seamlessly.">
    <meta name="theme-color" content="#ea580c">
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TPR App",
      "alternateName": "The Pet Royal",
      "operatingSystem": "ANDROID, IOS, WEB",
      "applicationCategory": "FinanceApplication",
      "description": "TPR (The Pet Royal) is a premium earning platform where users complete tasks, upgrade VIP profiles, and withdraw earnings daily.",
      "url": "https://thepetroyal.com",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT"
      }
    }
    </script>
    <!-- End High-Research SEO -->
    `;
    
    const files = ['landing.html', 'login.html'];
    for(let file of files) {
        let res = await ssh.execCommand(`cat /var/www/jmj_app/public/${file}`);
        let html = res.stdout;
        if(html.includes('</head>')) {
            html = html.replace('<!-- End SEO Tags -->', '<!-- End SEO Tags -->\n' + ultraSEO);
            let b64 = Buffer.from(html).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/${file}`);
        }
    }
    
    console.log("Ultra Advanced SEO applied!");
    ssh.dispose();
}

advancedSEO().catch(console.error);
