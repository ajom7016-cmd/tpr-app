const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the bottom nav HTML
const oldNavRegex = /<div class="bottom-nav">[\s\S]*?<\/div>\s*<\/div>/;
const newNavHTML = `<div class="bottom-nav">
        <a href="#" onclick="loadPage('glassmorphic_1/code.html', this); return false;" class="nav-item active">
            <span class="material-symbols-outlined text-[24px]">dashboard</span>
            <span>Dashboard</span>
        </a>
        <a href="#" onclick="loadPage('glassmorphic_2/code.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[24px]">featured_seasonal_and_gifts</span>
            <span>Rewards</span>
        </a>
        <a href="#" onclick="loadPage('support_glass/code.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[24px]">headset_mic</span>
            <span>Support</span>
        </a>
        <a href="#" onclick="loadPage('user_profile_premium_glass/code.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[24px]">person</span>
            <span>Profile</span>
        </a>
    </div>
</div>`;

text = text.replace(oldNavRegex, newNavHTML);

// Replace the mainPages array
const oldMainPagesRegex = /const mainPages = \[\s*'[^\\]+?',\s*'[^\\]+?',\s*'[^\\]+?',\s*'[^\\]+?'\s*\];/g;
const newMainPages = `const mainPages = [
              'glassmorphic_1/code.html', 
              'glassmorphic_2/code.html', 
              'support_glass/code.html', 
              'user_profile_premium_glass/code.html'
          ];`;
text = text.replace(oldMainPagesRegex, newMainPages);


// Revert the nav-item CSS to not be a pill
const oldCSS = /\.nav-item\.active\s*\{[\s\S]*?\}\s*\.nav-item\.active \.material-symbols-outlined\s*\{[\s\S]*?\}/;
const newCSS = `.nav-item.active {
        color: #ff4d4d;
    }
    .nav-item.active .material-symbols-outlined {
        color: #ff4d4d;
        font-variation-settings: 'FILL' 1;
    }`;

text = text.replace(oldCSS, newCSS);

text = text.replace(/\.nav-item\s*\{[\s\S]*?\}/, `.nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: #64748b;
        text-decoration: none;
    }`);

fs.writeFileSync(file, text);
console.log('Restored index.html bottom nav to original labels and style');
