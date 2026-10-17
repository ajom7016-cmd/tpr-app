import os

output_file = r"C:\Users\PC\Downloads\TPR_App_Icons.html"

# Base HTML setup with dark theme for contrast
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPR Ultra-Premium App Icons</title>
    <style>
        body {
            margin: 0;
            padding: 40px;
            background-color: #0f172a;
            font-family: system-ui, -apple-system, sans-serif;
            color: #fff;
        }
        h1 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 2.5rem;
            background: linear-gradient(to right, #ff7b00, #ff0000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
            justify-items: center;
        }
        .icon-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        .icon-label {
            font-size: 0.9rem;
            color: #94a3b8;
            font-weight: 500;
        }
        /* The App Icon Box */
        .app-icon {
            width: 180px;
            height: 180px;
            border-radius: 40px; /* iOS style squircle */
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            background: #fff;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .app-icon:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 30px 50px rgba(255, 100, 0, 0.3);
        }
        svg {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <h1>TPR - App Icon Variations</h1>
    <div class="grid">
"""

# Helper to generate SVG inside the app icon
def get_app_icon_svg(index, defs, content):
    return f"""
        <div class="icon-container">
            <div class="app-icon">
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {defs}
                    </defs>
                    {content}
                </svg>
            </div>
            <div class="icon-label">Variation {index}</div>
        </div>
"""

# 20 Distinct App Icon Designs (Code-based)
icons = []

# 1. Neumorphic White with Glowing Red Text
icons.append((
    """<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff7b00"/><stop offset="100%" stop-color="#cc0000"/></linearGradient>
       <filter id="glow1"><feDropShadow dx="0" dy="5" stdDeviation="10" flood-color="#ff0000" flood-opacity="0.6"/></filter>""",
    """<rect width="400" height="400" fill="#f8fafc"/>
       <text x="200" y="240" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="160" text-anchor="middle" fill="url(#grad1)" filter="url(#glow1)">TPR</text>"""
))

# 2. Dark Mode Premium Glass
icons.append((
    """<linearGradient id="grad2bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>
       <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff5500"/><stop offset="100%" stop-color="#ff9900"/></linearGradient>""",
    """<rect width="400" height="400" fill="url(#grad2bg)"/>
       <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
       <text x="200" y="240" font-family="Arial, sans-serif" font-weight="bold" font-size="140" text-anchor="middle" fill="url(#grad2)">TPR</text>"""
))

# 3. Vivid Orange Gradient Full Background
icons.append((
    """<linearGradient id="grad3bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff7b00"/><stop offset="100%" stop-color="#aa0000"/></linearGradient>
       <filter id="shadow3"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.5"/></filter>""",
    """<rect width="400" height="400" fill="url(#grad3bg)"/>
       <text x="200" y="250" font-family="Impact, sans-serif" font-weight="900" font-size="180" text-anchor="middle" fill="#ffffff" filter="url(#shadow3)">TPR</text>"""
))

# 4. White 3D Text on Orange
icons.append((
    """<linearGradient id="grad4bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ff5e00"/><stop offset="100%" stop-color="#d40000"/></linearGradient>""",
    """<rect width="400" height="400" fill="url(#grad4bg)"/>
       <text x="200" y="260" font-family="Verdana, sans-serif" font-weight="900" font-size="160" text-anchor="middle" fill="#ffb380">TPR</text>
       <text x="200" y="245" font-family="Verdana, sans-serif" font-weight="900" font-size="160" text-anchor="middle" fill="#ffffff">TPR</text>"""
))

# 5. Isometric Box Style
icons.append((
    """<linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff8800"/><stop offset="100%" stop-color="#990000"/></linearGradient>""",
    """<rect width="400" height="400" fill="#ffffff"/>
       <rect x="80" y="100" width="240" height="200" rx="30" fill="none" stroke="url(#grad5)" stroke-width="20"/>
       <text x="200" y="240" font-family="Arial, sans-serif" font-weight="900" font-size="110" text-anchor="middle" fill="url(#grad5)">TPR</text>"""
))

