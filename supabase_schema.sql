-- ==============================================================================
-- GOALWEAR PRODUCTION E-COMMERCE DATABASE SCHEMA & POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- Description: Production-ready relational schema with RLS, inventory control,
--              atomic checkout procedure, status history auditing & realtime triggers.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'staff', 'manager', 'admin', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'PACKED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'RETURN_REQUESTED',
        'RETURNED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'PENDING_VERIFICATION',
        'VERIFIED',
        'PAID',
        'REFUNDED',
        'FAILED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helper function to fetch role securely in RLS policies without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Automatically create a profile row upon Supabase Auth sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'customer'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    original_price NUMERIC(10,2) CHECK (original_price >= base_price),
    sku TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT VARIANTS (Size, color, SKU)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    size TEXT NOT NULL,
    color TEXT,
    price_override NUMERIC(10,2) CHECK (price_override >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INVENTORY
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL UNIQUE REFERENCES public.product_variants(id) ON DELETE CASCADE,
    current_stock INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    reserved_stock INT NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INVENTORY MOVEMENTS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    change_amount INT NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'PENDING',
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 120.00 CHECK (delivery_charge >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    payment_method TEXT NOT NULL DEFAULT 'COD_BKASH_DELIVERY',
    payment_status payment_status NOT NULL DEFAULT 'PENDING_VERIFICATION',
    bkash_number TEXT,
    bkash_txn_id TEXT,
    shipping_name TEXT NOT NULL,
    shipping_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL DEFAULT 'Dhaka',
    customer_notes TEXT,
    internal_notes TEXT,
    tracking_number TEXT,
    courier_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_size TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0)
);

-- 13. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT DEFAULT 'STAFF',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 15. ATOMIC CHECKOUT STORED PROCEDURE (Prevents race conditions & price tampering)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.place_order_atomic(
    p_customer_id UUID,
    p_shipping_name TEXT,
    p_shipping_phone TEXT,
    p_shipping_address TEXT,
    p_shipping_city TEXT,
    p_bkash_number TEXT,
    p_bkash_txn_id TEXT,
    p_customer_notes TEXT,
    p_items JSONB -- Array of { variant_id: UUID, quantity: INT }
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_item JSONB;
    v_variant RECORD;
    v_subtotal NUMERIC(10,2) := 0;
    v_delivery_charge NUMERIC(10,2) := 120.00;
    v_item_total NUMERIC(10,2);
    v_price NUMERIC(10,2);
    v_avail_stock INT;
    v_new_order RECORD;
BEGIN
    -- 1. Input sanitization
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order cannot be empty';
    END IF;

    -- 2. Generate unique order number (e.g. GW-10042)
    v_order_number := 'GW-' || LPAD((FLOOR(RANDOM() * 90000) + 10000)::TEXT, 5, '0');
    WHILE EXISTS (SELECT 1 FROM public.orders WHERE order_number = v_order_number) LOOP
        v_order_number := 'GW-' || LPAD((FLOOR(RANDOM() * 90000) + 10000)::TEXT, 5, '0');
    END LOOP;

    -- 3. Loop through items to validate stock and calculate trusted price from DB
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Lock inventory row FOR UPDATE to prevent race condition overselling
        SELECT 
            pv.id AS variant_id,
            pv.product_id,
            p.name AS product_name,
            pv.size AS variant_size,
            COALESCE(pv.price_override, p.base_price) AS unit_price,
            inv.id AS inventory_id,
            inv.current_stock,
            inv.reserved_stock
        INTO v_variant
        FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        JOIN public.inventory inv ON inv.variant_id = pv.id
        WHERE pv.id = (v_item->>'variant_id')::UUID
        FOR UPDATE OF inv;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Variant % not found or inactive', (v_item->>'variant_id');
        END IF;

        v_avail_stock := v_variant.current_stock - v_variant.reserved_stock;
        IF v_avail_stock < (v_item->>'quantity')::INT THEN
            RAISE EXCEPTION 'Insufficient stock for % (Size %). Only % available.', 
                v_variant.product_name, v_variant.variant_size, v_avail_stock;
        END IF;

        v_price := v_variant.unit_price;
        v_item_total := v_price * (v_item->>'quantity')::INT;
        v_subtotal := v_subtotal + v_item_total;
    END LOOP;

    -- 4. Create Master Order Record
    INSERT INTO public.orders (
        order_number,
        customer_id,
        status,
        subtotal,
        delivery_charge,
        discount,
        total,
        payment_method,
        payment_status,
        bkash_number,
        bkash_txn_id,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        customer_notes
    ) VALUES (
        v_order_number,
        p_customer_id,
        'PENDING',
        v_subtotal,
        v_delivery_charge,
        0.00,
        v_subtotal + v_delivery_charge,
        'COD_BKASH_DELIVERY',
        'PENDING_VERIFICATION',
        p_bkash_number,
        p_bkash_txn_id,
        p_shipping_name,
        p_shipping_phone,
        p_shipping_address,
        COALESCE(p_shipping_city, 'Dhaka'),
        p_customer_notes
    ) RETURNING id INTO v_order_id;

    -- 5. Insert order items & update inventory
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT 
            pv.id AS variant_id,
            pv.product_id,
            p.name AS product_name,
            pv.size AS variant_size,
            COALESCE(pv.price_override, p.base_price) AS unit_price
        INTO v_variant
        FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        WHERE pv.id = (v_item->>'variant_id')::UUID;

        v_price := v_variant.unit_price;
        v_item_total := v_price * (v_item->>'quantity')::INT;

        -- Order item insertion
        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_size,
            unit_price,
            quantity,
            total_price
        ) VALUES (
            v_order_id,
            v_variant.product_id,
            v_variant.variant_id,
            v_variant.product_name,
            v_variant.variant_size,
            v_price,
            (v_item->>'quantity')::INT,
            v_item_total
        );

        -- Reserve/Decrement Inventory
        UPDATE public.inventory
        SET current_stock = current_stock - (v_item->>'quantity')::INT,
            updated_at = NOW()
        WHERE variant_id = v_variant.variant_id;

        -- Record movement audit
        INSERT INTO public.inventory_movements (
            variant_id,
            change_amount,
            reason,
            reference_id,
            created_by
        ) VALUES (
            v_variant.variant_id,
            - (v_item->>'quantity')::INT,
            'ORDER_PLACED',
            v_order_number,
            p_customer_id
        );
    END LOOP;

    -- 6. Record Initial Order Status History
    INSERT INTO public.order_status_history (
        order_id,
        status,
        note,
        changed_by
    ) VALUES (
        v_order_id,
        'PENDING',
        'Order submitted by customer. bKash TxnID: ' || COALESCE(p_bkash_txn_id, 'N/A'),
        p_customer_id
    );

    -- 7. Add Staff Notification
    INSERT INTO public.notifications (
        target_role,
        title,
        message,
        link
    ) VALUES (
        'STAFF',
        'New Order: #' || v_order_number,
        'Customer ' || p_shipping_name || ' placed an order for ৳' || (v_subtotal + v_delivery_charge)::TEXT || '. Pending bKash verification.',
        '/admin?tab=orders'
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'total', v_subtotal + v_delivery_charge
    );
