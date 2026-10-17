import os

output_file = r"C:\Users\PC\Downloads\TPR_Liquid_Mesh_Variations.html"

html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPR Liquid Mesh Variations</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;700;900&display=swap');
        
        body {
            margin: 0;
            padding: 40px;
            background-color: #f1f5f9; 
            font-family: 'Outfit', 'Inter', sans-serif;
            color: #1e293b;
            display: flex;
            flex-direction: column;
            align-items: center;
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
            font-size: 75px;
            font-weight: 900;
            letter-spacing: -2px;
        }
        .icon:hover {
            transform: translateY(-15px) scale(1.05);
        }

"""

variations = [
    # 1. Original (Baseline)
    {
        "name": "Original Mesh",
        "bg": "radial-gradient(at 0% 0%, rgba(255, 69, 58, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 159, 10, 0.3) 0px, transparent 50%)",
        "t_shadow": "0 5px 15px rgba(255, 69, 58, 0.5)",
        "b_shadow": "0 15px 30px rgba(255, 69, 58, 0.15)"
    },
    # 2. Sunset Core
    {
        "name": "Sunset Core",
        "bg": "radial-gradient(at 50% 50%, rgba(255, 94, 0, 0.25) 0px, transparent 70%)",
        "t_shadow": "0 8px 20px rgba(255, 94, 0, 0.6)",
        "b_shadow": "0 20px 40px rgba(255, 94, 0, 0.1)"
    },
    # 3. Soft Rose
    {
        "name": "Soft Rose",
        "bg": "radial-gradient(at 100% 0%, rgba(255, 45, 85, 0.2) 0px, transparent 60%), radial-gradient(at 0% 100%, rgba(255, 149, 0, 0.2) 0px, transparent 60%)",
        "t_shadow": "0 6px 12px rgba(255, 45, 85, 0.4)",
        "b_shadow": "0 15px 35px rgba(255, 45, 85, 0.1)"
    },
    # 4. Diagonal Warmth
    {
        "name": "Diagonal Warmth",
        "bg": "radial-gradient(at 0% 100%, rgba(255, 69, 58, 0.35) 0px, transparent 60%), radial-gradient(at 100% 0%, rgba(255, 204, 0, 0.2) 0px, transparent 60%)",
        "t_shadow": "0 4px 10px rgba(255, 69, 58, 0.6)",
        "b_shadow": "0 10px 25px rgba(255, 69, 58, 0.2)"
    },
    # 5. Vivid Top
    {
        "name": "Vivid Top",
        "bg": "radial-gradient(at 50% 0%, rgba(255, 69, 58, 0.4) 0px, transparent 70%)",
        "t_shadow": "0 -5px 15px rgba(255, 69, 58, 0.5), 0 5px 15px rgba(255, 69, 58, 0.2)",
        "b_shadow": "0 25px 50px rgba(255, 69, 58, 0.15)"
    },
    # 6. Golden Hour
    {
        "name": "Golden Hour",
        "bg": "radial-gradient(at 0% 50%, rgba(255, 149, 0, 0.4) 0px, transparent 60%), radial-gradient(at 100% 50%, rgba(255, 204, 0, 0.3) 0px, transparent 60%)",
        "t_shadow": "0 5px 15px rgba(255, 149, 0, 0.6)",
        "b_shadow": "0 15px 30px rgba(255, 149, 0, 0.15)"
    },
    # 7. Deep Ruby Blend
    {
        "name": "Deep Ruby Blend",
        "bg": "radial-gradient(at 0% 0%, rgba(220, 38, 38, 0.35) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(220, 38, 38, 0.15) 0px, transparent 60%)",
        "t_shadow": "0 6px 18px rgba(220, 38, 38, 0.7)",
        "b_shadow": "0 20px 35px rgba(220, 38, 38, 0.2)"
    },
    # 8. Twin Glow
    {
        "name": "Twin Glow",
        "bg": "radial-gradient(at 20% 20%, rgba(255, 69, 58, 0.3) 0px, transparent 40%), radial-gradient(at 80% 80%, rgba(255, 159, 10, 0.3) 0px, transparent 40%)",
        "t_shadow": "0 0 20px rgba(255, 69, 58, 0.5)",
        "b_shadow": "0 15px 40px rgba(255, 100, 10, 0.15)"
    },
    # 9. Center Bloom
    {
        "name": "Center Bloom",
        "bg": "radial-gradient(circle at 50% 50%, rgba(255, 100, 50, 0.2) 0px, rgba(255, 255, 255, 0.9) 60%)",
        "t_shadow": "0 8px 25px rgba(255, 69, 58, 0.4)",
        "b_shadow": "0 20px 40px rgba(0, 0, 0, 0.05)"
    },
    # 10. Ambient Edge
    {
        "name": "Ambient Edge",
        "bg": "radial-gradient(at 100% 0%, rgba(255, 69, 58, 0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 69, 58, 0.25) 0px, transparent 50%)",
        "t_shadow": "0 5px 15px rgba(255, 69, 58, 0.5)",
        "b_shadow": "0 10px 30px rgba(255, 69, 58, 0.1), inset 0 0 15px rgba(255,69,58,0.05)"
    }
]

for i, v in enumerate(variations):
    html += f"""
        .mesh-{i} {{
            background-color: #ffffff;
            background-image: {v['bg']};
            box-shadow: {v['b_shadow']};
            border: 1px solid #fff;
        }}
        .mesh-{i} .text {{
            color: #fff;
            text-shadow: {v['t_shadow']};
        }}
    """

html += """
    </style>
</head>
<body>
    <h1>TPR - Liquid Mesh Variations</h1>
    <div class="grid">
"""

for i, v in enumerate(variations):
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
