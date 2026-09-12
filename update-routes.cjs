const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const newRoutes = `          {/* Customer Account & Order History */}
          <Route path="/account/*" element={<AccountDashboard />} />
          <Route path="/account/login" element={<AccountAuth />} />
          <Route path="/orders" element={<Navigate to="/account/orders" replace />} />`;

// Simple regex replace to be safe
app = app.replace(/<Route path="\/account" element=\{<AccountAuth \/>\} \/>\s*<Route path="\/account\/login" element=\{<AccountAuth \/>\} \/>\s*<Route path="\/account\/orders" element=\{<CustomerOrders \/>\} \/>/, 
  `<Route path="/account/*" element={<AccountDashboard />} />\n          <Route path="/account/login" element={<AccountAuth />} />`);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log("Replaced!");
