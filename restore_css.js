const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function restoreCSS() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Re-insert Tailwind config right after the CDN script
    const tailwindConfig = `
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#ea580c',
                        secondary: '#1f2937',
                        accent: '#f97316'
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    `;
    if(!html.includes('tailwind.config = {')) {
        html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<script src="https://cdn.tailwindcss.com"></script>' + tailwindConfig);
    }
    
    // 2. Re-insert the media query right before </style>
    const mediaQuery = `
        @media (max-width: 768px) {
            body { overflow-x: hidden; }
            .navbar { padding: 15px 20px !important; flex-direction: column; gap: 15px; text-align: center; }
            .navbar > div { gap: 12px !important; flex-wrap: wrap; justify-content: center; }
            .navbar h2 { font-size: 1.25rem !important; }
            .navbar a { font-size: 0.9rem !important; }
            .app-preview-section { padding: 50px 15px 30px 15px !important; margin-top: 0 !important; }
            .preview-text-centered h2 { font-size: 1.8rem !important; font-weight: 800 !important; line-height: 1.2 !important; margin-bottom: 10px !important; }
            .preview-text-centered p { font-size: 0.95rem !important; padding: 0 10px !important; }
            .preview-container { display: flex; flex-direction: column; align-items: center; overflow: hidden; width: 100%; }
            .frame-1 { transform: scale(0.85) !important; transform-origin: top center !important; margin-bottom: -100px !important; }
            .map-wrapper { margin: 0 15px 30px 15px !important; padding: 40px 15px !important; min-height: 300px !important; border-radius: 20px !important; }
            .map-title { font-size: 1.5rem !important; top: 15px !important; }
            .node { width: 5px !important; height: 5px !important; }
            .node span { font-size: 0.65rem !important; font-weight: 600 !important; }
            .footer { flex-direction: column !important; padding: 25px 20px !important; gap: 15px !important; text-align: center !important; }

            /* HERO SECTION */
            .hero {
                background-size: 100% auto !important;
                background-position: center center !important;
                height: 60vw !important; 
                min-height: unset !important;
                margin-top: 50px !important;
                border-radius: 15px !important;
            }
            .popout-layer {
                background-size: 100% auto !important;
                background-position: center center !important;
            }
            
            .glass-panel {
                width: 70% !important;
            }
            
            .part-top-left { padding: 12px 12px 0px 12px !important; }
            .part-bottom-left { padding: 0px 12px 12px 12px !important; }
            
            .part-top-left h1, .part-bottom-left h1 {
                font-size: 1.05rem !important;
                line-height: 1.1 !important;
                margin-bottom: 5px !important;
            }
            .part-bottom-left p {
                font-size: 0.55rem !important;
                line-height: 1.2 !important;
                margin-bottom: 5px !important;
            }
            
            .btn-group {
                gap: 4px !important;
                margin-top: 15px !important;
                flex-wrap: nowrap !important;
                justify-content: center !important;
            }
            .btn-glossy {
                padding: 4px 6px !important;
                font-size: 0.45rem !important;
                white-space: nowrap !important;
            }
            
            .part-top-left .btn-glossy[download], .part-top-left .btn-glossy {
                display: flex !important;
                font-size: 0.45rem !important;
                padding: 4px 6px !important;
                top: -15px !important;
                right: -5px !important;
            }
        }
        
        @media (max-width: 400px) {
            .preview-text-centered h2 { font-size: 1.6rem !important; }
            .frame-1 { transform: scale(0.75) !important; margin-bottom: -160px !important; }
        }
    `;
    
    // There are multiple </style> tags due to duplication? No, wait, grep showed two lines with </style>.
    // Let's replace the LAST </style> tag in the head.
    if(!html.includes('@media (max-width: 768px)')) {
        let lastStyleIndex = html.lastIndexOf('</style>');
        html = html.substring(0, lastStyleIndex) + mediaQuery + '\n    </style>' + html.substring(lastStyleIndex + 8);
    }
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("CSS restored to index.html!");
    ssh.dispose();
}
restoreCSS().catch(console.error);
