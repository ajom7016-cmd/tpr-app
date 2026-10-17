import urllib.request
import re

req = urllib.request.Request(
    'https://html.duckduckgo.com/html/?q=site:youtube.com+asus+plugged+in+not+charging+hard+reset',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'href="(https://www.youtube.com/watch\?v=[^"]+)"', html)
    if match:
        print(match.group(1))
    else:
        print("No match found")
except Exception as e:
    print(e)
