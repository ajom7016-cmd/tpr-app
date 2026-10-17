const fs = require('fs');

let file = 'public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

// Increase gap between buttons and scrollbar
content = content.replace(
    '<div class="tabs-container px-5 pb-2 -mx-5">',
    '<div class="tabs-container px-5 pb-4 -mx-5">'
);

// Replace entire custom-global-scrollbar block with updated horizontal styling
const newScrollbarCSS = `<style id="custom-global-scrollbar">
  /* Smooth, native-feeling scrollbar */
  ::-webkit-scrollbar { width: 7px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); border-radius: 7px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }

  /* Perfectly aligned scrollbar buttons (Gray Triangles) */
  ::-webkit-scrollbar-button:single-button {
    background-color: transparent;
    display: block;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 7px 7px;
  }
  
  /* Vertical Scrollbar Buttons */
  ::-webkit-scrollbar-button:single-button:vertical {
    height: 14px;
    width: 7px;
  }
  ::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDE3IDE5LDE3IDEwLDUnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=");
  }
  ::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxLDMgMTksMyAxMCwxNScgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
  }

  /* Horizontal Scrollbar Buttons */
  ::-webkit-scrollbar-button:single-button:horizontal {
    height: 6px;
    width: 14px;
  }
  ::-webkit-scrollbar-button:single-button:horizontal:decrement {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPScxNywxIDE3LDE5IDUsMTAnIGZpbGw9JyM2NDZlNzgnLz48L3N2Zz4=");
  }
  ::-webkit-scrollbar-button:single-button:horizontal:increment {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBvbHlnb24gcG9pbnRzPSczLDEgMywxOSAxNSwxMCcgZmlsbD0nIzY0NmU3OCcvPjwvc3ZnPg==");
  }
</style>`;

// Use regex to replace the old block
const blockRegex = /<style id="custom-global-scrollbar">[\s\S]*?<\/style>/;
content = content.replace(blockRegex, newScrollbarCSS);

fs.writeFileSync(file, content);
console.log('Fixed scrollbar layout and added horizontal triangles');
