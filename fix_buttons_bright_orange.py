import os
import glob
import re

directory = r"C:\Users\ajom7\Downloads\TPR\JMJ_App\public"
html_files = glob.glob(os.path.join(directory, "security_*", "code.html"))

old_btn_regex = re.compile(r'\.btn-primary\s*\{[^}]*rgba\(249,\s*115,\s*22[^}]*\}', re.DOTALL)

new_btn_css = """
        .btn-primary {
            width: 100%; padding: 18px; border-radius: 20px;
            background: linear-gradient(135deg, rgba(255, 122, 0, 0.95) 0%, rgba(249, 115, 22, 0.85) 100%);
            backdrop-filter: blur(20px);
            color: #ffffff; font-size: 18px; font-weight: 900;
            border: 1px solid rgba(255, 255, 255, 0.4);
            outline: none; transition: all 0.2s;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05), inset 0 2px 5px rgba(255, 255, 255, 0.4);
            display: flex; align-items: center; justify-content: center; gap: 8px;
            margin-top: 24px;
            opacity: 0.5; pointer-events: none;
        }
""".strip()

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '.btn-primary' in content and 'rgba(249, 115, 22' in content:
        new_content = old_btn_regex.sub(new_btn_css, content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated buttons to BRIGHT ORANGE in: {filepath}")