END;
$$;

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see/edit own profile; staff sees all
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Categories & Products: Public readable when active; Staff can CRUD
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Staff can manage categories" ON public.categories;
CREATE POLICY "Staff can manage categories" ON public.categories
    FOR ALL USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Staff can manage products" ON public.products;
CREATE POLICY "Staff can manage products" ON public.products
    FOR ALL USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

-- Product Images & Variants: Public readable; Staff CRUD
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images" ON public.product_images
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can manage product images" ON public.product_images;
CREATE POLICY "Staff can manage product images" ON public.product_images
    FOR ALL USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Public can view active variants" ON public.product_variants;
CREATE POLICY "Public can view active variants" ON public.product_variants
    FOR SELECT USING (is_active = true OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Staff can manage variants" ON public.product_variants;
CREATE POLICY "Staff can manage variants" ON public.product_variants
    FOR ALL USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

-- Inventory: Public can check stock availability; Staff has full access
DROP POLICY IF EXISTS "Public can view inventory" ON public.inventory;
CREATE POLICY "Public can view inventory" ON public.inventory
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can manage inventory" ON public.inventory;
CREATE POLICY "Staff can manage inventory" ON public.inventory
    FOR ALL USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

DROP POLICY IF EXISTS "Staff can view inventory movements" ON public.inventory_movements;
CREATE POLICY "Staff can view inventory movements" ON public.inventory_movements
    FOR ALL USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

-- Addresses: Customer only
DROP POLICY IF EXISTS "Users can manage own addresses" ON public.addresses;
CREATE POLICY "Users can manage own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- Orders: Customer can view their orders. Staff can view & update all orders
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
CREATE POLICY "Customers view own orders" ON public.orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid())
        OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner')
    );

DROP POLICY IF EXISTS "Allow atomic procedure and staff to insert orders" ON public.orders;
CREATE POLICY "Allow atomic procedure and staff to insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
    FOR UPDATE USING (public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'));

-- Order items: Customer can view items for their own orders
DROP POLICY IF EXISTS "View order items" ON public.order_items;
CREATE POLICY "View order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.customer_id = auth.uid() OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'))
        )
    );

DROP POLICY IF EXISTS "Insert order items" ON public.order_items;
CREATE POLICY "Insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Order Status History:
DROP POLICY IF EXISTS "View status history" ON public.order_status_history;
CREATE POLICY "View status history" ON public.order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_status_history.order_id
            AND (o.customer_id = auth.uid() OR public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'))
        )
    );

DROP POLICY IF EXISTS "Staff can insert status history" ON public.order_status_history;
CREATE POLICY "Staff can insert status history" ON public.order_status_history
    FOR INSERT WITH CHECK (true);

-- Notifications: Staff sees staff notifications; user sees own
DROP POLICY IF EXISTS "View notifications" ON public.notifications;
CREATE POLICY "View notifications" ON public.notifications
    FOR SELECT USING (
        (user_id = auth.uid())
        OR (target_role = 'STAFF' AND public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'))
    );

DROP POLICY IF EXISTS "Update notifications" ON public.notifications;
CREATE POLICY "Update notifications" ON public.notifications
    FOR UPDATE USING (
        (user_id = auth.uid())
        OR (target_role = 'STAFF' AND public.get_current_user_role() IN ('staff', 'manager', 'admin', 'owner'))
    );

-- Enable Realtime on key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
