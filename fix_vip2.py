import re

filepath = 'public/investment_premium_glass/vip.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the card wrappers
content = content.replace(
    'class="glass-card rounded-[36px] p-5 pb-4 relative flex flex-col gap-2"', 
    'class="glass-card rounded-[36px] p-4 pb-3 relative flex flex-col justify-between h-[225px]"'
)
content = content.replace(
    'class="glass-card-gold rounded-[36px] p-5 pb-4 relative flex flex-col gap-2"', 
    'class="glass-card-gold rounded-[36px] p-4 pb-3 relative flex flex-col justify-between h-[225px]"'
)

# Also fix the inner mb-3 to mb-2 to save space
content = content.replace('class="flex justify-between items-start mb-3 relative z-10"', 'class="flex justify-between items-start mb-1 relative z-10"')

# Fix pt-4 for the number to pt-2
content = content.replace('class="flex flex-col items-center justify-center w-[45%] pt-4"', 'class="flex flex-col items-center justify-center w-[45%] pt-1"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("VIP cards updated successfully.")