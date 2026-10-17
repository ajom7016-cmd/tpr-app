import os

output_file = r'C:\Users\PC\Downloads\TPR_10_Premium_Profiles_v2.html'

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <title>TPR - 10 Ultra Premium Profiles</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,1,0,24" rel="stylesheet"/>
    <style>
        body { font-family: 'Outfit', sans-serif; background: #e2e8f0; margin: 0; padding: 40px; }
        .gallery-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: 50px; max-width: 1800px; margin: 0 auto; }
        .phone-mockup { 
            width: 375px; height: 812px; margin: 0 auto;
            border-radius: 45px; overflow: hidden; position: relative;
            box-shadow: 0 30px 60px rgba(0,0,0,0.2), 0 0 0 12px #ffffff, 0 0 0 14px #cbd5e1;
            background: #f8fafc;
        }
        .mockup-title { text-align: center; font-size: 22px; font-weight: 900; margin-bottom: 20px; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }
        .app-content { width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative; }
        .app-content::-webkit-scrollbar { display: none; }
        
        /* Shared Utilities */
        .glass-card { background: rgba(255,255,255,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.8); }
        .orange-glow { box-shadow: 0 10px 30px rgba(234, 88, 12, 0.2); }
        .gold-glow { box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3); }
        .text-orange-gradient { background: linear-gradient(135deg, #ea580c, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-gold-gradient { background: linear-gradient(135deg, #d97706, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 60px;">
        <h1 style="font-size: 42px; font-weight: 900; color: #0f172a;">TPR ULTIMATE VIP - 10 PREMIUM DESIGNS</h1>
        <p style="color: #475569; font-size: 18px;">Strictly matching the White, Glassmorphism, and Orange/Gold lighting theme.</p>
    </div>
    
    <div class="gallery-container">
"""

# Helper for standard menu
def get_menu(style_class="glass-card orange-glow rounded-2xl p-4 mb-3", icon_bg="bg-orange-50", text_col="text-slate-800"):
    return f"""
        <div class="px-5 pb-10">
            <div class="{style_class} flex items-center justify-between transition-transform active:scale-95 cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full {icon_bg} flex items-center justify-center text-orange-600">
                        <span class="material-symbols-outlined">settings</span>
                    </div>
                    <span class="font-bold {text_col}">Account Settings</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
            <div class="{style_class} flex items-center justify-between transition-transform active:scale-95 cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full {icon_bg} flex items-center justify-center text-yellow-600">
                        <span class="material-symbols-outlined">military_tech</span>
                    </div>
                    <span class="font-bold {text_col}">Exclusive VIP Benefits</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
            <div class="{style_class} flex items-center justify-between transition-transform active:scale-95 cursor-pointer">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full {icon_bg} flex items-center justify-center text-orange-600">
                        <span class="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <span class="font-bold {text_col}">My Earnings</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
        </div>
    """

# 1. The Classic Elegance
var1 = f"""
    <div>
        <div class="mockup-title">1. The Classic Elegance</div>
        <div class="phone-mockup">
            <div class="app-content bg-slate-50">
                <div class="relative pt-16 pb-24 px-5 bg-white rounded-b-[40px] shadow-[0_10px_40px_rgba(234,88,12,0.05)] border-b border-orange-100">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-[80px] -z-10"></div>
                    <div class="flex justify-between items-center mb-8">
                        <span class="font-black text-slate-800 text-xl tracking-tighter">TPR<span class="text-orange-500">.</span></span>
                        <span class="material-symbols-outlined text-slate-600 bg-slate-100 p-2 rounded-full">notifications</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="relative w-28 h-28 mb-4">
                            <div class="absolute inset-0 rounded-full border-2 border-orange-400 border-dashed animate-spin-slow" style="animation-duration: 10s;"></div>
                            <img src="https://i.pravatar.cc/300?u=1" class="w-full h-full object-cover rounded-full border-[4px] border-white shadow-xl">
                            <div class="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-md">VIP</div>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900">Alex Carter</h2>
                        <p class="text-orange-600 font-semibold text-sm">@alex_tpr</p>
                    </div>
                </div>
                
                <div class="px-5 -mt-10 mb-6 relative z-10">
                    <div class="glass-card orange-glow rounded-3xl p-6">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-slate-500 font-medium">Total Balance</span>
                            <span class="material-symbols-outlined text-orange-500">account_balance</span>
                        </div>
                        <h3 class="text-3xl font-black text-slate-800 mb-2">$14,580.00</h3>
                        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div class="w-[75%] h-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
                        </div>
                    </div>
                </div>
                {get_menu()}
            </div>
        </div>
    </div>
"""

# 2. The Floating Glass
var2 = f"""
    <div>
        <div class="mockup-title">2. The Floating Glass</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#f8fafc]">
                <!-- Background ambient glow -->
                <div class="fixed top-20 left-10 w-40 h-40 bg-orange-400/20 rounded-full blur-[50px]"></div>
                <div class="fixed top-40 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-[50px]"></div>
                
                <div class="pt-16 px-5 pb-8 relative z-10">
                    <div class="flex items-center justify-between mb-10">
                        <span class="material-symbols-outlined text-slate-800">menu</span>
                        <span class="font-black text-lg tracking-widest text-slate-800">PROFILE</span>
                        <span class="material-symbols-outlined text-slate-800">edit</span>
                    </div>
                    
                    <div class="glass-card rounded-[40px] p-8 flex flex-col items-center orange-glow relative">
                        <div class="absolute -top-12 w-24 h-24 rounded-full bg-white p-1 shadow-2xl">
                            <img src="https://i.pravatar.cc/300?u=2" class="w-full h-full rounded-full object-cover">
                        </div>
                        <div class="mt-10 text-center">
                            <h2 class="text-2xl font-black text-slate-900">Sarah Jenkins</h2>
                            <p class="text-slate-500 text-sm mt-1">San Francisco, CA</p>
                            <div class="inline-flex items-center gap-1 mt-4 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full font-bold text-sm border border-orange-100">
                                <span class="material-symbols-outlined text-[16px]">verified</span> TPR Elite
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-5 mt-4">
                    <h3 class="font-bold text-slate-800 mb-4 px-2">Settings</h3>
                    {get_menu('bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm')}
                </div>
            </div>
        </div>
    </div>
"""

# 3. The Neumorphic Pro
var3 = f"""
    <div>
        <div class="mockup-title">3. The Neumorphic Pro</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#e2e8f0]">
                <div class="pt-20 px-6">
                    <div class="w-32 h-32 mx-auto rounded-full p-2" style="box-shadow: -10px -10px 20px #ffffff, 10px 10px 20px #cbd5e1;">
                        <img src="https://i.pravatar.cc/300?u=3" class="w-full h-full rounded-full object-cover">
                    </div>
                    <div class="text-center mt-8">
                        <h2 class="text-3xl font-black text-slate-700 tracking-tight">Michael Chen</h2>
                        <p class="text-orange-500 font-semibold tracking-wide mt-1 uppercase text-sm">Level 42 Investor</p>
                    </div>
                    
                    <div class="mt-10 grid grid-cols-2 gap-6">
                        <div class="rounded-3xl p-5 flex flex-col items-center justify-center" style="box-shadow: -8px -8px 16px #ffffff, 8px 8px 16px #cbd5e1;">
                            <span class="material-symbols-outlined text-orange-500 text-3xl mb-2">trending_up</span>
                            <span class="text-slate-500 text-xs font-bold uppercase">Profit</span>
                            <span class="text-slate-800 font-black text-lg">+24.5%</span>
                        </div>
                        <div class="rounded-3xl p-5 flex flex-col items-center justify-center" style="box-shadow: -8px -8px 16px #ffffff, 8px 8px 16px #cbd5e1;">
                            <span class="material-symbols-outlined text-yellow-500 text-3xl mb-2">workspace_premium</span>
                            <span class="text-slate-500 text-xs font-bold uppercase">Status</span>
                            <span class="text-slate-800 font-black text-lg">Diamond</span>
                        </div>
                    </div>
                </div>
                
                <div class="mt-10 px-6 pb-10">
                    <div class="rounded-3xl p-2" style="box-shadow: inset -5px -5px 10px #ffffff, inset 5px 5px 10px #cbd5e1;">
                        <div class="p-4 flex items-center justify-between border-b border-slate-300/30">
                            <span class="font-bold text-slate-600">Personal Info</span>
                            <span class="material-symbols-outlined text-orange-500">arrow_forward</span>
                        </div>
                        <div class="p-4 flex items-center justify-between border-b border-slate-300/30">
                            <span class="font-bold text-slate-600">Payment Methods</span>
                            <span class="material-symbols-outlined text-orange-500">arrow_forward</span>
                        </div>
                        <div class="p-4 flex items-center justify-between">
                            <span class="font-bold text-slate-600">Security</span>
                            <span class="material-symbols-outlined text-orange-500">arrow_forward</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
"""

# 4. The Golden Arch
var4 = f"""
    <div>
        <div class="mockup-title">4. The Golden Arch</div>
        <div class="phone-mockup">
            <div class="app-content bg-white relative">
                <!-- Arch Background -->
                <div class="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-orange-50 to-white" style="border-bottom-left-radius: 50%; border-bottom-right-radius: 50%; border-bottom: 2px solid rgba(251,191,36,0.2);"></div>
                
                <div class="relative z-10 pt-16 px-6">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="font-black text-2xl text-slate-800">Profile</h1>
                        <div class="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                            <span class="material-symbols-outlined text-orange-500">qr_code_scanner</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-center">
                        <div class="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-orange-500 to-yellow-300 shadow-xl mb-4">
                            <img src="https://i.pravatar.cc/300?u=4" class="w-full h-full rounded-full border-4 border-white object-cover">
                        </div>
                        <h2 class="text-2xl font-black text-slate-800">Emily Rose</h2>
                        <p class="text-slate-500">emily.r@tpr.com</p>
                    </div>
                    
                    <div class="mt-8 bg-white/80 backdrop-blur-md border border-white shadow-[0_15px_35px_rgba(234,88,12,0.1)] rounded-[30px] p-6 flex justify-between">
                        <div class="text-center">
                            <p class="text-slate-400 text-xs font-bold uppercase mb-1">Followers</p>
                            <p class="text-xl font-black text-slate-800">12.5K</p>
                        </div>
                        <div class="w-px h-10 bg-slate-200"></div>
                        <div class="text-center">
                            <p class="text-slate-400 text-xs font-bold uppercase mb-1">Following</p>
                            <p class="text-xl font-black text-slate-800">450</p>
                        </div>
                        <div class="w-px h-10 bg-slate-200"></div>
                        <div class="text-center">
                            <p class="text-slate-400 text-xs font-bold uppercase mb-1">Likes</p>
                            <p class="text-xl font-black text-slate-800">98.2K</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8 px-6 pb-10 relative z-10">
                    {get_menu('bg-slate-50 border border-slate-100 rounded-[20px] p-4 mb-3 shadow-sm')}
                </div>
            </div>
        </div>
    </div>
"""

# 5. The Diagonal Slash
var5 = f"""
    <div>
        <div class="mockup-title">5. The Diagonal Slash</div>
        <div class="phone-mockup">
            <div class="app-content bg-slate-50 overflow-hidden relative">
                <!-- Diagonal Background -->
                <div class="absolute -top-[20%] -right-[20%] w-[150%] h-[50%] bg-white shadow-lg transform -rotate-6 z-0" style="border-bottom: 4px solid #ea580c;"></div>
                
                <div class="relative z-10 pt-16 px-6">
                    <div class="flex items-center gap-6">
                        <div class="relative">
                            <img src="https://i.pravatar.cc/300?u=5" class="w-24 h-24 rounded-2xl object-cover shadow-xl border-2 border-white">
                            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                                <span class="material-symbols-outlined text-[16px]">verified</span>
                            </div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-900">David Smith</h2>
                            <p class="text-slate-500 text-sm mb-2">ID: TPR-99482</p>
                            <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-bold">Standard Member</span>
                        </div>
                    </div>
                </div>
                
                <div class="relative z-10 mt-20 px-6">
                    <h3 class="font-black text-slate-800 text-lg mb-4">Dashboard</h3>
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-4 border-l-orange-500">
                            <span class="material-symbols-outlined text-orange-500 mb-2">account_balance_wallet</span>
                            <p class="text-slate-400 text-xs font-bold">Balance</p>
                            <p class="text-lg font-black text-slate-800">$4,020</p>
                        </div>
                        <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-4 border-l-yellow-400">
                            <span class="material-symbols-outlined text-yellow-500 mb-2">star</span>
                            <p class="text-slate-400 text-xs font-bold">Points</p>
                            <p class="text-lg font-black text-slate-800">8,450</p>
                        </div>
                    </div>
                    {get_menu('bg-white border border-slate-100 shadow-sm rounded-xl p-4 mb-3')}
                </div>
            </div>
        </div>
    </div>
"""

# 6. The Minimalist Pearl
var6 = f"""
    <div>
        <div class="mockup-title">6. The Minimalist Pearl</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#ffffff]">
                <div class="pt-16 px-8 text-center">
                    <p class="font-black tracking-widest text-xs text-slate-400 uppercase mb-8">User Profile</p>
                    
                    <div class="w-36 h-36 mx-auto rounded-full mb-6 relative">
                        <div class="absolute inset-0 rounded-full bg-orange-400/20 blur-xl"></div>
                        <img src="https://i.pravatar.cc/300?u=6" class="w-full h-full rounded-full object-cover relative z-10">
                    </div>
                    
                    <h1 class="text-3xl font-black text-slate-900 mb-1">Jessica Wong</h1>
                    <p class="text-slate-400">Premium Account</p>
                    
                    <button class="mt-6 bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
                        Edit Profile
                    </button>
                </div>
                
                <div class="mt-12 px-8">
                    <div class="border-t border-slate-100 pt-6">
                        <div class="flex items-center justify-between py-4 cursor-pointer group">
                            <span class="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Notification Settings</span>
                            <span class="material-symbols-outlined text-slate-300">chevron_right</span>
                        </div>
                        <div class="flex items-center justify-between py-4 cursor-pointer group">
                            <span class="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Privacy & Security</span>
                            <span class="material-symbols-outlined text-slate-300">chevron_right</span>
                        </div>
                        <div class="flex items-center justify-between py-4 cursor-pointer group">
                            <span class="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Help & Support</span>
                            <span class="material-symbols-outlined text-slate-300">chevron_right</span>
                        </div>
                        <div class="flex items-center justify-between py-4 cursor-pointer group">
                            <span class="font-bold text-red-500">Sign Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
"""

# 7. The Mesh Gradient
var7 = f"""
    <div>
        <div class="mockup-title">7. The Mesh Gradient</div>
        <div class="phone-mockup">
            <div class="app-content relative bg-slate-50">
                <!-- Mesh Background -->
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100 via-white to-slate-50 opacity-80 z-0"></div>
                <div class="absolute top-20 left-10 w-64 h-64 bg-yellow-100 rounded-full blur-[80px] z-0"></div>
                
                <div class="relative z-10 pt-16 px-6">
                    <div class="flex justify-between items-start">
                        <div class="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-white">
                            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
                        </div>
                        <div class="w-24 h-24 rounded-full p-1 bg-white shadow-xl">
                            <img src="https://i.pravatar.cc/300?u=7" class="w-full h-full rounded-full object-cover">
                        </div>
                        <div class="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-white">
                            <span class="material-symbols-outlined text-slate-700">more_horiz</span>
                        </div>
                    </div>
                    
                    <div class="text-center mt-6">
                        <h2 class="text-2xl font-black text-slate-800">Robert Fox</h2>
                        <div class="flex items-center justify-center gap-1 mt-1 text-orange-500 font-bold">
                            <span class="material-symbols-outlined text-[18px]">workspace_premium</span> VIP Member
                        </div>
                    </div>
                    
                    <div class="mt-8 bg-white/60 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                        <p class="text-slate-400 font-bold uppercase text-xs mb-4">Quick Stats</p>
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-3xl font-black text-slate-800">86</p>
                                <p class="text-slate-500 text-sm">Investments</p>
                            </div>
                            <div class="w-px h-12 bg-slate-200"></div>
                            <div>
                                <p class="text-3xl font-black text-slate-800">4.9</p>
                                <p class="text-slate-500 text-sm">Rating</p>
                            </div>
                            <div class="w-px h-12 bg-slate-200"></div>
                            <div>
                                <p class="text-3xl font-black text-slate-800">12</p>
                                <p class="text-slate-500 text-sm">Months</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative z-10 px-6 mt-8 pb-10">
                    {get_menu('bg-white/80 backdrop-blur-md border border-white shadow-sm rounded-2xl p-4 mb-3')}
                </div>
            </div>
        </div>
    </div>
"""

# 8. The Glassmorphism Heavy
var8 = f"""
    <div>
        <div class="mockup-title">8. Glassmorphism Heavy</div>
        <div class="phone-mockup" style="background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'); background-size: cover; background-position: center;">
            <div class="app-content bg-white/40 backdrop-blur-[40px]">
                
                <div class="pt-20 pb-8 px-6 text-center">
                    <div class="relative inline-block">
                        <img src="https://i.pravatar.cc/300?u=8" class="w-32 h-32 rounded-3xl object-cover border-4 border-white/50 shadow-2xl">
                        <div class="absolute -bottom-3 -right-3 bg-white text-orange-500 p-2 rounded-xl shadow-lg">
                            <span class="material-symbols-outlined">diamond</span>
                        </div>
                    </div>
                    <h1 class="text-3xl font-black text-slate-900 mt-6">Olivia Rhye</h1>
                    <p class="text-slate-700 font-medium">olivia@tpr.vip</p>
                </div>
                
                <div class="px-5 pb-10">
                    {get_menu('bg-white/50 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-4 mb-4')}
                </div>
            </div>
        </div>
    </div>
"""

# 9. The Modern Split
var9 = f"""
    <div>
        <div class="mockup-title">9. The Modern Split</div>
        <div class="phone-mockup">
            <div class="app-content bg-white">
                <div class="h-[45%] bg-slate-900 rounded-b-[50px] relative px-6 pt-16">
                    <!-- Dark top mimicking the user's initial preference but highly polished -->
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 to-transparent"></div>
                    
                    <div class="relative z-10 flex flex-col items-center">
                        <div class="w-28 h-28 rounded-full border-2 border-orange-500/50 p-1 mb-4 shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                            <img src="https://i.pravatar.cc/300?u=9" class="w-full h-full rounded-full object-cover">
                        </div>
                        <h2 class="text-2xl font-black text-white">James Wilson</h2>
                        <span class="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold mt-2">Elite Status</span>
                    </div>
                </div>
                
                <div class="px-6 -mt-10 relative z-20">
                    <div class="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-6 border border-slate-100 flex justify-between">
                        <div class="text-center">
                            <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2 text-orange-500">
                                <span class="material-symbols-outlined">payments</span>
                            </div>
                            <p class="font-bold text-slate-800">Deposit</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2 text-slate-600">
                                <span class="material-symbols-outlined">currency_exchange</span>
                            </div>
                            <p class="font-bold text-slate-800">Withdraw</p>
                        </div>
                        <div class="text-center">
                            <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2 text-yellow-500">
                                <span class="material-symbols-outlined">card_membership</span>
                            </div>
                            <p class="font-bold text-slate-800">VIP</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-8 px-6 pb-10">
                    <h3 class="font-black text-slate-800 mb-4">Settings</h3>
                    {get_menu('bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100', 'bg-white', 'text-slate-700')}
                </div>
            </div>
        </div>
    </div>
"""

# 10. Ultimate TPR Luxury
var10 = f"""
    <div>
        <div class="mockup-title">10. Ultimate TPR Luxury</div>
        <div class="phone-mockup">
            <div class="app-content bg-[#fafafa]">
                <div class="pt-16 pb-8 px-6 text-center border-b-2 border-orange-100 bg-white shadow-sm">
                    <span class="font-black text-3xl tracking-tighter text-slate-900">T<span class="text-orange-500">P</span>R</span>
                    
                    <div class="mt-8 relative inline-block">
                        <img src="https://i.pravatar.cc/300?u=10" class="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white relative z-10">
                        <div class="absolute top-0 left-0 w-full h-full rounded-full border border-orange-300 scale-[1.15] animate-pulse"></div>
                        <div class="absolute top-0 left-0 w-full h-full rounded-full border border-yellow-200 scale-[1.3] animate-pulse" style="animation-delay: 0.5s;"></div>
                    </div>
                    
                    <h1 class="text-3xl font-black text-slate-900 mt-8 mb-1">Victoria Crown</h1>
                    <p class="text-orange-600 font-bold uppercase tracking-wider text-xs">Royal Ambassador</p>
                </div>
                
                <div class="px-6 py-8">
                    <div class="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-[0_15px_30px_rgba(234,88,12,0.3)] relative overflow-hidden mb-8">
                        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-white/20">diamond</span>
                        <p class="font-bold text-orange-100 mb-1">Total Assets</p>
                        <h2 class="text-4xl font-black mb-4">$125,000.00</h2>
                        <button class="bg-white text-orange-600 font-bold px-6 py-2 rounded-full shadow-md w-full">View Portfolio</button>
                    </div>
                    
                    {get_menu('bg-white shadow-[0_5px_15px_rgba(0,0,0,0.04)] rounded-2xl p-4 mb-3')}
                </div>
            </div>
        </div>
    </div>
"""


html_content += var1 + var2 + var3 + var4 + var5 + var6 + var7 + var8 + var9 + var10

html_content += """
    </div>
</body>
</html>
"""

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Created {output_file}")
