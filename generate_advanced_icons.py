import os

output_file = r"C:\Users\PC\Downloads\TPR_Ultra_Premium_Code_Logos.html"

html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPR Ultra-Premium App Icons (Pure Code)</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Montserrat:ital,wght@0,900;1,900&display=swap');
        
        body {
            margin: 0;
            padding: 40px;
            background: #050505;
            font-family: 'Inter', sans-serif;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 50px;
            text-align: center;
            background: linear-gradient(90deg, #ff7b00, #ff0000, #ff7b00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% auto;
            animation: shine 3s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 60px;
            width: 100%;
            max-width: 1200px;
            justify-items: center;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        
        .label {
            color: #888;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* Base App Icon Style */
        .icon {
            width: 180px;
            height: 180px;
            border-radius: 40px; /* iOS Squircle */
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'Montserrat', sans-serif;
            font-size: 70px;
            font-weight: 900;
        }
        .icon:hover {
            transform: translateY(-15px) scale(1.05);
        }

        /* 1. Ultra Glassmorphism */
        .glass {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 30px 40px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.4);
        }
        .glass .text {
            background: linear-gradient(135deg, #ff7b00, #ff0000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 10px 15px rgba(255, 0, 0, 0.5));
        }

        /* 2. Deep 3D Neumorphism */
        .neumorphic {
            background: #111;
            box-shadow: 20px 20px 60px #070707, -20px -20px 60px #1b1b1b;
            border: 1px solid #222;
        }
        .neumorphic .text {
            color: #111;
            text-shadow: 2px 2px 4px #222, -2px -2px 4px #000, 
                         0 0 20px #ff4500, 0 0 40px #ff0000;
        }

        /* 3. Liquid Gradient Mesh */
        .liquid {
            background-color: #ff0000;
            background-image: 
                radial-gradient(at 0% 0%, #ff7b00 0px, transparent 50%),
                radial-gradient(at 100% 100%, #8b0000 0px, transparent 50%);
            box-shadow: 0 20px 30px rgba(255,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.1);
        }
        .liquid .text {
            color: #fff;
            text-shadow: 0 10px 20px rgba(0,0,0,0.5);
            position: relative;
            z-index: 2;
        }
        .liquid::after {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%);
            border-radius: 40px; pointer-events: none;
        }

        /* 4. White Pearl */
        .pearl {
            background: linear-gradient(145deg, #ffffff, #e6e6e6);
            box-shadow:  20px 20px 60px #0a0a0a, -20px -20px 60px #1e1e1e;
            border: 2px solid #fff;
        }
        .pearl .text {
            background: linear-gradient(135deg, #ff7b00, #ff0000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.1);
        }

        /* 5. Cyberpunk Neon */
        .cyberpunk {
            background: #000;
            border: 3px solid #ff0055;
            box-shadow: 0 0 20px #ff0055, inset 0 0 20px #ff0055;
        }
        .cyberpunk .text {
            color: #fff;
            text-shadow: 0 0 10px #ff0055, 0 0 20px #ff0055, 0 0 40px #ff7b00;
            font-style: italic;
        }

        /* 6. Gold Metallic */
        .gold {
            background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
            box-shadow: 0 20px 30px rgba(170, 119, 28, 0.4);
            border: 1px solid #fff;
        }
        .gold .text {
            color: #222;
            text-shadow: 1px 1px 0px rgba(255,255,255,0.5), -1px -1px 0px rgba(0,0,0,0.5);
        }

        /* 7. Extruded 3D Text */
        .extruded {
            background: #f8fafc;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border-bottom: 8px solid #cbd5e1;
        }
        .extruded .text {
            color: #ff4500;
            text-shadow: 
                1px 1px 0px #d83a00, 2px 2px 0px #d83a00,
                3px 3px 0px #d83a00, 4px 4px 0px #d83a00,
                5px 5px 0px #d83a00, 6px 6px 0px #d83a00,
                7px 7px 15px rgba(0,0,0,0.5);
        }

        /* 8. Dark Aurora */
        .aurora {
            background: #000;
            overflow: hidden;
            border: 1px solid #333;
        }
        .aurora::before {
            content: ''; position: absolute; width: 200%; height: 200%;
            background: radial-gradient(circle at 50% 50%, #ff4500 0%, transparent 60%);
            top: -50%; left: -50%;
            animation: spin 10s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .aurora .text {
            position: relative; z-index: 10; color: #fff;
        }

        /* 9. Engraved Metal */
        .engraved {
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            border: 2px solid #333;
            box-shadow: inset 0 0 10px #000;
        }
        .engraved .text {
            color: transparent;
            background: #222;
            -webkit-background-clip: text;
            text-shadow: 2px 2px 3px rgba(255,255,255,0.1), -2px -2px 3px rgba(0,0,0,0.8);
        }

        /* 10. Split Tone */
        .split {
            background: linear-gradient(135deg, #ff7b00 50%, #cc0000 50%);
            box-shadow: 0 20px 40px rgba(204, 0, 0, 0.4);
        }
        .split .text {
            color: #fff;
            text-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }

        /* 11. Clean Minimal App */
        .clean {
            background: #fff;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .clean .text {
            color: #000;
            font-weight: 700;
        }
        .clean .dot {
            color: #ff4500;
        }

        /* 12. Sunset Glow */
        .sunset {
            background: linear-gradient(to top, #f43f5e, #f97316);
            box-shadow: 0 15px 35px rgba(244, 63, 94, 0.5);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .sunset .text {
            color: #fff;
            letter-spacing: -2px;
        }

        /* 13. Frosted Orange */
        .frosted {
            background: rgba(255, 123, 0, 0.8);
            backdrop-filter: blur(15px);
            border-top: 1px solid rgba(255,255,255,0.6);
            border-left: 1px solid rgba(255,255,255,0.6);
            box-shadow: 0 25px 45px rgba(0,0,0,0.2);
        }
        .frosted .text { color: #fff; text-shadow: 0 4px 10px rgba(0,0,0,0.2); }

        /* 14. Inner Shadow Cutout */
        .cutout {
            background: #efefef;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
        }
        .cutout .text {
            color: #efefef;
            text-shadow: -2px -2px 5px #fff, 2px 2px 5px rgba(0,0,0,0.2);
        }

        /* 15. Holographic */
        .holo {
            background: linear-gradient(135deg, #ffaaaa, #aaffaa, #aaaaff, #ffaaaa);
            background-size: 300% 300%;
            animation: holoAnim 5s ease infinite;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        @keyframes holoAnim { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .holo .text { color: #fff; mix-blend-mode: overlay; font-size: 80px; }

        /* 16. Soft 3D White */
        .soft3d {
            background: #fff;
            box-shadow: -10px -10px 20px #fff, 10px 10px 20px rgba(0,0,0,0.05);
            border: 1px solid #f0f0f0;
        }
        .soft3d .text {
            background: linear-gradient(135deg, #ff7b00, #ff0000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 5px 5px rgba(255,0,0,0.2));
        }

        /* 17. Carbon Fiber */
        .carbon {
            background: repeating-linear-gradient(45deg, #111 0, #111 2px, #222 2px, #222 4px);
            border: 2px solid #444;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }
        .carbon .text {
            color: #ff4500;
            text-shadow: 0 0 10px rgba(255,69,0,0.5);
        }

        /* 18. Floating Ring */
        .ring {
            background: #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .ring::before {
            content: ''; position: absolute; width: 140px; height: 140px;
            border-radius: 50%; border: 8px solid #ff4500;
        }
        .ring .text { color: #ff4500; z-index: 2; font-size: 50px; }

        /* 19. Blood Orange Dark */
        .blood {
            background: #3a0000;
            box-shadow: 0 15px 35px rgba(58,0,0,0.6);
        }
        .blood .text {
            color: #ff3300;
            text-shadow: 0 5px 15px rgba(0,0,0,0.8);
        }

        /* 20. Wireframe / Minimal */
        .wire {
            background: transparent;
            border: 4px solid #ff4500;
            box-shadow: 0 0 15px rgba(255,69,0,0.3), inset 0 0 15px rgba(255,69,0,0.3);
        }
        .wire .text { color: #ff4500; font-weight: 400; letter-spacing: 5px; }

    </style>
</head>
<body>
    <h1>TPR Ultra-Premium Concepts (Pure Code)</h1>
    <div class="grid">
"""

styles = [
    ("Glassmorphism", "glass", "<div class='text'>TPR</div>"),
    ("Deep Neumorphism", "neumorphic", "<div class='text'>TPR</div>"),
    ("Liquid Mesh", "liquid", "<div class='text'>TPR</div>"),
    ("White Pearl", "pearl", "<div class='text'>TPR</div>"),
    ("Cyberpunk Neon", "cyberpunk", "<div class='text'>TPR</div>"),
    ("Gold Metallic", "gold", "<div class='text'>TPR</div>"),
    ("Extruded 3D", "extruded", "<div class='text'>TPR</div>"),
    ("Dark Aurora", "aurora", "<div class='text'>TPR</div>"),
    ("Engraved Metal", "engraved", "<div class='text'>TPR</div>"),
    ("Split Tone", "split", "<div class='text'>TPR</div>"),
    ("Clean Minimal", "clean", "<div class='text'>TPR<span class='dot'>.</span></div>"),
    ("Sunset Glow", "sunset", "<div class='text'>TPR</div>"),
    ("Frosted Orange", "frosted", "<div class='text'>TPR</div>"),
    ("Inner Cutout", "cutout", "<div class='text'>TPR</div>"),
    ("Holographic", "holo", "<div class='text'>TPR</div>"),
    ("Soft 3D White", "soft3d", "<div class='text'>TPR</div>"),
    ("Carbon Fiber", "carbon", "<div class='text'>TPR</div>"),
    ("Floating Ring", "ring", "<div class='text'>TPR</div>"),
    ("Blood Dark", "blood", "<div class='text'>TPR</div>"),
    ("Wireframe outline", "wire", "<div class='text'>TPR</div>")
]

for name, cls, content in styles:
    html += f"""
        <div class="container">
            <div class="icon {cls}">{content}</div>
            <div class="label">{name}</div>
        </div>
    """

html += """
    </div>
</body>
</html>
"""

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Created {output_file}")
