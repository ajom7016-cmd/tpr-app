const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\admin_original.html', 'utf8');

// Find all elements that look like tab buttons or section headers
const tabs = html.match(/<button.*?onclick="switchTab.*?>(.*?)<\/button>/g);
console.log("Tabs:", tabs);

const headers = html.match(/<h[1-3].*?>(.*?)<\/h[1-3]>/g);
console.log("Headers:", headers);
