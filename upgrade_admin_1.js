const fs = require('fs');

const path = 'C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\admin_premium.html';
let code = fs.readFileSync(path, 'utf8');

const newStyles = `
    <!-- FOUC Fix for Tailwind CDN -->
    <style>
        body { font-family: 'Outfit', sans-serif; background: #f8fafc; color: #1e293b; overflow-x: hidden; opacity: 0; animation: fadeBodyIn 0.4s ease-out forwards; animation-delay: 150ms; }
        @keyframes fadeBodyIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* Ultra Premium Animated 3D Background - Light Mode */
        .bg-3d { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background: #f8fafc; overflow: hidden; }
        .orb-1 { position: absolute; top: -10%; right: -20%; width: 70vh; height: 70vh; background: radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0) 70%); border-radius: 50%; filter: blur(50px); animation: float 12s ease-in-out infinite; }
        .orb-2 { position: absolute; bottom: -20%; left: -20%; width: 80vh; height: 80vh; background: radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0) 70%); border-radius: 50%; filter: blur(50px); animation: float 15s ease-in-out infinite reverse; }
        .bg-block-1 { position: absolute; top: 40%; left: 10%; width: 50vh; height: 50vh; background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.4)); backdrop-filter: blur(20px); border-radius: 40px; transform: rotate(15deg); border: 1px solid rgba(255, 255, 255, 0.5); z-index: -1; }
        .bg-block-2 { position: absolute; top: 20%; right: 10%; width: 40vh; height: 40vh; background: linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2)); backdrop-filter: blur(20px); border-radius: 40px; transform: rotate(-10deg); border: 1px solid rgba(255, 255, 255, 0.8); z-index: -1; }
        
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
        
        .glass-card { background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.5); }
        .btn-gradient { background: linear-gradient(135deg, #ff9a28 0%, #ff5e00 100%); }
    </style>
`;

code = code.replace(/<style>[\s\S]*?<\/style>/, newStyles);

// Add bg-3d inside body
if(!code.includes('<div class="bg-3d">')) {
    code = code.replace('<body class="min-h-screen flex items-center justify-center p-4">', 
        \`<body class="min-h-screen flex flex-col p-4 relative">
    <div class="bg-3d">
        <div class="orb-1"></div><div class="orb-2"></div><div class="bg-block-1"></div><div class="bg-block-2"></div>
    </div>\`);
    // Also if body has no classes
    code = code.replace('<body>', 
        \`<body class="min-h-screen flex flex-col relative p-4">
    <div class="bg-3d">
        <div class="orb-1"></div><div class="orb-2"></div><div class="bg-block-1"></div><div class="bg-block-2"></div>
    </div>\`);
}

// Transform login section
code = code.replace('class="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-[0_15px_40px_rgba(0,0,0,0.08)] relative z-10"', 'class="glass-card rounded-[36px] p-8 w-full max-w-sm relative z-10 mx-auto mt-20"');

// Transform login button
code = code.replace('class="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95 text-[16px]"', 'class="w-full btn-gradient text-white font-black py-4 rounded-[99px] transition-all shadow-[0_8px_20px_rgba(234,88,12,0.3)] active:scale-95 text-[16px] tracking-wide"');

// Transform inputs
code = code.replace(/class="w-full bg-white\/70 border border-orange-100 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary shadow-sm text-\[15px\] font-semibold text-slate-700"/g, 'class="w-full bg-white/50 border border-white/60 rounded-[24px] pl-12 pr-4 py-4 focus:outline-none focus:border-primary shadow-inner text-[16px] font-bold text-slate-800 backdrop-blur-md"');

// Save it back
fs.writeFileSync(path, code);
console.log("Login section upgraded!");
`;

fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\upgrade_admin_1.js', code);
