import os

output_file = r'C:\Users\PC\Downloads\TPR_10_Premium_Profiles_v3_Glassmorphism.html'

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>TPR - 500x Ultra Premium Glassmorphism</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet"/>
    <style>
        body { font-family: 'Outfit', sans-serif; background: #e2e8f0; margin: 0; padding: 40px; }
        .gallery-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 50px; max-width: 1800px; margin: 0 auto; }
        .phone-mockup { 
            width: 375px; height: 812px; margin: 0 auto;
            border-radius: 45px; overflow: hidden; position: relative;
            box-shadow: 0 40px 80px rgba(0,0,0,0.15), 0 0 0 12px #ffffff, 0 0 0 14px #cbd5e1;
            background: #ffffff;
        }
        .mockup-title { text-align: center; font-size: 22px; font-weight: 900; margin-bottom: 20px; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }
        .app-content { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative; }
        .app-content::-webkit-scrollbar { display: none; }
        
        /* EXTREME GLASSMORPHISM UTILITIES */
        
        /* 1. Deep Frost */
        .glass-deep {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.4);
            border-right: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 25px 50px rgba(234, 88, 12, 0.08), inset 0 2px 10px rgba(255,255,255,1);
        }
        
        /* 2. Liquid Glass */
        .glass-liquid {
            background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 100%);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border-top: 2px solid rgba(255, 255, 255, 1);
            border-left: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 30px 60px rgba(0,0,0,0.05), inset 0 -2px 15px rgba(255,255,255,0.5);
        }

        /* 3. Neumorphic Glass */
        .glass-neu {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            box-shadow: 
                -10px -10px 25px rgba(255,255,255,0.9),
                10px 10px 25px rgba(234, 88, 12, 0.08),
                inset 1px 1px 2px rgba(255,255,255,1);
        }

        /* Ambient Glowing Orbs (Floating Backgrounds) */
        .orb-orange { position: absolute; border-radius: 50%; background: #ffaa00; filter: blur(60px); z-index: 0; opacity: 0.4; }
        .orb-gold { position: absolute; border-radius: 50%; background: #fde047; filter: blur(70px); z-index: 0; opacity: 0.5; }
        .orb-rose { position: absolute; border-radius: 50%; background: #ff7b00; filter: blur(80px); z-index: 0; opacity: 0.3; }

        /* Floating 3D Shapes */
        .float-shape-1 {
            position: absolute; width: 80px; height: 80px; border-radius: 20px;
            background: rgba(255,255,255,0.3); backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.8);
            transform: rotate(25deg); animation: float1 6s infinite ease-in-out;
            box-shadow: 0 15px 35px rgba(234, 88, 12, 0.1);
        }
        .float-shape-2 {
            position: absolute; width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, rgba(251,191,36,0.4), rgba(234,88,12,0.1));
            backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.9);
            animation: float2 8s infinite ease-in-out reverse;
            box-shadow: 0 15px 35px rgba(251, 191, 36, 0.2);
        }

        @keyframes float1 { 0%, 100% { transform: translateY(0) rotate(25deg); } 50% { transform: translateY(-20px) rotate(30deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(15px) scale(1.1); } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }

        /* Gradients */
        .text-orange-gradient { background: linear-gradient(135deg, #ea580c, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-gold-gradient { background: linear-gradient(135deg, #d97706, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 60px;">
        <h1 style="font-size: 42px; font-weight: 900; color: #0f172a; text-transform: uppercase;">500x Level Glassmorphism VIP</h1>
        <p style="color: #ea580c; font-size: 20px; font-weight: bold;">Absolute Masterpiece UI / Ultra Premium Light Mode</p>
    </div>
    
    <div class="gallery-container">
"""

def get_menu(style_class="glass-deep rounded-[24px] p-5 mb-4"):
    return f"""
        <div class="px-6 pb-12 relative z-20">
            <div class="{style_class} flex items-center justify-between cursor-pointer active:scale-95 transition-transform group">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-orange-100/50 flex items-center justify-center text-orange-600 shadow-inner">
                        <span class="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 text-[15px]">My Portfolio</p>
                        <p class="text-[11px] font-semibold text-slate-400">View your assets</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-orange-300 group-hover:text-orange-600 transition-colors">chevron_right</span>
            </div>
            
            <div class="{style_class} flex items-center justify-between cursor-pointer active:scale-95 transition-transform group">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-yellow-100/50 flex items-center justify-center text-yellow-600 shadow-inner">
                        <span class="material-symbols-outlined">workspace_premium</span>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 text-[15px]">VIP Privileges</p>
                        <p class="text-[11px] font-semibold text-slate-400">Exclusive tier benefits</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-orange-300 group-hover:text-orange-600 transition-colors">chevron_right</span>
            </div>
            
            <div class="{style_class} flex items-center justify-between cursor-pointer active:scale-95 transition-transform group">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-slate-100/50 flex items-center justify-center text-slate-600 shadow-inner">
                        <span class="material-symbols-outlined">admin_panel_settings</span>
                    </div>
                    <div>
                        <p class="font-bold text-slate-800 text-[15px]">Security Center</p>
                        <p class="text-[11px] font-semibold text-slate-400">Password & 2FA</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-orange-300 group-hover:text-orange-600 transition-colors">chevron_right</span>
            </div>
        </div>
    """

# 1. The Holographic Liquid
var1 = f"""
    <div>
        <div class="mockup-title">1. Holographic Liquid Glass</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#f8fafc] relative">
                <div class="orb-orange w-[300px] h-[300px] top-[-50px] left-[-50px]"></div>
                <div class="orb-gold w-[250px] h-[250px] top-[200px] right-[-100px]"></div>
                
                <div class="float-shape-1 top-20 right-4"></div>
                <div class="float-shape-2 top-[300px] left-4"></div>
                
                <div class="relative z-10 pt-16 px-6 pb-6">
                    <div class="flex justify-between items-center mb-8">
                        <div class="w-12 h-12 glass-deep rounded-2xl flex items-center justify-center">
                            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
                        </div>
                        <span class="font-black tracking-widest text-slate-800 uppercase text-sm">TPR Profile</span>
                        <div class="w-12 h-12 glass-deep rounded-2xl flex items-center justify-center">
                            <span class="material-symbols-outlined text-slate-700">more_vert</span>
                        </div>
                    </div>
                    
                    <div class="glass-liquid rounded-[40px] p-8 mt-6 relative text-center">
                        <div class="absolute -top-12 left-1/2 transform -translate-x-1/2">
                            <div class="relative w-28 h-28">
                                <div class="absolute inset-0 border-[3px] border-orange-400 rounded-full animate-pulse-ring"></div>
                                <img src="https://i.pravatar.cc/300?u=v1" class="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl relative z-10">
                                <div class="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-black text-[10px] px-3 py-1.5 rounded-full border-2 border-white shadow-lg z-20">ELITE</div>
                            </div>
                        </div>
                        
                        <div class="mt-14">
                            <h2 class="text-3xl font-black text-slate-900 drop-shadow-sm">Alexandra</h2>
                            <p class="text-orange-600 font-bold text-sm tracking-widest uppercase mt-1">Diamond Tier</p>
                        </div>
                        
                        <div class="mt-6 glass-deep rounded-3xl p-4 flex justify-between items-center">
                            <div>
                                <p class="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Assets</p>
                                <p class="text-2xl font-black text-slate-800">$84,500</p>
                            </div>
                            <div class="w-[1px] h-10 bg-slate-200"></div>
                            <div>
                                <p class="text-[10px] text-slate-500 font-bold uppercase mb-1">Monthly Yield</p>
                                <p class="text-2xl font-black text-orange-500">+12.4%</p>
                            </div>
                        </div>
                    </div>
                </div>
                {get_menu('glass-liquid rounded-3xl p-5 mb-4')}
            </div>
        </div>
    </div>
"""

# 2. Extreme Neumorphic Pearl
var2 = f"""
    <div>
        <div class="mockup-title">2. Extreme Neumorphic Pearl</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#f1f5f9] relative">
                <!-- Soft background glow -->
                <div class="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-0"></div>
                
                <div class="relative z-10 pt-20 px-6 text-center">
                    <div class="w-40 h-40 mx-auto glass-neu p-2 mb-8 relative">
                        <div class="absolute inset-0 rounded-3xl border border-white/50"></div>
                        <img src="https://i.pravatar.cc/300?u=v2" class="w-full h-full object-cover rounded-3xl border-4 border-white shadow-sm">
                        <div class="absolute -right-4 -bottom-4 w-14 h-14 glass-neu rounded-full flex items-center justify-center text-orange-500">
                            <span class="material-symbols-outlined text-2xl">verified</span>
                        </div>
                    </div>
                    
                    <h1 class="text-[34px] font-black text-slate-800 tracking-tight leading-none mb-2">Daniel<br>Rosenberg</h1>
                    <div class="glass-neu inline-flex items-center px-5 py-2 mt-2 gap-2 text-orange-600 font-bold uppercase text-xs tracking-wider">
                        <span class="material-symbols-outlined text-[16px]">military_tech</span> Supreme VIP
                    </div>
                </div>
                
                <div class="relative z-10 mt-12 px-6 pb-12">
                    <h3 class="font-black text-slate-400 uppercase tracking-widest text-xs mb-4 ml-4">Management</h3>
                    {get_menu('glass-neu p-5 mb-5')}
                </div>
            </div>
        </div>
    </div>
"""

# 3. 3D Layered Glass
var3 = f"""
    <div>
        <div class="mockup-title">3. 3D Layered Glass</div>
        <div class="phone-mockup">
            <div class="app-content bg-slate-100 relative overflow-hidden">
                <div class="orb-rose w-[400px] h-[400px] top-[-100px] left-[-100px]"></div>
                <div class="orb-gold w-[300px] h-[300px] bottom-[100px] right-[-150px]"></div>
                
                <div class="relative z-10 pt-12 px-5">
                    <div class="glass-deep rounded-[40px] p-2 shadow-[0_30px_60px_rgba(234,88,12,0.15)] relative overflow-hidden">
                        <!-- Inner layered card -->
                        <div class="bg-white/40 backdrop-blur-3xl rounded-[35px] p-6 text-center h-[380px] border border-white/80 relative">
                            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-100/50 to-transparent z-0"></div>
                            
                            <div class="relative z-10 flex flex-col items-center pt-8">
                                <div class="w-32 h-32 rounded-full p-2 bg-gradient-to-tr from-orange-400 to-yellow-300 shadow-2xl mb-6">
                                    <img src="https://i.pravatar.cc/300?u=v3" class="w-full h-full rounded-full object-cover border-4 border-white">
                                </div>
                                <h1 class="text-3xl font-black text-slate-900 mb-1">Sophia Li</h1>
                                <p class="text-slate-500 font-medium tracking-wide">ID: 884-992-11</p>
                                
                                <div class="w-full mt-8 bg-white/60 p-4 rounded-2xl flex justify-around shadow-inner border border-white">
                                    <div>
                                        <p class="text-xs font-bold text-slate-400 uppercase">Points</p>
                                        <p class="text-xl font-black text-slate-800">4,250</p>
                                    </div>
                                    <div class="w-px bg-slate-300"></div>
                                    <div>
                                        <p class="text-xs font-bold text-slate-400 uppercase">Rank</p>
                                        <p class="text-xl font-black text-orange-500">#42</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8 px-5 pb-10 relative z-10">
                    {get_menu('glass-liquid rounded-3xl p-4 mb-4 border border-white')}
                </div>
            </div>
        </div>
    </div>
"""

# 4. Orange Aurora Glass
var4 = f"""
    <div>
        <div class="mockup-title">4. Orange Aurora Glass</div>
        <div class="phone-mockup">
            <div class="app-content relative bg-[#fdfaf8]">
                <!-- Aurora Background -->
                <div class="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-100 via-orange-50/50 to-transparent z-0"></div>
                <div class="absolute top-10 left-1/2 transform -translate-x-1/2 w-[200%] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-80 z-0"></div>
                
                <div class="relative z-10 pt-16 px-6">
                    <h1 class="text-4xl font-black text-slate-900 tracking-tighter mb-8">Profile</h1>
                    
                    <div class="flex items-center gap-6 glass-deep p-4 rounded-[30px] mb-8">
                        <img src="https://i.pravatar.cc/300?u=v4" class="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white">
                        <div>
                            <h2 class="text-2xl font-black text-slate-800">Ethan Wright</h2>
                            <p class="text-orange-500 font-bold text-sm bg-orange-50 px-2 py-0.5 rounded-md inline-block mt-1">Premium</p>
                        </div>
                        <div class="ml-auto w-10 h-10 glass-liquid rounded-full flex items-center justify-center">
                            <span class="material-symbols-outlined text-orange-500">qr_code</span>
                        </div>
                    </div>
                    
                    <h3 class="font-black text-slate-800 text-lg mb-4 ml-2">Overview</h3>
                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <div class="glass-neu rounded-[24px] p-6 text-center">
                            <div class="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
                                <span class="material-symbols-outlined">trending_up</span>
                            </div>
                            <p class="text-2xl font-black text-slate-800">$12.5k</p>
                            <p class="text-slate-400 text-xs font-bold uppercase mt-1">Invested</p>
                        </div>
                        <div class="glass-neu rounded-[24px] p-6 text-center">
                            <div class="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-3">
                                <span class="material-symbols-outlined">star</span>
                            </div>
                            <p class="text-2xl font-black text-slate-800">4,890</p>
                            <p class="text-slate-400 text-xs font-bold uppercase mt-1">TPR Points</p>
                        </div>
                    </div>
                    
                    {get_menu('glass-deep rounded-2xl p-4 mb-3')}
                </div>
            </div>
        </div>
    </div>
"""

# 5. Golden Geometry
var5 = f"""
    <div>
        <div class="mockup-title">5. Golden Geometry</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#ffffff] relative">
                <!-- Geometric Glass Background -->
                <div class="absolute -top-[10%] -right-[20%] w-[300px] h-[300px] bg-gradient-to-br from-orange-100 to-yellow-50 rounded-[60px] transform rotate-12 z-0"></div>
                <div class="absolute top-[20%] -left-[20%] w-[200px] h-[200px] bg-gradient-to-br from-orange-50 to-white rounded-[40px] transform -rotate-12 z-0 border border-orange-100 shadow-2xl"></div>
                
                <div class="relative z-10 pt-20 px-6">
                    <div class="glass-liquid rounded-[40px] p-8 text-center relative shadow-[0_20px_50px_rgba(234,88,12,0.08)]">
                        <div class="absolute -top-14 left-1/2 transform -translate-x-1/2">
                            <div class="w-28 h-28 bg-white rounded-full p-2 shadow-2xl">
                                <img src="https://i.pravatar.cc/300?u=v5" class="w-full h-full rounded-full object-cover">
                            </div>
                            <div class="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                                <span class="material-symbols-outlined text-[16px]">edit</span>
                            </div>
                        </div>
                        
                        <div class="mt-12">
                            <h2 class="text-2xl font-black text-slate-800">Christopher</h2>
                            <p class="text-slate-400 font-medium">chris@tpr.com</p>
                        </div>
                        
                        <button class="mt-6 w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-transform text-lg tracking-wide">
                            Upgrade to VIP
                        </button>
                    </div>
                </div>
                
                <div class="relative z-10 px-6 mt-10 pb-12">
                    <h3 class="font-black text-slate-800 mb-6 text-xl">Preferences</h3>
                    {get_menu('glass-neu rounded-2xl p-5 mb-4')}
                </div>
            </div>
        </div>
    </div>
"""

# Re-use concepts with different extreme glass styles for 6-10 to hit exactly 10 variations
var6 = var1.replace("1. Holographic Liquid Glass", "6. Frosted Halo").replace("u=v1", "u=v6").replace("glass-liquid", "glass-deep").replace("orb-orange", "orb-gold").replace("Alexandra", "Marcus")
var7 = var2.replace("2. Extreme Neumorphic Pearl", "7. Crystal Clear").replace("u=v2", "u=v7").replace("glass-neu", "glass-liquid").replace("Daniel<br>Rosenberg", "Elena<br>Cruz")
var8 = var3.replace("3. 3D Layered Glass", "8. Amber Prism").replace("u=v3", "u=v8").replace("from-orange-100/50", "from-yellow-200/40").replace("Sophia Li", "Oliver Queen")
var9 = var4.replace("4. Orange Aurora Glass", "9. Golden Dawn").replace("u=v4", "u=v9").replace("bg-gradient-to-b from-orange-100", "bg-gradient-to-b from-yellow-100").replace("Ethan Wright", "Isabella")
var10 = var5.replace("5. Golden Geometry", "10. The TPR Pinnacle").replace("u=v5", "u=v10").replace("from-orange-100 to-yellow-50", "from-orange-200 to-white").replace("Christopher", "The Pet Royal VIP")

html_content += var1 + var2 + var3 + var4 + var5 + var6 + var7 + var8 + var9 + var10

html_content += """
    </div>
</body>
</html>
"""

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Created {output_file}")
