import re

server_path = 'server.js'
with open(server_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add extensions: ['html'] to express.static
content = content.replace("app.use(express.static(path.join(__dirname, 'public')));", "app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));")

with open(server_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Server.js updated to serve .html extensions automatically.")