# 6. Glowing Wireframe Outline
icons.append((
    """<filter id="glow6"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>""",
    """<rect width="400" height="400" fill="#111"/>
       <text x="200" y="250" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="none" stroke="#ff4500" stroke-width="8" filter="url(#glow6)">TPR</text>"""
))

# 7. Split Diagonal Background
icons.append((
    """<linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3300"/><stop offset="100%" stop-color="#aa0000"/></linearGradient>""",
    """<rect width="400" height="400" fill="#ffffff"/>
       <polygon points="0,0 400,0 0,400" fill="url(#grad7)"/>
       <text x="200" y="245" font-family="Arial, sans-serif" font-weight="900" font-size="150" text-anchor="middle" fill="#ffffff">T<tspan fill="#333">PR</tspan></text>"""
))

# 8. Royal Gold & Red
icons.append((
    """<linearGradient id="gold8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd700"/><stop offset="50%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#cc5500"/></linearGradient>""",
    """<rect width="400" height="400" fill="#880000"/>
       <circle cx="200" cy="200" r="150" fill="none" stroke="url(#gold8)" stroke-width="12"/>
       <text x="200" y="245" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="130" text-anchor="middle" fill="url(#gold8)">TPR</text>"""
))

# 9. Concentric Circles
icons.append((
    """<linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#ff0000"/></linearGradient>""",
    """<rect width="400" height="400" fill="#fff"/>
       <circle cx="200" cy="200" r="160" fill="url(#grad9)" opacity="0.1"/>
       <circle cx="200" cy="200" r="120" fill="url(#grad9)" opacity="0.2"/>
       <circle cx="200" cy="200" r="80" fill="url(#grad9)"/>
       <text x="200" y="230" font-family="Arial, sans-serif" font-weight="900" font-size="80" text-anchor="middle" fill="#ffffff">TPR</text>"""
))

# 10. Floating overlapping transparent letters
icons.append((
    """<linearGradient id="g10" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ff5500"/><stop offset="100%" stop-color="#aa0000"/></linearGradient>""",
    """<rect width="400" height="400" fill="#f1f5f9"/>
       <text x="140" y="250" font-family="Impact, sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="url(#g10)" opacity="0.8">T</text>
       <text x="210" y="250" font-family="Impact, sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="url(#g10)" opacity="0.8">P</text>
       <text x="280" y="250" font-family="Impact, sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="url(#g10)" opacity="0.8">R</text>"""
))

# 11 - 20: Auto Generated variations
for i in range(11, 21):
    hue = (i * 15) % 40 + 10 # 10 to 50 (Reds to Oranges to Yellows)
    bg_color = f"hsl({hue}, 10%, 95%)" if i % 2 == 0 else f"hsl({hue}, 80%, 50%)"
    text_color = f"hsl({hue}, 90%, 40%)" if i % 2 == 0 else "#ffffff"
    shadow_color = f"hsl({hue}, 90%, 20%)"
    
    # Randomly choose geometric background
    shape = ""
    if i % 3 == 0:
        shape = f'<circle cx="200" cy="200" r="140" fill="none" stroke="{text_color}" stroke-width="15" opacity="0.2"/>'
    elif i % 3 == 1:
        shape = f'<rect x="80" y="80" width="240" height="240" rx="40" fill="none" stroke="{text_color}" stroke-width="10" opacity="0.3"/>'
    
    shadow = f'<filter id="sh{i}"><feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="{shadow_color}" flood-opacity="0.4"/></filter>'
    
    icons.append((
        shadow,
        f"""<rect width="400" height="400" fill="{bg_color}"/>
           {shape}
           <text x="200" y="250" font-family="Arial, sans-serif" font-weight="900" font-size="150" text-anchor="middle" fill="{text_color}" filter="url(#sh{i})">TPR</text>"""
    ))

# Build HTML
for idx, (defs, content) in enumerate(icons):
    html_content += get_app_icon_svg(idx + 1, defs, content)

html_content += """
    </div>
</body>
</html>
"""

with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Created {output_file} successfully.")
