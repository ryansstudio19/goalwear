const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

const oldRoutes = `          {/* Customer Account & Order History */}
          <Route path="/account" element={<AccountAuth />} />
          <Route path="/account/login" element={<AccountAuth />} />
          <Route path="/account/orders" element={<CustomerOrders />} />
          <Route path="/orders" element={<Navigate to="/account/orders" replace />} />`;

const newRoutes = `          {/* Customer Account & Order History */}
          <Route path="/account/*" element={<AccountDashboard />} />
          <Route path="/account/login" element={<AccountAuth />} />
          <Route path="/orders" element={<Navigate to="/account/orders" replace />} />`;

if (app.includes(oldRoutes)) {
  app = app.replace(oldRoutes, newRoutes);
  fs.writeFileSync('src/App.jsx', app, 'utf8');
  console.log("Routes updated successfully");
} else {
  console.log("Could not find exact old routes string");
}
