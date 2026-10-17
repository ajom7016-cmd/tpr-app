const http = require('http');
http.get('http://104.247.110.22/index.html', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    let lines = data.split('\n');
    let previewLines = lines.filter(l => l.includes('.app-preview-section'));
    console.log("Found app preview CSS:", previewLines);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
