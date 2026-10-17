import os

output_file = r"C:\Users\PC\Downloads\TPR_Final_App_Icons.html"

html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPR Final App Icons (Light/White Theme)</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;700;900&display=swap');
        
        body {
            margin: 0;
            padding: 40px;
            background-color: #f1f5f9; /* Same as VIP page */
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #1e293b;
            display: flex;
            flex-direction: column;
            align-items: center;
            /* Aura background from Home Page */
            background-image: 
                radial-gradient(circle at 20% 30%, rgba(255, 69, 58, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 149, 0, 0.1) 0%, transparent 50%);
            background-attachment: fixed;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 50px;
            text-align: center;
            background: linear-gradient(135deg, #ea580c, #dc2626);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 10px 20px rgba(234, 88, 12, 0.1);
        }
        
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
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* Base App Icon Style (Squircle) */
        .icon {
            width: 180px;
            height: 180px;
            border-radius: 42px; /* Smooth Squircle */
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 75px;
            font-weight: 900;
            letter-spacing: -2px;
        }
        .icon:hover {
            transform: translateY(-15px) scale(1.05);
        }

        /* 1. Pure White Glassmorphism (Based on selected style 1) */
        .glass-light {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.05), inset 0 2px 10px rgba(255,255,255,0.8);
        }
        .glass-light .text {
            background: linear-gradient(135deg, #ff453a, #ff9f0a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 8px 10px rgba(255, 69, 58, 0.3));
        }

        /* 2. Light Cyberpunk Neon (Based on selected style 2) */
        .neon-light {
            background: #ffffff;
            border: 3px solid #ff453a;
            box-shadow: 0 0 25px rgba(255, 69, 58, 0.4), inset 0 0 15px rgba(255, 69, 58, 0.1);
        }
        .neon-light .text {
            color: #ff453a;
            text-shadow: 0 0 10px rgba(255, 69, 58, 0.5), 0 0 20px rgba(255, 159, 10, 0.4);
            font-style: italic;
        }

        /* 3. Soft Neumorphism */
        .neumorphic-light {
            background: #f1f5f9;
            box-shadow: 20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff;
            border: 1px solid #fff;
        }
        .neumorphic-light .text {
            color: #f1f5f9;
            text-shadow: -2px -2px 5px #fff, 3px 3px 6px rgba(0,0,0,0.2);
        }

        /* 4. Orange Sunset Glow */
        .sunset-light {
            background: linear-gradient(135deg, #ff453a, #ff9f0a);
            box-shadow: 0 20px 40px rgba(255, 69, 58, 0.4);
            border: 1px solid rgba(255,255,255,0.4);
        }
        .sunset-light .text {
            color: #ffffff;
            text-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* 5. Clean White Outline */
        .outline-light {
            background: #ffffff;
            box-shadow: 0 15px 35px rgba(0,0,0,0.06);
            border: 2px solid #e2e8f0;
        }
        .outline-light .text {
            color: transparent;
            -webkit-text-stroke: 3px #ff453a;
            filter: drop-shadow(0 5px 10px rgba(255, 69, 58, 0.2));
        }

        /* 6. Extruded 3D Pop */
        .pop-3d {
            background: #ffffff;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            border-bottom: 8px solid #cbd5e1;
        }
        .pop-3d .text {
            color: #ea580c;
            text-shadow: 
                1px 1px 0px #c2410c, 2px 2px 0px #c2410c,
                3px 3px 0px #c2410c, 4px 4px 0px #c2410c,
                5px 5px 0px #c2410c, 6px 6px 15px rgba(0,0,0,0.2);
        }

        /* 7. Frosted Crystal */
        .crystal {
            background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
            backdrop-filter: blur(25px);
            border: 1px solid #fff;
            box-shadow: 0 25px 45px rgba(0,0,0,0.05), inset 0 0 20px rgba(255,255,255,1);
        }
        .crystal .text {
            color: #dc2626;
            opacity: 0.9;
        }

        /* 8. Split Elegance */
        .split-light {
            background: linear-gradient(135deg, #ffffff 50%, #f1f5f9 50%);
            box-shadow: 0 15px 30px rgba(0,0,0,0.08);
            border: 1px solid #fff;
        }
        .split-light .text {
            background: linear-gradient(135deg, #ea580c, #dc2626);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* 9. Liquid Mesh Light */
        .mesh-light {
            background-color: #ffffff;
            background-image: 
                radial-gradient(at 0% 0%, rgba(255, 69, 58, 0.3) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(255, 159, 10, 0.3) 0px, transparent 50%);
            box-shadow: 0 15px 30px rgba(255, 69, 58, 0.15);
            border: 1px solid #fff;
        }
        .mesh-light .text {
            color: #fff;
            text-shadow: 0 5px 15px rgba(255, 69, 58, 0.5);
        }
        
        /* 10. Inner Shadow Engraved */
        .engraved-light {
            background: #f8fafc;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }
        .engraved-light .text {
            color: transparent;
            background: #e2e8f0;
            -webkit-background-clip: text;
            text-shadow: 2px 2px 3px rgba(255,255,255,1), -2px -2px 3px rgba(0,0,0,0.1);
        }

        /* 11-20 Dynamically generated below in Python */
    </style>
</head>
<body>
    <h1>TPR Ultra-Premium (App Theme Matched)</h1>
    <div class="grid">
"""

# Manual Top 10
styles = [
    ("Home Glassmorphism", "glass-light", "<div class='text'>TPR</div>"),
    ("VIP Cyber Neon", "neon-light", "<div class='text'>TPR</div>"),
    ("Soft Neumorphism", "neumorphic-light", "<div class='text'>TPR</div>"),
    ("Orange Sunset", "sunset-light", "<div class='text'>TPR</div>"),
    ("Clean Outline", "outline-light", "<div class='text'>TPR</div>"),
    ("Extruded 3D", "pop-3d", "<div class='text'>TPR</div>"),
    ("Frosted Crystal", "crystal", "<div class='text'>TPR</div>"),
    ("Split Elegance", "split-light", "<div class='text'>TPR</div>"),
    ("Liquid Mesh", "mesh-light", "<div class='text'>TPR</div>"),
    ("Engraved Shadow", "engraved-light", "<div class='text'>TPR</div>")
]

# Generate 10 more variations combining Home/VIP themes
for i in range(11, 21):
    html += f"""
    <style>
        .auto-{i} {{
            background: {'#ffffff' if i % 2 == 0 else 'linear-gradient(135deg, #fff, #f8fafc)'};
            box-shadow: 0 {10 + i}px {20 + i*2}px rgba({255 if i%3==0 else 0}, {69 if i%3==0 else 0}, {58 if i%3==0 else 0}, 0.08);
            border: {2 if i%4==0 else 1}px solid {'#ff453a' if i%4==0 else 'rgba(255,255,255,0.8)'};
            {'backdrop-filter: blur(15px);' if i%5==0 else ''}
        }}
        .auto-{i} .text {{
            color: {'#ff453a' if i % 2 != 0 else 'transparent'};
            {'background: linear-gradient(135deg, #ea580c, #dc2626); -webkit-background-clip: text;' if i % 2 == 0 else ''}
            text-shadow: 0 {i%5 * 2}px {i%5 * 5}px rgba(255, 69, 58, 0.2);
            {'font-style: italic;' if i % 6 == 0 else ''}
        }}
    </style>
    """
    styles.append((f"Premium Variant {i}", f"auto-{i}", "<div class='text'>TPR</div>"))

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
