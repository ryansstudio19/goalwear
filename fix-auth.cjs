const fs = require('fs');
let app = fs.readFileSync('src/pages/AccountAuth.jsx', 'utf8');

const regex = /if\s*\(user\)\s*\{[\s\S]*?return\s*\([\s\S]*?<div className="container-custom"[\s\S]*?<\/div>\s*\);\s*\}/;

if (regex.test(app)) {
  app = app.replace(regex, `if (user) {
    // If logged in, send them to the account dashboard
    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/account';
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
         <p style={{ color: 'var(--text-muted)' }}>Redirecting to your account...</p>
      </div>
    );
  }`);
  
  // Also add useEffect to redirect
  app = app.replace('const location = useLocation();', `const location = useLocation();
  useEffect(() => {
    if (user && !loading) {
      const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/account';
      navigate(redirectUrl, { replace: true });
    }
  }, [user, loading, navigate, location.search]);`);
  
  fs.writeFileSync('src/pages/AccountAuth.jsx', app, 'utf8');
  console.log("AccountAuth fixed");
} else {
  console.log("Could not find the block to replace");
}
