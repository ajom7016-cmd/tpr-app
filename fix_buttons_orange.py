import os
import glob
import re

directory = r"C:\Users\ajom7\Downloads\TPR\JMJ_App\public"
html_files = glob.glob(os.path.join(directory, "security_*", "code.html"))

# Regex to find the blue button block we just inserted
old_btn_regex = re.compile(r'\.btn-primary\s*\{[^}]*rgba\(37,\s*99,\s*235[^}]*\}', re.DOTALL)

# New Orange button matching the app's primary theme (#ea580c)
new_btn_css = """
        .btn-primary {
            width: 100%; padding: 18px; border-radius: 20px;
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.85) 0%, rgba(234, 88, 12, 0.65) 100%);
            backdrop-filter: blur(20px);
            color: #ffffff; font-size: 18px; font-weight: 900;
            border: 1px solid rgba(253, 186, 116, 0.4);
            outline: none; transition: all 0.2s;
            box-shadow: 0 10px 25px rgba(234, 88, 12, 0.2), inset 0 2px 5px rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center; gap: 8px;
            margin-top: 24px;
            opacity: 0.5; pointer-events: none;
        }
""".strip()

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '.btn-primary' in content and 'rgba(37, 99, 235' in content:
        new_content = old_btn_regex.sub(new_btn_css, content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated buttons to ORANGE in: {filepath}")
