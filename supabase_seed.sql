-- ==============================================================================
-- GOALWEAR SEED DATA
-- Inserts default categories, catalog products, variants, and initial inventory.
-- ==============================================================================

DO $$
DECLARE
    v_cat_national UUID;
    v_cat_club UUID;
    v_prod_id UUID;
    v_var_m UUID;
    v_var_l UUID;
    v_var_xl UUID;
    v_var_xxl UUID;
BEGIN
    -- 1. Categories
    INSERT INTO public.categories (name, slug, description, display_order)
    VALUES 
        ('National Teams', 'national-teams', 'Authentic national squad football jerseys', 1)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_national;

    INSERT INTO public.categories (name, slug, description, display_order)
    VALUES 
        ('Club Teams', 'club-teams', 'Elite European and worldwide football club kits', 2)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_club;

    -- 2. Argentina 2026 World Champion Edition
    INSERT INTO public.products (
        category_id, name, slug, description, base_price, original_price, sku, is_active, is_featured, is_bestseller, specs
    ) VALUES (
        v_cat_national,
        'Argentina 2026 World Champion Edition',
        'argentina-2026-world-champion',
        'Official Three-Star Argentina home jersey celebrating world championship heritage. Features breathable micro-mesh structure with gold-embossed crest and commemorative back neck detail.',
        2490.00,
        2990.00,
        'ARG-2026-WC',
        true,
        true,
        true,
        '{"material": "100% Recycled Polyester (AEROREADY)", "fit": "Slim Athletic Fit", "origin": "Official Replica Standard", "washCare": "Machine wash cold inside out"}'::jsonb
    ) ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    -- Images
    INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
    VALUES 
        (v_prod_id, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80', 'Argentina Home Jersey Front', true, 1),
        (v_prod_id, 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80', 'Argentina Jersey Texture Detail', false, 2);

    -- Variants & Inventory
    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'ARG-2026-WC-M', 'M', 'Sky Blue / White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_m;
    INSERT INTO public.inventory (variant_id, current_stock, low_stock_threshold) VALUES (v_var_m, 24, 5) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 24;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'ARG-2026-WC-L', 'L', 'Sky Blue / White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_l;
    INSERT INTO public.inventory (variant_id, current_stock, low_stock_threshold) VALUES (v_var_l, 18, 5) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 18;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'ARG-2026-WC-XL', 'XL', 'Sky Blue / White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_xl;
    INSERT INTO public.inventory (variant_id, current_stock, low_stock_threshold) VALUES (v_var_xl, 12, 5) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 12;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'ARG-2026-WC-XXL', 'XXL', 'Sky Blue / White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_xxl;
    INSERT INTO public.inventory (variant_id, current_stock, low_stock_threshold) VALUES (v_var_xxl, 6, 3) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 6;


    -- 3. Real Madrid 24/25 Home Authentic
    INSERT INTO public.products (
        category_id, name, slug, description, base_price, original_price, sku, is_active, is_featured, is_bestseller, specs
    ) VALUES (
        v_cat_club,
        'Real Madrid 24/25 Home Authentic',
        'real-madrid-24-25-home',
        'Classic royal white finish with bespoke houndstooth jacquard weave. Gold Champions League 15 badge edition with lightweight heat-pressed silicone crest.',
        2590.00,
        3100.00,
        'RMA-2425-HM',
        true,
        true,
        true,
        '{"material": "HEAT.RDY 100% Engineered Jacquard", "fit": "Authentic Pro Cut", "origin": "Official Fan Version", "washCare": "Cold wash only"}'::jsonb
    ) ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
    VALUES 
        (v_prod_id, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80', 'Real Madrid Home Jersey', true, 1);

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'RMA-2425-HM-M', 'M', 'Pure White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_m;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_m, 20) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 20;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'RMA-2425-HM-L', 'L', 'Pure White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_l;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_l, 15) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 15;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'RMA-2425-HM-XL', 'XL', 'Pure White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_xl;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_xl, 10) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 10;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'RMA-2425-HM-XXL', 'XXL', 'Pure White')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_xxl;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_xxl, 4) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 4;


    -- 4. Barcelona 125th Anniversary Kit
    INSERT INTO public.products (
        category_id, name, slug, description, base_price, original_price, sku, is_active, is_featured, is_bestseller, specs
    ) VALUES (
        v_cat_club,
        'Barcelona 125th Anniversary Heritage',
        'barcelona-125th-anniversary',
        'Split half-and-half Blaugrana design inspired by the 1899 founding shirt. Centered golden retro crest and breathable sweat-wicking knit.',
        2490.00,
        2990.00,
        'FCB-125-HM',
        true,
        true,
        false,
        '{"material": "Dri-FIT ADV Double Knit", "fit": "Standard Modern Cut", "origin": "Replica Edition", "washCare": "Hand wash recommended"}'::jsonb
    ) ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
    VALUES 
        (v_prod_id, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80', 'Barcelona Anniversary Shirt', true, 1);

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'FCB-125-HM-M', 'M', 'Deep Royal / Noble Red')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_m;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_m, 16) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 16;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'FCB-125-HM-L', 'L', 'Deep Royal / Noble Red')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_l;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_l, 14) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 14;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'FCB-125-HM-XL', 'XL', 'Deep Royal / Noble Red')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_xl;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_xl, 8) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 8;


    -- 5. Brazil Seleção Canarinho 2026 Home
    INSERT INTO public.products (
        category_id, name, slug, description, base_price, original_price, sku, is_active, is_featured, is_bestseller, specs
    ) VALUES (
        v_cat_national,
        'Brazil Seleção Canarinho 2026 Home',
        'brazil-2026-home',
        'Vibrant Canary Yellow with subtle Jaguar watermarked print textures celebrating Amazon wildlife and 5-star pride.',
        2390.00,
        2890.00,
        'BRA-2026-HM',
        true,
        false,
        true,
        '{"material": "Nike Breathe Fabric", "fit": "Athletic Comfort", "origin": "Fan Edition", "washCare": "Machine wash warm"}'::jsonb
    ) ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_images (product_id, image_url, alt_text, is_primary, display_order)
    VALUES 
        (v_prod_id, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', 'Brazil Home Jersey', true, 1);

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'BRA-2026-HM-M', 'M', 'Dynamic Yellow / Green')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_m;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_m, 18) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 18;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'BRA-2026-HM-L', 'L', 'Dynamic Yellow / Green')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_l;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_l, 12) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 12;

    INSERT INTO public.product_variants (product_id, sku, size, color)
    VALUES (v_prod_id, 'BRA-2026-HM-XL', 'XL', 'Dynamic Yellow / Green')
    ON CONFLICT (sku) DO UPDATE SET size = EXCLUDED.size RETURNING id INTO v_var_xl;
    INSERT INTO public.inventory (variant_id, current_stock) VALUES (v_var_xl, 5) ON CONFLICT (variant_id) DO UPDATE SET current_stock = 5;

END $$;
