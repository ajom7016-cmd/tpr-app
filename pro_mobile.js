const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function superMobileCompact() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // Create the ultimate, highly-researched mobile compact CSS
    const proMobileCSS = `
    <!-- PRO MOBILE COMPACT FIX -->
    <style id="pro-mobile-compact">
        /* Base rules for smaller screens */
        @media (max-width: 768px) {
            /* 1. Global Typography & Spacing */
            body { overflow-x: hidden; } /* Prevent horizontal scroll */
            
            /* 2. Navbar */
            .navbar {
                padding: 15px 20px !important;
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            .navbar > div {
                gap: 12px !important;
                flex-wrap: wrap;
                justify-content: center;
            }
            .navbar h2 {
                font-size: 1.25rem !important; /* Smaller logo text */
            }
            .navbar a {
                font-size: 0.9rem !important; /* Smaller links */
            }

            /* 3. Hero Section */
            .hero {
                margin: 0 !important;
                border-radius: 0 !important;
                height: auto !important;
                min-height: 85vh !important;
                padding: 100px 15px 40px 15px !important;
            }
            .glass-panel {
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                padding: 25px 15px !important; /* Tighter padding inside glass */
                border-radius: 20px !important;
            }
            /* Thinner and smaller hero text */
            .glass-panel h1 {
                font-size: 2rem !important;
                font-weight: 800 !important; /* Less thick than 900 */
                line-height: 1.1 !important;
                margin-bottom: 10px !important;
            }
            .glass-panel p {
                font-size: 0.95rem !important;
                line-height: 1.4 !important;
                margin-bottom: 20px !important;
            }
            /* Restructure grid if any */
            .part-top-left, .part-bottom-left, .part-right {
                grid-column: unset !important;
                grid-row: unset !important;
                padding: 0 !important;
                margin-bottom: 15px;
            }

            /* 4. Hero Buttons */
            .btn-group {
                display: flex !important;
                flex-direction: column !important;
                gap: 12px !important;
                width: 100% !important;
            }
            .btn-glossy {
                width: 100% !important;
                justify-content: center !important;
                font-size: 0.95rem !important;
                padding: 12px 20px !important;
                border-radius: 12px !important; /* Modern softer buttons */
            }

            /* 5. App Preview Section */
            .app-preview-section {
                padding: 50px 15px 30px 15px !important;
                margin-top: 0 !important;
            }
            .preview-text-centered h2 {
                font-size: 1.8rem !important; /* Much smaller so it's not "ato mota" */
                font-weight: 800 !important;
                line-height: 1.2 !important;
                margin-bottom: 10px !important;
            }
            .preview-text-centered p {
                font-size: 0.95rem !important;
                padding: 0 10px !important;
            }

            /* 6. Phone Mockup - Fluid Scaling */
            /* The original frame is 330px wide. On a 320px screen, it overflows. */
            .preview-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow: hidden;
                width: 100%;
            }
            .frame-1 {
                /* Use CSS transform to strictly scale the 330px fixed phone down */
                /* For 375px screens (iPhone 11 Pro), scale(0.9) is good. */
                /* We will use a safe 0.85 global scale for mobile to make it super compact */
                transform: scale(0.85) !important;
                transform-origin: top center !important;
                margin-bottom: -100px !important; /* Pull up elements below the scaled phone */
            }

            /* 7. Map Section */
            .map-wrapper {
                margin: 0 15px 30px 15px !important;
                padding: 40px 15px !important;
                min-height: 300px !important;
                border-radius: 20px !important;
            }
            .map-title {
                font-size: 1.5rem !important; /* Smaller map title */
                top: 15px !important;
            }
            .node {
                width: 5px !important;
                height: 5px !important;
            }
            .node span {
                font-size: 0.65rem !important; /* Smaller country names */
                font-weight: 600 !important;
            }

            /* 8. Footer */
            .footer {
                flex-direction: column !important;
                padding: 25px 20px !important;
                gap: 15px !important;
                text-align: center !important;
            }
        }
        
        /* Ultra Small Screens (iPhone SE - 320px) */
        @media (max-width: 360px) {
            .glass-panel h1 { font-size: 1.75rem !important; }
            .preview-text-centered h2 { font-size: 1.6rem !important; }
            .frame-1 { 
                transform: scale(0.75) !important; 
                margin-bottom: -160px !important; 
            }
        }
    </style>
    `;

    // Remove any previous mobile CSS we injected manually
    html = html.replace(/\/\* Mobile Compact Responsiveness \*\/[\s\S]*?@media \(max-width: 380px\) \{[\s\S]*?\}\s*\}/, '');
    html = html.replace(/<!-- PRO MOBILE COMPACT FIX -->[\s\S]*?<\/style>/, '');

    // Inject the new pro mobile CSS right before </head>
    if (html.includes('</head>')) {
        html = html.replace('</head>', `\n${proMobileCSS}\n</head>`);
    }

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Pro mobile compact styles applied!");
    } else {
        console.log("No changes made.");
    }

    ssh.dispose();
}
superMobileCompact().catch(console.error);
