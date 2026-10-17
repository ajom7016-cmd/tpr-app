import os
import random

output_dir = r"C:\Users\PC\Downloads\TPR_50_Premium_Profiles"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

themes = [
    {
        "name": "White & Glowing Orange",
        "bg": "bg-slate-50",
        "header_bg": "radial-gradient(circle at 50% 0%, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
        "text_color": "text-slate-800",
        "card_bg": "bg-white/80 backdrop-blur-xl border border-white",
        "menu_bg": "bg-white/60 hover:bg-white/90 backdrop-blur-md",
        "accent": "#ea580c",
        "ring": "box-shadow: 0 0 30px rgba(234, 88, 12, 0.4); border: 2px solid #f97316;",
        "wave": "#f8fafc"
    },
    {
        "name": "Obsidian & Gold",
        "bg": "bg-[#0a0a0a]",
        "header_bg": "radial-gradient(circle at 50% 30%, #2a1a00 0%, #050505 80%)",
        "text_color": "text-white",
        "card_bg": "bg-black/50 backdrop-blur-2xl border border-yellow-600/30",
        "menu_bg": "bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10",
        "accent": "#fbbf24",
        "ring": "box-shadow: 0 0 40px rgba(251, 191, 36, 0.3); border: 2px solid #fde047;",
        "wave": "#0a0a0a"
    },
    {
        "name": "Pearl & Rose Gold",
        "bg": "bg-rose-50",
        "header_bg": "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
        "text_color": "text-rose-950",
        "card_bg": "bg-white/70 backdrop-blur-xl border border-rose-100",
        "menu_bg": "bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white",
        "accent": "#e11d48",
        "ring": "box-shadow: 0 0 25px rgba(225, 29, 72, 0.3); border: 2px solid #fda4af;",
        "wave": "#fff1f2"
    },
    {
        "name": "Holographic Glass",
        "bg": "bg-slate-100",
        "header_bg": "linear-gradient(120deg, rgba(234,88,12,0.15), rgba(255,192,203,0.2), rgba(173,216,230,0.2))",
        "text_color": "text-slate-900",
        "card_bg": "bg-white/40 backdrop-blur-2xl border border-white/60",
        "menu_bg": "bg-white/40 hover:bg-white/70 backdrop-blur-xl border border-white",
        "accent": "#f97316",
        "ring": "box-shadow: 0 0 35px rgba(234, 88, 12, 0.4); border: 2px solid rgba(255,255,255,0.8);",
        "wave": "#f1f5f9"
    },
    {
        "name": "Midnight Orange",
        "bg": "bg-slate-900",
        "header_bg": "radial-gradient(circle at top, #1e293b 0%, #0f172a 100%)",
        "text_color": "text-slate-100",
        "card_bg": "bg-slate-800/60 backdrop-blur-xl border border-slate-700",
        "menu_bg": "bg-slate-800/40 hover:bg-slate-700/60 backdrop-blur-lg border border-slate-600",
        "accent": "#f97316",
        "ring": "box-shadow: 0 0 30px rgba(249, 115, 22, 0.5); border: 2px solid #fdba74;",
        "wave": "#0f172a"
    }
]

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>TPR Profile - Variant {id}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet"/>
    <style>
        body {{
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            -webkit-tap-highlight-color: transparent;
        }}
        .profile-header {{
            position: relative;
            background: {header_bg};
            padding-top: {pt}px;
            padding-bottom: 120px;
            overflow: hidden;
        }}
        .glow-ring {{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: {ring_size}px;
            height: {ring_size}px;
            border-radius: 50%;
            {ring}
            z-index: 0;
        }}
        .wave-bottom {{
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 60px;
            z-index: 1;
        }}
        .avatar-img {{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }}
        .vip-badge {{
            position: absolute;
            bottom: -5px;
            right: -25px;
            background: linear-gradient(135deg, #fbbf24, #d97706);
            padding: 4px 12px;
            border-radius: 20px;
            border: 1px solid #fde047;
            box-shadow: 0 5px 15px rgba(217, 119, 6, 0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 20;
        }}
        .membership-card {{
            position: relative;
            z-index: 20;
            margin-top: -80px;
            border-radius: {radius}px;
            padding: 24px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
            width: 90%;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }}
        .menu-pill {{
            border-radius: {radius}px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            transition: all 0.3s ease;
        }}
        .menu-pill:active {{ transform: scale(0.98); }}
    </style>
</head>
<body class="{bg} {text_color}">

    <div class="profile-header">
        <div class="relative flex flex-col items-center justify-center mt-6">
            <div class="glow-ring"></div>
            
            <div class="relative z-10 w-[120px] h-[120px] mx-auto">
                <img src="https://i.pravatar.cc/300?u=variant_{id}" alt="User" class="avatar-img">
                <div class="vip-badge text-white">
                    <span class="text-sm font-black leading-none">VIP</span>
                </div>
            </div>

            <div class="mt-6 text-center relative z-10 {text_color}">
                <h1 class="text-[26px] font-black tracking-tight drop-shadow-md">User {id}</h1>
                <p class="text-sm font-medium opacity-80">Premium Member</p>
            </div>
        </div>

        <svg class="wave-bottom" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="{wave_path}" fill="{wave}"></path>
        </svg>
    </div>

    <div class="pb-32 px-5">
        
        <div class="membership-card {card_bg}">
            <div class="flex justify-between items-center mb-3">
                <p class="text-[14px] font-semibold opacity-80">Membership: <span class="font-black opacity-100 ml-1">ACTIVE</span></p>
                <span class="material-symbols-outlined text-[28px]" style="color: {accent}; font-variation-settings: 'FILL' 1;">verified</span>
            </div>
            <div class="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mt-4">
                <div class="h-full rounded-full w-[{progress}%]" style="background-color: {accent};"></div>
            </div>
        </div>

        <div class="mt-6 flex flex-col max-w-[400px] mx-auto">
            <a href="#" class="menu-pill {menu_bg}">
                <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined" style="color: {accent}">settings</span>
                    <span class="text-[15px] font-bold tracking-tight">Profile Settings</span>
                </div>
                <span class="material-symbols-outlined opacity-50">chevron_right</span>
            </a>
            <a href="#" class="menu-pill {menu_bg}">
                <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined" style="color: {accent}">account_balance_wallet</span>
                    <span class="text-[15px] font-bold tracking-tight">My Earnings</span>
                </div>
                <span class="material-symbols-outlined opacity-50">chevron_right</span>
            </a>
            <a href="#" class="menu-pill {menu_bg}">
                <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined" style="color: {accent}">military_tech</span>
                    <span class="text-[15px] font-bold tracking-tight">VIP Benefits</span>
                </div>
                <span class="material-symbols-outlined opacity-50">chevron_right</span>
            </a>
            
            <button class="mt-4 w-full bg-red-500/10 backdrop-blur-[30px] border border-red-500/20 rounded-[20px] p-4 flex items-center justify-center gap-2 text-red-500 text-[16px] font-extrabold transition-all duration-200 active:scale-[0.98]">
                <span class="material-symbols-outlined">logout</span>
                Logout
            </button>
        </div>
    </div>
</body>
</html>"""

wave_paths = [
    "M0,50 C320,150 420,-50 720,30 C1020,110 1120,-50 1440,50 L1440,100 L0,100 Z",
    "M0,100 C280,0 520,20 720,60 C920,100 1160,100 1440,0 L1440,100 L0,100 Z",
    "M0,30 C320,100 420,0 720,30 C1020,60 1120,0 1440,50 L1440,100 L0,100 Z",
    "M0,80 C320,0 420,150 720,80 C1020,10 1120,120 1440,60 L1440,100 L0,100 Z"
]

for i in range(1, 51):
    theme = random.choice(themes)
    wave_path = random.choice(wave_paths)
    ring_size = random.randint(160, 200)
    radius = random.choice([16, 20, 24, 30])
    pt = random.randint(40, 80)
    progress = random.randint(30, 95)
    
    html = html_template.format(
        id=i,
        bg=theme["bg"],
        header_bg=theme["header_bg"],
        text_color=theme["text_color"],
        card_bg=theme["card_bg"],
        menu_bg=theme["menu_bg"],
        accent=theme["accent"],
        ring=theme["ring"],
        wave=theme["wave"],
        wave_path=wave_path,
        ring_size=ring_size,
        radius=radius,
        pt=pt,
        progress=progress
    )
    
    with open(os.path.join(output_dir, f"Profile_Variation_{i}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print("Successfully generated 50 Profile Page variations.")
