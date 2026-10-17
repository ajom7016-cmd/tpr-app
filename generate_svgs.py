import os

output_dir = r"C:\Users\PC\Downloads\TPR_Logos"
os.makedirs(output_dir, exist_ok=True)

# Common SVG wrapper
def get_svg(content, defs=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <defs>
        {defs}
    </defs>
    {content}
</svg>"""

# 20 Distinct Premium Designs
designs = []

# 1. Neon Glow
designs.append(get_svg(
    """<text x="250" y="280" font-family="Arial, sans-serif" font-weight="900" font-size="180" text-anchor="middle" fill="url(#grad1)" filter="url(#glow)">TPR</text>""",
    """<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff7b00" />
        <stop offset="100%" stop-color="#ff0000" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>"""
))

# 2. 3D Bevel Text
designs.append(get_svg(
    """
    <text x="253" y="283" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="#880000">TPR</text>
    <text x="250" y="280" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="url(#grad2)">TPR</text>
    <text x="250" y="280" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="170" text-anchor="middle" fill="none" stroke="url(#grad2_light)" stroke-width="2"></text>
    """,
    """<linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff9900" />
        <stop offset="100%" stop-color="#cc0000" />
    </linearGradient>
    <linearGradient id="grad2_light" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>"""
))

# 3. Floating Glass Hexagon
designs.append(get_svg(
    """
    <polygon points="250,50 430,150 430,350 250,450 70,350 70,150" fill="url(#glassHex)" stroke="url(#hexBorder)" stroke-width="8" filter="url(#dropShadow)" />
    <text x="250" y="285" font-family="Impact, sans-serif" font-weight="bold" font-size="140" text-anchor="middle" fill="#ffffff" filter="url(#textShadow)">TPR</text>
    """,
    """<linearGradient id="glassHex" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4500" />
        <stop offset="100%" stop-color="#8b0000" />
    </linearGradient>
    <linearGradient id="hexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#ffb347" stop-opacity="0.2" />
    </linearGradient>
    <filter id="dropShadow">
        <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#ff4500" flood-opacity="0.4" />
    </filter>
    <filter id="textShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.5" />
    </filter>"""
))

# 4. Monogram Style overlapping
designs.append(get_svg(
    """
    <circle cx="250" cy="250" r="200" fill="none" stroke="url(#grad4)" stroke-width="15" filter="url(#shadow4)"/>
    <text x="250" y="290" font-family="Georgia, serif" font-weight="bold" font-style="italic" font-size="160" text-anchor="middle" fill="url(#grad4)" filter="url(#shadow4)">TPR</text>
    """,
    """<linearGradient id="grad4" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff3300" />
        <stop offset="50%" stop-color="#ffaa00" />
        <stop offset="100%" stop-color="#ff3300" />
    </linearGradient>
    <filter id="shadow4">
        <feDropShadow dx="5" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.2" />
    </filter>"""
))

# 5. Split Text
designs.append(get_svg(
    """
    <text x="250" y="270" font-family="Arial, sans-serif" font-weight="900" font-size="190" text-anchor="middle" fill="url(#grad5_top)" clip-path="url(#clipTop)">TPR</text>
    <text x="250" y="270" font-family="Arial, sans-serif" font-weight="900" font-size="190" text-anchor="middle" fill="url(#grad5_bot)" clip-path="url(#clipBot)">TPR</text>
    <line x1="50" y1="210" x2="450" y2="210" stroke="#ffffff" stroke-width="4" filter="url(#glow5)"/>
    """,
    """<linearGradient id="grad5_top" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff5500" />
        <stop offset="100%" stop-color="#ffaa00" />
    </linearGradient>
    <linearGradient id="grad5_bot" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#cc0000" />
        <stop offset="100%" stop-color="#550000" />
    </linearGradient>
    <clipPath id="clipTop"><rect x="0" y="0" width="500" height="210" /></clipPath>
    <clipPath id="clipBot"><rect x="0" y="210" width="500" height="290" /></clipPath>
    <filter id="glow5"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    """
))

# 6. Outline Modern
designs.append(get_svg(
    """<text x="250" y="280" font-family="Trebuchet MS, sans-serif" font-weight="900" font-size="180" text-anchor="middle" fill="none" stroke="url(#grad6)" stroke-width="8" stroke-linejoin="round">TPR</text>
    <text x="250" y="280" font-family="Trebuchet MS, sans-serif" font-weight="900" font-size="180" text-anchor="middle" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" transform="translate(-4, -4)"></text>""",
    """<linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff6600" />
        <stop offset="100%" stop-color="#990000" />
    </linearGradient>"""
))

