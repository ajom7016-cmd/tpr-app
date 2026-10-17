import os

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TPR - Ultra Premium Profile Avatars</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 50px;
            background-color: #f1f5f9;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 60px;
            color: #1e293b;
        }
        h1 {
            font-family: 'Montserrat', sans-serif;
            font-size: 32px;
            color: #ea580c;
            text-align: center;
            margin-bottom: 20px;
        }
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 50px;
            max-width: 1200px;
        }
        .avatar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            background: white;
            padding: 30px;
            border-radius: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.04);
            border: 1px solid rgba(255,255,255,0.8);
            width: 200px;
        }
        .avatar-title {
            font-weight: 800;
            font-size: 14px;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: center;
        }

        /* Base Avatar Size */
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: 'Montserrat', sans-serif;
            font-size: 42px;
            font-weight: 900;
        }
        .avatar:hover {
            transform: scale(1.1) translateY(-10px);
        }

        /* 1. White Glass & Orange Glow Monogram */
        .av-1 {
            background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 1);
            box-shadow: 
                0 15px 35px rgba(234, 88, 12, 0.2), 
                inset 0 4px 10px rgba(255,255,255,1),
                inset 0 -4px 10px rgba(234,88,12,0.1);
            color: #ea580c;
            text-shadow: 2px 2px 5px rgba(234,88,12,0.3);
        }

        /* 2. 3D Neumorphic Gold/Orange Sphere */
        .av-2 {
            background: #f1f5f9;
            box-shadow: 
                -10px -10px 20px rgba(255,255,255,1),
                10px 10px 20px rgba(200,200,210,0.5),
                inset 2px 2px 5px rgba(255,255,255,1),
                inset -5px -5px 15px rgba(234,88,12,0.15);
            border: 4px solid #f1f5f9;
            color: #334155;
        }
        .av-2::after {
            content: '';
            position: absolute;
            top: 15%; left: 15%;
            width: 20%; height: 20%;
            border-radius: 50%;
            background: rgba(255,255,255,0.9);
            filter: blur(3px);
        }

        /* 3. Glowing Abstract Core (SVG User) */
        .av-3 {
            background: linear-gradient(135deg, #fff 0%, #fff0e6 100%);
            border: 2px solid rgba(234, 88, 12, 0.3);
            box-shadow: 0 0 30px rgba(234, 88, 12, 0.15);
            color: #ea580c;
        }
        .av-3 svg {
            width: 50px; height: 50px;
            fill: url(#orange-grad);
            filter: drop-shadow(0 5px 10px rgba(234,88,12,0.4));
        }

        /* 4. Holographic Glass Silhouette */
        .av-4 {
            background: linear-gradient(120deg, rgba(234,88,12,0.1), rgba(255,192,203,0.2), rgba(173,216,230,0.2));
            backdrop-filter: blur(25px);
            border: 2px solid rgba(255,255,255,0.9);
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            color: #ffffff;
            text-shadow: 0 4px 10px rgba(234,88,12,0.4);
        }
        .av-4 svg {
            width: 60px; height: 60px;
            fill: #ffffff;
            filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));
        }

        /* 5. 3D Floating Ember Initials */
        .av-5 {
            background: #ffffff;
            box-shadow: 0 20px 40px rgba(234, 88, 12, 0.15);
            border: 1px solid rgba(255,255,255,1);
            color: #ffffff;
        }
        .av-5::before {
            content: 'AL';
            position: absolute;
            z-index: 2;
            text-shadow: 
                0px 1px 0px #c2410c,
                0px 2px 0px #c2410c,
                0px 3px 0px #9a3412,
                0px 4px 0px #9a3412,
                0px 10px 15px rgba(234,88,12,0.6);
            color: #ea580c;
        }

    </style>
</head>
<body>
    <h1>TPR - Profile Avatars (100% Code)</h1>
    
    <!-- SVG Defs for gradients -->
    <svg width="0" height="0">
        <defs>
            <linearGradient id="orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
            </linearGradient>
        </defs>
    </svg>

    <div class="container">
        <div class="avatar-wrapper">
            <div class="avatar av-1">AL</div>
            <div class="avatar-title">1. White Glass & Orange Glow</div>
        </div>

        <div class="avatar-wrapper">
            <div class="avatar av-2">AL</div>
            <div class="avatar-title">2. 3D Neumorphic Sphere</div>
        </div>

        <div class="avatar-wrapper">
            <div class="avatar av-3">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            </div>
            <div class="avatar-title">3. Glowing Abstract Core</div>
        </div>

        <div class="avatar-wrapper">
            <div class="avatar av-4">
                <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
            <div class="avatar-title">4. Holographic Glass Silhouette</div>
        </div>

        <div class="avatar-wrapper">
            <div class="avatar av-5"></div>
            <div class="avatar-title">5. 3D Floating Ember</div>
        </div>
    </div>
</body>
</html>'''

file_path = r'C:\Users\PC\Downloads\TPR_Profile_Avatars.html'
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f'Created {file_path}')
