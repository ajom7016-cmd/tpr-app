const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the routing logic in loadPage
content = content.replace(
    /const mainPages = \[\s*'glassmorphic_1\/code\.html',\s*'glassmorphic_2\/code\.html',\s*'investment_premium_glass\/vip\.html',\s*'user_profile_premium_glass\/code\.html'\s*\];\s*if \(\!mainPages\.includes\(url\)\) \{[\s\S]*?\} else \{[\s\S]*?navIsToggled = false;\s*\}/,
    `// Hide bottom nav on ALL pages by default, showing only the Menu toggle button
        if(bottomNav) bottomNav.style.display = 'none';
        if(globalHeader) globalHeader.style.display = 'block'; 
        
        // Show toggle button
        const toggleBtn = document.getElementById('nav-toggle');
        if (toggleBtn) {
            toggleBtn.style.display = 'flex';
            toggleBtn.style.bottom = '20px';
        }
        const chevronContainer = document.getElementById('chevron-container');
        if (chevronContainer) {
            chevronContainer.style.transform = 'rotate(0deg)';
        }
        navIsToggled = false;`
);

fs.writeFileSync(file, content);
console.log('Applied toggle button to all pages');