# 7. Shield Emblem
designs.append(get_svg(
    """
    <path d="M 250 20 L 420 80 L 420 250 C 420 380 250 480 250 480 C 250 480 80 380 80 250 L 80 80 Z" fill="url(#grad7)" filter="url(#shadow7)"/>
    <path d="M 250 40 L 390 90 L 390 240 C 390 350 250 440 250 440 C 250 440 110 350 110 240 L 110 90 Z" fill="none" stroke="#ffffff" stroke-width="6" stroke-opacity="0.5"/>
    <text x="250" y="280" font-family="Arial, sans-serif" font-weight="900" font-size="120" text-anchor="middle" fill="#ffffff" filter="url(#shadow7)">TPR</text>
    <text x="250" y="340" font-family="Arial, sans-serif" font-weight="bold" font-size="24" text-anchor="middle" fill="#ffffff" letter-spacing="4">THE PET ROYAL</text>
    """,
    """<linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4e00" />
        <stop offset="100%" stop-color="#8a0000" />
    </linearGradient>
    <filter id="shadow7">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000" flood-opacity="0.3"/>
    </filter>"""
))

# 8. Gradient Mesh text
designs.append(get_svg(
    """<text x="250" y="290" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="200" text-anchor="middle" fill="url(#grad8)">TPR</text>""",
    """<radialGradient id="grad8" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffaa00" />
        <stop offset="50%" stop-color="#ff2a00" />
        <stop offset="100%" stop-color="#550000" />
    </radialGradient>"""
))

# 9. Minimalist Line Art
designs.append(get_svg(
    """
    <path d="M 100 250 L 400 250" stroke="url(#grad9)" stroke-width="4"/>
    <text x="250" y="230" font-family="Helvetica, sans-serif" font-weight="300" font-size="100" text-anchor="middle" fill="url(#grad9)" letter-spacing="10">TPR</text>
    <text x="250" y="290" font-family="Helvetica, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#555" letter-spacing="5">PREMIUM DIGITAL ASSETS</text>
    """,
    """<linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff6600" />
        <stop offset="100%" stop-color="#cc0000" />
    </linearGradient>"""
))

# 10. Folded Ribbon
designs.append(get_svg(
    """
    <path d="M 100 200 L 250 200 L 200 300 L 50 300 Z" fill="url(#grad10a)"/>
    <path d="M 250 200 L 400 200 L 450 300 L 300 300 Z" fill="url(#grad10b)"/>
    <path d="M 200 300 L 250 200 L 300 300 Z" fill="#aa0000"/>
    <text x="250" y="270" font-family="Arial, sans-serif" font-weight="900" font-size="90" text-anchor="middle" fill="#ffffff">TPR</text>
    """,
    """<linearGradient id="grad10a" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff8800" />
        <stop offset="100%" stop-color="#ff3300" />
    </linearGradient>
    <linearGradient id="grad10b" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ff3300" />
        <stop offset="100%" stop-color="#aa0000" />
    </linearGradient>"""
))

# Generate remaining 10 with various dynamic styles
for i in range(11, 21):
    # Dynamic styles
    angle = (i * 35) % 360
    color1 = f"hsl({(i*15 + 10)%40}, 100%, 50%)"  # Oranges to Reds
    color2 = f"hsl({(i*15)%30}, 100%, 30%)"
    
    shadow_offset = (i % 5) * 2 + 5
    
    content = f"""
    <rect x="50" y="50" width="400" height="400" rx="{i*5}" fill="url(#grad{i})" filter="url(#shadow{i})"/>
    <text x="250" y="280" font-family="Arial, sans-serif" font-weight="900" font-size="140" text-anchor="middle" fill="#ffffff">TPR</text>
    <text x="250" y="340" font-family="Arial, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#ffffff" opacity="0.8" letter-spacing="4">THE PET ROYAL</text>
    """
    
    defs = f"""
    <linearGradient id="grad{i}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate({angle})">
        <stop offset="0%" stop-color="{color1}" />
        <stop offset="100%" stop-color="{color2}" />
    </linearGradient>
    <filter id="shadow{i}">
        <feDropShadow dx="0" dy="{shadow_offset}" stdDeviation="{shadow_offset}" flood-color="{color2}" flood-opacity="0.6"/>
    </filter>
    """
    designs.append(get_svg(content, defs))

for idx, design in enumerate(designs):
    filename = os.path.join(output_dir, f"TPR_Logo_Ultra_Premium_{idx+1}.svg")
    with open(filename, "w", encoding="utf-8") as f:
        f.write(design)

print(f"Successfully generated {len(designs)} premium SVG logos at {output_dir}")
