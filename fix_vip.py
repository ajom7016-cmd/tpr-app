import re

filepath = 'public/investment_premium_glass/vip.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace for regular cards
content = content.replace(
    'class="glass-card rounded-[36px] p-5 pb-5 h-[260px] flex flex-col justify-between relative"', 
    'class="glass-card rounded-[36px] p-5 pb-4 relative flex flex-col gap-2"'
)

# Replace for gold card
content = content.replace(
    'class="glass-card-gold rounded-[36px] p-5 pb-5 h-[260px] flex flex-col justify-between relative"', 
    'class="glass-card-gold rounded-[36px] p-5 pb-4 relative flex flex-col gap-2"'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("VIP cards updated successfully.")