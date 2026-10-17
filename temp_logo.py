import sys
from PIL import Image, ImageDraw, ImageFont

img = Image.new('RGB', (1024, 1024))
draw = ImageDraw.Draw(img)

for y in range(1024):
    for x in range(1024):
        ratio = (x + y) / 2048.0
        if ratio < 0.5:
            r2 = ratio * 2
            r = int(255 + r2 * (223 - 255))
            g = int(228 + r2 * (241 - 228))
            b = int(232 + r2 * (248 - 232))
        else:
            r2 = (ratio - 0.5) * 2
            r = int(223 + r2 * (220 - 223))
            g = int(241 + r2 * (255 - 241))
            b = int(248 + r2 * (220 - 248))
        img.putpixel((x, y), (r, g, b))

try:
    font = ImageFont.truetype("arialbd.ttf", 380)
except:
    font = ImageFont.load_default()

text = "TPR"
bbox = draw.textbbox((0,0), text, font=font)
w = bbox[2] - bbox[0]
h = bbox[3] - bbox[1]
x = (1024 - w) / 2
y = (1024 - h) / 2 - 50

draw.text((x+10, y+20), text, font=font, fill=(0, 0, 0, 25))
draw.text((x, y), text, font=font, fill="white")

img.save(r"C:\Users\PC\.gemini\antigravity\brain\e02caf93-9b78-47bc-b48d-4cf3f068acf1\app-icon-1024.png")
