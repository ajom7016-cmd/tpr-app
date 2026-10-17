import os

output_file = r"C:\Users\PC\Downloads\TPR_3D_Orange_Lighting.html"

html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPR 3D Orange Lighting & Creative Variations</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Montserrat:wght@900&display=swap');
        
        body {
            margin: 0;
            padding: 40px;
            background-color: #f1f5f9; 
            font-family: 'Outfit', sans-serif;
            color: #1e293b;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(255, 69, 58, 0.1) 0%, transparent 60%),
                radial-gradient(circle at 90% 80%, rgba(255, 149, 0, 0.15) 0%, transparent 60%);
            background-attachment: fixed;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            text-align: center;
            background: linear-gradient(135deg, #ea580c, #dc2626);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 10px 20px rgba(234, 88, 12, 0.15);
        }

        h2 {
            font-size: 1.5rem;
            color: #64748b;
            margin-bottom: 50px;
            text-align: center;
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
            text-align: center;
        }

        .icon {
            width: 180px;
            height: 180px;
            border-radius: 42px; 
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'Montserrat', sans-serif;
            font-size: 70px;
            font-weight: 900;
            letter-spacing: -2px;
            background-color: #fff;
        }
        .icon:hover {
            transform: translateY(-15px) scale(1.05);
        }

"""

variations = []

# --- PART 1: User's Request (3D + Orange Lighting + Liquid Mesh base) ---

# 1. Extruded 3D + Heavy Orange Glow
variations.append({
    "name": "3D Orange Core",
    "bg": "radial-gradient(circle at 50% 50%, rgba(255, 149, 0, 0.3) 0%, transparent 70%)",
    "b_shadow": "0 15px 35px rgba(255, 149, 0, 0.2)",
    "text_color": "#ffffff",
    "t_shadow": "1px 1px 0px #ea580c, 2px 2px 0px #ea580c, 3px 3px 0px #c2410c, 4px 4px 0px #c2410c, 5px 5px 0px #9a3412, 6px 6px 0px #7c2d12, 0 10px 25px rgba(255, 149, 0, 0.8)"
})

# 2. Isometric 3D (White Text, Orange 3D Block, Neon Aura)
variations.append({
    "name": "Isometric Neon Glow",
    "bg": "radial-gradient(at 0% 0%, rgba(255, 69, 58, 0.2) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(255, 149, 0, 0.4) 0px, transparent 60%)",
    "b_shadow": "0 20px 40px rgba(255, 69, 58, 0.15)",
    "text_color": "#ffffff",
    "t_shadow": "-1px 1px 0 #f97316, -2px 2px 0 #ea580c, -3px 3px 0 #c2410c, -4px 4px 0 #9a3412, -5px 5px 0 #7c2d12, -10px 10px 20px rgba(249, 115, 22, 0.7)"
})

# 3. Floating 3D Gold/Orange
variations.append({
    "name": "Floating 3D Orange",
    "bg": "#ffffff",
    "b_shadow": "0 25px 50px rgba(234, 88, 12, 0.25), inset 0 0 40px rgba(255, 149, 0, 0.1)",
    "text_color": "#ffedd5",
    "t_shadow": "1px 1px 0 #fdba74, 2px 2px 0 #fb923c, 3px 3px 0 #f97316, 4px 4px 0 #ea580c, 5px 5px 0 #c2410c, 6px 6px 15px rgba(234, 88, 12, 0.5)"
})

# 4. Sunburst 3D
variations.append({
    "name": "Sunburst 3D",
    "bg": "radial-gradient(circle at center, rgba(250, 204, 21, 0.3) 0%, rgba(249, 115, 22, 0.2) 40%, transparent 80%)",
    "b_shadow": "0 10px 30px rgba(249, 115, 22, 0.2)",
    "text_color": "#ffffff",
    "t_shadow": "0 1px 0 #ea580c, 0 2px 0 #ea580c, 0 3px 0 #c2410c, 0 4px 0 #c2410c, 0 5px 0 #9a3412, 0 6px 0 #9a3412, 0 20px 30px rgba(249, 115, 22, 0.9)"
})

# 5. Diagonal 3D Extrusion
variations.append({
    "name": "Diagonal 3D Ember",
    "bg": "linear-gradient(135deg, rgba(255,255,255,1) 40%, rgba(255, 237, 213, 1) 100%)",
    "b_shadow": "10px 10px 30px rgba(234, 88, 12, 0.15)",
    "text_color": "#ffffff",
    "t_shadow": "1px -1px 0 #ea580c, 2px -2px 0 #ea580c, 3px -3px 0 #c2410c, 4px -4px 0 #c2410c, 5px -5px 0 #9a3412, 15px -15px 25px rgba(234, 88, 12, 0.6)"
})

# 6. Deep 3D Red-Orange
variations.append({
    "name": "Deep Red-Orange 3D",
    "bg": "radial-gradient(at 0% 100%, rgba(220, 38, 38, 0.2) 0px, transparent 60%), radial-gradient(at 100% 0%, rgba(234, 88, 12, 0.2) 0px, transparent 60%)",
    "b_shadow": "0 20px 40px rgba(220, 38, 38, 0.1)",
    "text_color": "#ffffff",
    "t_shadow": "1px 1px 0 #dc2626, 2px 2px 0 #b91c1c, 3px 3px 0 #991b1b, 4px 4px 0 #7f1d1d, 5px 5px 0 #450a0a, 0 15px 25px rgba(234, 88, 12, 0.7)"
})

# 7. Liquid Mesh + Soft 3D
variations.append({
    "name": "Liquid Mesh Soft 3D",
    "bg": "radial-gradient(at 0% 0%, rgba(255, 69, 58, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 159, 10, 0.3) 0px, transparent 50%)",
    "b_shadow": "0 15px 30px rgba(255, 69, 58, 0.15)",
    "text_color": "#ffffff",
    "t_shadow": "1px 1px 0 #ff9f0a, 2px 2px 0 #ff453a, 3px 3px 0 #d70015, 0 8px 20px rgba(255, 159, 10, 0.8)"
})

# 8. Glassmorphic 3D Pop
variations.append({
    "name": "Glassmorphic 3D Pop",
    "bg": "rgba(255, 255, 255, 0.5)",
    "backdrop": "blur(20px)",
    "border": "1px solid rgba(255,255,255,0.8)",
    "b_shadow": "0 25px 45px rgba(234, 88, 12, 0.15)",
    "text_color": "#ffffff",
    "t_shadow": "-1px -1px 0 #ea580c, -2px -2px 0 #ea580c, -3px -3px 0 #c2410c, -4px -4px 0 #9a3412, -10px -10px 25px rgba(255, 149, 0, 0.6)"
})

# 9. Vivid Spotlight 3D
variations.append({
    "name": "Vivid Spotlight 3D",
    "bg": "radial-gradient(circle at 50% 20%, rgba(255, 123, 0, 0.4) 0%, transparent 60%)",
    "b_shadow": "0 15px 35px rgba(255, 123, 0, 0.2)",
    "text_color": "#ffffff",
    "t_shadow": "0 1px 0 #ff7b00, 0 2px 0 #ff7b00, 0 3px 0 #cc5500, 0 4px 0 #cc5500, 0 5px 0 #993300, 0 20px 20px rgba(255, 123, 0, 0.6)"
})

# 10. Inner Glow 3D
variations.append({
    "name": "Inner Glow 3D",
    "bg": "#ffffff",
    "b_shadow": "0 20px 40px rgba(0,0,0,0.05), inset 0 0 30px rgba(255, 149, 0, 0.15)",
    "border": "1px solid #ffedd5",
    "text_color": "#ffffff",
    "t_shadow": "1px 1px 0 #f97316, 2px 2px 0 #ea580c, 3px 3px 0 #c2410c, 4px 4px 0 #9a3412, 5px 5px 15px rgba(234, 88, 12, 0.8), inset 0 0 10px #fff"
})


# --- PART 2: My Own Creative Additions (Ultra Premium) ---

# 11. White Chrome
variations.append({
    "name": "White Chrome",
    "bg": "linear-gradient(135deg, #ffffff 0%, #f1f5f9 40%, #e2e8f0 50%, #f8fafc 60%, #ffffff 100%)",
    "b_shadow": "0 20px 30px rgba(0,0,0,0.1), inset 0 2px 5px #fff",
    "text_color": "transparent",
    "t_shadow": "2px 2px 4px rgba(0,0,0,0.2), -2px -2px 4px rgba(255,255,255,1)",
    "text_bg": "linear-gradient(135deg, #ea580c, #dc2626)"
})

# 12. Molten Gold Text
variations.append({
    "name": "Molten Gold 3D",
    "bg": "#ffffff",
    "b_shadow": "0 15px 35px rgba(250, 204, 21, 0.2)",
    "text_color": "transparent",
    "t_shadow": "1px 1px 0px #b45309, 2px 2px 0px #78350f, 3px 3px 10px rgba(180, 83, 9, 0.5)",
    "text_bg": "linear-gradient(to bottom, #fde047, #eab308, #ca8a04)"
})

# 13. Deep Space Aura (Special contrast version)
variations.append({
    "name": "Deep Space Aura",
    "bg": "#0f172a",
    "b_shadow": "0 25px 50px rgba(0,0,0,0.5)",
    "text_color": "#ffffff",
    "t_shadow": "0 0 15px #38bdf8, 0 0 30px #818cf8, 0 0 50px #c084fc",
    "border": "1px solid rgba(255,255,255,0.1)"
})

# 14. Holographic Glass
variations.append({
    "name": "Holographic Glass",
    "bg": "linear-gradient(120deg, rgba(255,192,203,0.3), rgba(173,216,230,0.3), rgba(152,251,152,0.3))",
    "backdrop": "blur(20px)",
    "b_shadow": "0 15px 30px rgba(0,0,0,0.05)",
    "border": "1px solid rgba(255,255,255,0.8)",
    "text_color": "#ffffff",
    "t_shadow": "2px 2px 10px rgba(0,0,0,0.1)"
})

# 15. The Ruby Jewel
variations.append({
    "name": "The Ruby Jewel",
    "bg": "linear-gradient(135deg, #ff0000 0%, #8b0000 100%)",
    "b_shadow": "0 20px 40px rgba(139,0,0,0.5), inset 0 5px 15px rgba(255,255,255,0.4)",
    "border": "1px solid #ff4d4d",
    "text_color": "#ffffff",
    "t_shadow": "0 2px 5px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3)"
})

# 16. Pure Neumorphic Extrusion
variations.append({
    "name": "Pure Neumorphic Extrusion",
    "bg": "#f1f5f9",
    "b_shadow": "20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff",
    "text_color": "#f1f5f9",
    "t_shadow": "1px 1px 0 #fff, 2px 2px 0 #fff, 3px 3px 0 #cbd5e1, 4px 4px 0 #cbd5e1, 5px 5px 0 #94a3b8, 10px 10px 20px rgba(0,0,0,0.1)"
})

# 17. Electric Blue Fire (App Theme Contrast)
variations.append({
    "name": "Electric Blue Contrast",
    "bg": "#ffffff",
    "b_shadow": "0 15px 35px rgba(14, 165, 233, 0.2)",
    "border": "1px solid #e0f2fe",
    "text_color": "#ffffff",
    "t_shadow": "1px 1px 0 #0ea5e9, 2px 2px 0 #0284c7, 3px 3px 0 #0369a1, 0 10px 25px rgba(14, 165, 233, 0.6)"
})

# 18. Frosted Orange Cutout
variations.append({
    "name": "Frosted Orange Cutout",
    "bg": "rgba(234, 88, 12, 0.8)",
    "backdrop": "blur(30px)",
    "b_shadow": "0 20px 40px rgba(234, 88, 12, 0.3)",
    "text_color": "rgba(234, 88, 12, 0.8)",
    "t_shadow": "-2px -2px 4px rgba(255,255,255,0.5), 2px 2px 5px rgba(0,0,0,0.3)",
    "border": "1px solid rgba(255,255,255,0.4)"
})

# 19. Minimalist Apple Style
variations.append({
    "name": "Apple Style Minimal",
    "bg": "#ffffff",
    "b_shadow": "0 10px 25px rgba(0,0,0,0.05)",
    "border": "1px solid #f1f5f9",
    "text_color": "#111827",
    "t_shadow": "0 0 0 transparent"
})

# 20. Supernova 3D
variations.append({
    "name": "Supernova 3D",
    "bg": "linear-gradient(135deg, #ff0000, #ff7b00, #ff0000)",
    "b_shadow": "0 25px 50px rgba(255, 0, 0, 0.4), inset 0 0 20px rgba(255,255,255,0.5)",
    "text_color": "#ffffff",
    "t_shadow": "1px 1px 0 #990000, 2px 2px 0 #660000, 3px 3px 0 #330000, 4px 4px 10px rgba(0,0,0,0.5)"
})


for i, v in enumerate(variations):
    backdrop = f"backdrop-filter: {v['backdrop']}; -webkit-backdrop-filter: {v['backdrop']};" if "backdrop" in v else ""
    border = f"border: {v['border']};" if "border" in v else "border: 1px solid #fff;"
    text_bg = f"background: {v['text_bg']}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;" if "text_bg" in v else ""
    
    html += f"""
        .mesh-{i} {{
            background: {v['bg']};
            box-shadow: {v['b_shadow']};
            {border}
            {backdrop}
        }}
        .mesh-{i} .text {{
            color: {v['text_color']};
            text-shadow: {v['t_shadow']};
            {text_bg}
        }}
    """

html += """
    </style>
</head>
<body>
    <h1>TPR - 3D Orange Lighting & Premium Customs</h1>
    <h2>Part 1: True 3D Extrusion + Orange Lighting</h2>
    <div class="grid" style="margin-bottom: 80px;">
"""

for i in range(10):
    v = variations[i]
    html += f"""
        <div class="container">
            <div class="icon mesh-{i}"><div class="text">TPR</div></div>
            <div class="label">{v['name']}</div>
        </div>
    """

html += """
    </div>
    <h2>Part 2: Creative Ultra Premium (My Choices)</h2>
    <div class="grid">
"""

for i in range(10, 20):
    v = variations[i]
    html += f"""
        <div class="container">
            <div class="icon mesh-{i}"><div class="text">TPR</div></div>
            <div class="label">{v['name']}</div>
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
