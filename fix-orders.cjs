const fs = require('fs');
let app = fs.readFileSync('src/pages/CustomerOrders.jsx', 'utf8');

// Replace the top div wrapper
app = app.replace(
  /<div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '80px' }}>/,
  `<div className="fade-in">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 24px 0', color: 'white' }}>
        Order History
      </h2>`
);

// We need to make sure we remove the original Title if there was one, but wait, the top of CustomerOrders.jsx had:
/*
      {/* Title * /}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px' }}>
*/
