const fs = require('fs');
let app = fs.readFileSync('src/pages/CustomerOrders.jsx', 'utf8');

// Replace the outer container and breadcrumb block
app = app.replace(
  /<div className="container-custom" style=\{\{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '960px' \}\}>[\s\S]*?Back to Account<\/span>\s*<\/button>[\s\S]*?<\/div>\s*<\/div>/,
  `<div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 24px 0', color: 'white' }}>
        Order History
      </h2>`
);

fs.writeFileSync('src/pages/CustomerOrders.jsx', app, 'utf8');
console.log("CustomerOrders fixed");
