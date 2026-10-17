const fs = require('fs');
const path = require('path');

const pages = [
    'public/withdraw_glass/code.html',
    'public/deposit_glass/code.html',
    'public/bank_details_glass/code.html',
    'public/investment_premium_glass/code.html',
    'public/glassmorphic_2/code.html',
    'public/user_profile_premium_glass/code.html'
];

const scrollbarCSS = `
<style id="custom-global-scrollbar">
  ::-webkit-scrollbar { width: 7px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); border-radius: 7px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }
  ::-webkit-scrollbar-button:single-button {
    background-color: transparent;
    display: block;
    height: 14px;
    width: 7px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 7px 7px;
  }
  ::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDE3IDE5LDE3IDEwLDUnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=");
  }
  ::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgMTksMyAxMCwxNScgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
  }
</style>
`;

pages.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('custom-global-scrollbar')) {
            content = content.replace('</head>', scrollbarCSS + '</head>');
            fs.writeFileSync(file, content);
            console.log('Added custom scrollbar to ' + file);
        } else {
            console.log('Scrollbar already exists in ' + file);
        }
    }
});
