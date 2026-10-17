import re

filepath = 'public/investment_premium_glass/vip.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the button wrapper in all cards
content = content.replace(
    '<div class="w-full mt-2">', 
    '<div class="absolute -bottom-4 left-4 right-4 z-20">'
)

# We can also remove justify-between from the card if we want, but it doesn't hurt to leave it.
# Actually, if the button is absolute, justify-between will only apply to the top section (since it's the only relative child).
# Let's remove pb-3 since the button is absolute now, the bottom padding of the card doesn't affect the button.
# Or just leave it as is.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Buttons made absolute.")