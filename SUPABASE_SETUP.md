# GoalWear Supabase Database Setup Guide

Welcome to the production database setup for **GoalWear**. Follow these steps to execute the approved schema and seed data in your Supabase project.

---

### Step 1: Open Supabase Project Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project.
2. In the left-hand sidebar, click on **SQL Editor**.

---

### Step 2: Run Schema Migration (`supabase_schema.sql`)
1. In the SQL Editor, click **New query**.
2. Copy the entire contents of `supabase_schema.sql` located in this repository's root.
3. Paste it into the query editor and click **Run**.
4. You should see `Success. No rows returned`.

This will configure:
* Enums: `user_role`, `order_status`, `payment_status`
* Tables: `profiles`, `categories`, `products`, `product_images`, `product_variants`, `inventory`, `inventory_movements`, `addresses`, `orders`, `order_items`, `order_status_history`, `notifications`
* Functions & Triggers: `get_current_user_role()`, `handle_new_user()` (auto-creates profile upon auth signup)
* Stored Procedure: `place_order_atomic()` (handles concurrency locks, price validation, inventory decrements, and order creation in one transaction)
* Row Level Security (RLS) policies for all tables
* Supabase Realtime publication on `orders`, `inventory`, and `notifications`

---

### Step 3: Run Initial Seed Data (`supabase_seed.sql`)
1. In the SQL Editor, open a **New query**.
2. Copy the entire contents of `supabase_seed.sql`.
3. Paste it into the editor and click **Run**.

This populates:
* Initial categories: `National Teams`, `Club Teams`
* Production products (Argentina 2026 World Champion, Real Madrid 24/25 Home, Barcelona 125th Anniversary, Brazil 2026 Home)
* Size variants (`M`, `L`, `XL`, `XXL`)
* Real physical inventory counts with low-stock thresholds

---

### Step 4: Add Environment Variables
Make sure your `.env` or deployment settings have:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Once connected, GoalWear will seamlessly synchronize real database records, authentic accounts, and atomic orders.
