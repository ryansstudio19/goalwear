# ⚽ GoalWear — Premium Football Jersey E-Commerce

> A world-class, fully custom-coded football jersey shop with 3D interactive jersey viewer, bKash COD checkout, and an admin verification dashboard.

![GoalWear](https://img.shields.io/badge/GoalWear-Premium%20Football%20Jersey%20Shop-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Viewer-black?style=for-the-badge&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-Bundler-purple?style=for-the-badge&logo=vite)

---

## 🌟 Features

- **14 Full Pages**: Home, Shop, National Teams, Club Teams, New Arrivals, Best Sellers, Size Guide, Track Order, About Us, Contact, FAQ, Wishlist, Cart, Checkout
- **Interactive 3D Jersey Sandbox** — Drag to rotate, zoom in/out, front/back camera snaps using Three.js
- **Advanced Shop Filters** — Category, size, price range, and search filters
- **bKash Payment Flow** — Delivery fee prepayment via bKash + Cash On Delivery
- **Admin Panel** — Verify/reject bKash payments, update shipping status
- **Order Tracking** — Live stage tracker (Placed → Verified → Processing → Shipped → Delivered)
- **Wishlist & Cart** — Persistent via localStorage
- **Customer Reviews** — Dynamic star reviews with localStorage persistence
- **Size Calculator** — Height/weight based size recommendation
- **Dark Premium Design** — Glassmorphism, stadium spotlights, smooth animations

---

## 🗂️ Project Structure

```
goalwear/
├── index.html                  # SEO-optimized entry HTML
├── vite.config.js              # Vite bundler config
├── package.json                # Dependencies
└── src/
    ├── main.jsx                # React app entry point
    ├── App.jsx                 # SPA router / view manager
    ├── index.css               # Global design system & animations
    ├── data/
    │   └── products.js         # ⚙️ EDIT THIS to add/modify products
    ├── context/
    │   └── ShopContext.jsx     # Global state (cart, wishlist, orders)
    ├── components/
    │   ├── Navbar.jsx          # Sticky glassmorphic navigation
    │   ├── Footer.jsx          # Footer with newsletter & admin link
    │   ├── JerseyViewer3D.jsx  # Three.js 3D interactive jersey viewer
    │   ├── ProductCard.jsx     # Jersey product card component
    │   ├── QuickViewModal.jsx  # Quick-view lightbox
    │   └── ReviewsSection.jsx  # Reviews list + submission form
    └── pages/
        ├── Home.jsx            # Landing page with hero + 3D showcase
        ├── Shop.jsx            # Full shop with advanced filters
        ├── NationalTeams.jsx   # National team kits catalog
        ├── ClubTeams.jsx       # Club jerseys catalog
        ├── NewArrivals.jsx     # New season arrivals
        ├── BestSellers.jsx     # Most popular kits
        ├── ProductDetails.jsx  # Full product page + 3D viewer + reviews
        ├── SizeGuide.jsx       # Size chart + calculator
        ├── TrackOrder.jsx      # Order status tracker
        ├── Wishlist.jsx        # Saved favorites
        ├── Cart.jsx            # Shopping cart
        ├── Checkout.jsx        # bKash payment + shipping form
        ├── Confirmation.jsx    # Order success page
        ├── AboutUs.jsx         # Brand story
        ├── Contact.jsx         # Contact form
        ├── FAQ.jsx             # Searchable FAQ accordion
        └── AdminPanel.jsx      # 🔒 Admin order verification dashboard
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or above) installed on your system

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/goalwear.git

# 2. Navigate to project folder
cd goalwear

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## ⚙️ Customization (Edit from GitHub)

### Adding / Editing Products
Open **`src/data/products.js`** — each product object looks like this:

```js
{
  id: "arg-home-2024",
  name: "Argentina 2024 Home Jersey",
  category: "National Teams",    // "National Teams" or "Club Teams"
  price: 3850,                   // Price in BDT
  originalPrice: 4500,           // Original (crossed out) price
  isNew: true,                   // Shows "New" badge
  isBestSeller: true,            // Shows "Hot" badge
  rating: 4.9,
  image: "https://...",          // Product thumbnail image URL
  description: "...",
  sizes: ["S", "M", "L", "XL", "XXL"],
  design: {
    primaryColor: "#74acdf",     // Main jersey color
    secondaryColor: "#ffffff",   // Secondary color
    stripeType: "vertical",      // "vertical", "hoops", "solid", "sleeves-contrast"
    stripeColor: "#ffffff",
    sponsorText: "A F A",        // Text shown on front of 3D jersey
    numberText: "10",            // Squad number on back of 3D jersey
    collarColor: "#ffffff",
    badgeColor: "#e5c158"
  }
}
```

### Changing bKash Number
Search for `01799 887766` in `src/pages/Checkout.jsx` and replace with your bKash merchant number.

### Admin Panel Password
In `src/pages/AdminPanel.jsx`, change `'admin'` or `'goalwear'` to your preferred password:
```js
if (password === 'admin' || password === 'goalwear') {
```

---

## 💳 Payment Flow

1. Customer adds jerseys to cart
2. At checkout, instructions appear to send **150 BDT delivery fee** to your bKash number
3. Customer submits their bKash **Transaction ID (TxnID)**
4. Admin verifies in **Admin Panel** (accessible via the lock icon in footer)
5. Order status updates to "Shipped" → Customer can track on **Track Order** page
6. Jersey delivered via **Cash on Delivery (COD)**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Three.js | 3D jersey viewer |
| Vite | Build tool & dev server |
| Lucide React | Icons |
| Vanilla CSS | Styling & animations |
| localStorage | Cart, wishlist, order persistence |

---

## 📄 License

MIT License — Free to use, modify, and deploy commercially.

---

> Built with ❤️ for football fans everywhere. Made in Bangladesh 🇧🇩
