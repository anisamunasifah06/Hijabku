-- ====================================================================
-- HIJABKU MARKETPLACE - SUPABASE POSTGRESQL DATABASE SCHEMA
-- UAS Pemrograman Mobile Dasar: Cloning & Redesign Marketplace
-- Platform: Supabase PostgreSQL + REST API (PostgREST) + Row Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. TABLES DEFINITION
-- ====================================================================

-- TABLE: profiles
-- Menyimpan profil pengguna yang terikat dengan Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(25),
    email VARCHAR(150) NOT NULL,
    address TEXT DEFAULT 'Jl. Pemuda No. 45, Kota Cirebon, Jawa Barat',
    member_level VARCHAR(50) DEFAULT 'Silver Member HijabKu',
    points INT DEFAULT 450,
    voucher_count INT DEFAULT 4,
    avatar_url TEXT DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_D23PZtlvFkoKhXb8xeB6IWCgncX1aVOy0K_QH6SEmGhiSylTysKLsCpppH-v_Oh6TmW62eOYu-Vu2w3t1tvvt7FICsJf4RGjLAT_JmiziFRTYo-PKYmpU4TdohVVDGgqO3W8Du3EneNdiokP3Kv8ToV0cfU5ex6Klo2MI27rb_m-JBo3OAGJ74oOQ4av60Ckwv5GfGTLArkKRrjbmSJC6DdlXponTgQ22uTwktA8ddrTTjIoycs',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: categories
-- Kategori produk hijab
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    product_count INT DEFAULT 0,
    tagline VARCHAR(100),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: products
-- Katalog produk utama dengan relasi ke categories
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    discount INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    sold_count INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 100,
    material VARCHAR(100),
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: product_variants
-- Pilihan varian warna atau ukuran produk
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL,
    variant_value VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20),
    stock INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: cart
-- Keranjang belanja pengguna (FULL CRUD)
CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: orders
-- Pesanan yang dibuat oleh pengguna
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    shipping_address TEXT NOT NULL DEFAULT 'Jl. Pemuda No. 45, Kota Cirebon, Jawa Barat',
    shipping_method VARCHAR(100) NOT NULL DEFAULT 'Reguler (2-3 hari)',
    payment_method VARCHAR(100) NOT NULL DEFAULT 'BCA Virtual Account',
    subtotal NUMERIC(12, 2) NOT NULL,
    shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 15000,
    service_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    courier VARCHAR(100) DEFAULT 'J&T Express',
    tracking_number VARCHAR(100) DEFAULT 'JP9876543210',
    estimated_arrival VARCHAR(100) DEFAULT 'Besok, 19 Okt 2023',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: order_items
-- Rincian produk dalam tiap pesanan
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    variant_name VARCHAR(100),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    image_url TEXT
);

-- TABLE: payments
-- Simulasi pembayaran Sandbox (Virtual Account BCA dll.)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(100) NOT NULL DEFAULT 'BCA Virtual Account',
    virtual_account VARCHAR(100) NOT NULL DEFAULT '12345678901234',
    amount NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    expired_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 HOURS'),
    paid_at TIMESTAMPTZ
);

-- TABLE: reviews
-- Ulasan produk dari pembeli
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name VARCHAR(150) NOT NULL DEFAULT 'Pembeli HijabKu',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    variant VARCHAR(100) DEFAULT 'Soft Blue',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- POLICIES: categories (Semua orang dapat membaca)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

-- POLICIES: products (Semua orang dapat membaca)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- POLICIES: product_variants (Semua orang dapat membaca)
CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants FOR SELECT USING (true);

-- POLICIES: profiles
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- POLICIES: cart (FULL CRUD Hanya untuk pemilik data)
CREATE POLICY "Users can view own cart items" 
ON public.cart FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart" 
ON public.cart FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart item" 
ON public.cart FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart item" 
ON public.cart FOR DELETE USING (auth.uid() = user_id);

-- POLICIES: orders & order_items
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" 
ON public.orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" 
ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can insert order items" 
ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- POLICIES: payments
CREATE POLICY "Users can view payments for own orders" 
ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can create payments for own orders" 
ON public.payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can update payment status simulation" 
ON public.payments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);

-- POLICIES: reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- 5. TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGN UP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, phone)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'name', 'Anisa Rahmawati'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone', '081234567890')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 6. INITIAL SEED DATA (SESUAI DOKUMEN TUGAS & DESAIN STITCH)
-- ====================================================================

-- A. Categories Seed
INSERT INTO public.categories (id, name, description, product_count, tagline, image_url) VALUES
('c0000001-0000-0000-0000-000000000001', 'Pashmina', 'Silk, Ceruty, Plisket, Crinkle', 48, 'Favorit Acara Formal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUur2pmpXI-8S1pBGWBVovkcjipgkamvEQO4MPrrkkPFPSwgp_PBXek3C7nRfZlR-2VdMucoCO-vCKGJg3TV8qup_ItWlsJiE4nF8CHoXJYBZKH54ls8dkPcrC4W6841R0FVkqz6V_p8AUK6-D09GD9_GceA76faVMd1BEfBXW2E6PWMs71mvcV542zZNxzBcmeL6A6PxCyZ0uw7hTxkA-lWQHlqMpNl3QPNdppvPAsFhc89E079s'),
('c0000002-0000-0000-0000-000000000002', 'Segi Empat', 'Voal Premium, Paris, Sutra', 64, 'Tegak Sempurna & Ringan', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDCMAJ-_hyj4O7w0ZZr2HsWFf_TRkV7ycknC3WqCEdX9Uhfu08yUhW8BuRi47tCdu7PmJS7R5rCTAm5fFnmyXHHQLto7A-WrDHYw1Hb1YpS7m6Nw6GGIzkPGztxTO6EI_8v7dha4sx8Bp2BFDgNiTDicuT2592hmb8noNXyqzme-lflIFH70eInSuKKiI9V8vZ8q-Sw1g20xyJolFsF7k7e-D4TZi4gDcuxj1IWUHRUdvT05VsM4'),
('c0000003-0000-0000-0000-000000000003', 'Bergo', 'Daily Jersey, Hamidah, Maryam', 35, 'Praktis Untuk Keseharian', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFH6hDmbNJZEwAsgo6mNwZtn0xZSbZp__zYg2mX1jO_zHcU8dMCjDy6nuWX7ulOwNy8UIIw9BlJwtLNrl2EaQYQJX7aodVzIuu4cCvCDpgcXRi2AL18HUOM-H92f8oZFgZ_C0TzJ8ENmK3Cpy7HIhfWK_9pKcGx7pmo89Jctz_GmCQZyV0sDZC9j_umhfdLIG5ZqjebNfiEFlb67V_wMkgjpVa9OpAo0X2erflUS70o_dBSOsj5yA'),
('c0000004-0000-0000-0000-000000000004', 'Hijab Instan', 'Khimar, French Khimar, Sport', 29, 'Syari & Sporty Chic', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU1A8Z40gwlh1H0W9KdgT1a6MzQUHxxNCCig6n5EFsp3uPYgG9jtpYS5P6FSyQG0LdQhp-dsxQtA2ZBssf4rCE1_h4DPVxDysHYFdXdjqGf3KEp8qCeIkpClH8luFFyjWNZeyN1KWijYDKAz7JIrEyW2efJP8sTDM2oVdG3a36o6IIRNLhTRTWURTEaP6l6TuX4VShvHDsG5nmYI5nSE2FU_PvdM6QAlB4Bd7vRgxfRQlEQSpG4YI'),
('c0000005-0000-0000-0000-000000000005', 'Ciput & Inner', 'Ciput Rajut, Silang, Bandana Ninja', 18, 'Anti Pusing & Sejuk', 'https://lh3.googleusercontent.com/aida/AEtjO1VHjPjG3YmkB-IjbchX1K-tnWBZx9UK6Z9RcXPIv4uFq2yVhL9MsI1ULDMZdI3GqOLQo2lJtKb_aBIf9IancpDsM7YqkA30xMgPiZNfGHkP39RBNJDD2v7ZvqYyfihW6BkJdy_p97R5YH229q-Q0mvmsfy2h_drkyKunSNpUgTqJxVzLR8XUlHV40KcXbO9OfGNuMley5MbOBtOyXmwKWiNGoS5Rn3WnJiGyILBJIWKHcSD1n6W294cQw')
ON CONFLICT (id) DO NOTHING;

-- B. Products Seed (Pashmina, Segi Empat, Bergo, dll.)
INSERT INTO public.products (id, category_id, name, description, price, original_price, discount, rating, sold_count, stock, material, image_url) VALUES
('p0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Pashmina Silk Premium', 'Pashmina berbahan silk premium dengan tekstur lembut, adem di kulit, mudah dibentuk, dan memberikan kesan anggun berkilau untuk acara formal maupun santai.', 35000, 55000, 36, 4.9, 1200, 148, 'Silk Shimmer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU1A8Z40gwlh1H0W9KdgT1a6MzQUHxxNCCig6n5EFsp3uPYgG9jtpYS5P6FSyQG0LdQhp-dsxQtA2ZBssf4rCE1_h4DPVxDysHYFdXdjqGf3KEp8qCeIkpClH8luFFyjWNZeyN1KWijYDKAz7JIrEyW2efJP8sTDM2oVdG3a36o6IIRNLhTRTWURTEaP6l6TuX4VShvHDsG5nmYI5nSE2FU_PvdM6QAlB4Bd7vRgxfRQlEQSpG4YI'),
('p0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Pashmina Ceruty', 'Pashmina ceruty babydoll berkualitas tinggi, flowy, adem saat dipakai, dan gampang dikreasikan tanpa mudah kusut.', 32000, 48000, 33, 4.8, 980, 120, 'Babydoll', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUur2pmpXI-8S1pBGWBVovkcjipgkamvEQO4MPrrkkPFPSwgp_PBXek3C7nRfZlR-2VdMucoCO-vCKGJg3TV8qup_ItWlsJiE4nF8CHoXJYBZKH54ls8dkPcrC4W6841R0FVkqz6V_p8AUK6-D09GD9_GceA76faVMd1BEfBXW2E6PWMs71mvcV542zZNxzBcmeL6A6PxCyZ0uw7hTxkA-lWQHlqMpNl3QPNdppvPAsFhc89E079s'),
('p0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'Pashmina Crinkle', 'Pashmina textured voal crinkle yang ironless, sangat praktis untuk kuliah atau bekerja tanpa perlu disetrika.', 28000, 42000, 33, 4.7, 750, 95, 'Ironless Textured', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDCMAJ-_hyj4O7w0ZZr2HsWFf_TRkV7ycknC3WqCEdX9Uhfu08yUhW8BuRi47tCdu7PmJS7R5rCTAm5fFnmyXHHQLto7A-WrDHYw1Hb1YpS7m6Nw6GGIzkPGztxTO6EI_8v7dha4sx8Bp2BFDgNiTDicuT2592hmb8noNXyqzme-lflIFH70eInSuKKiI9V8vZ8q-Sw1g20xyJolFsF7k7e-D4TZi4gDcuxj1IWUHRUdvT05VsM4'),
('p0000004-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 'Pashmina Plisket', 'Pashmina lipit micro pleat rapi penuh dengan ujung jahit tepi rapat. Tampilan modis dan jatuh anggun.', 30000, 45000, 33, 4.8, 860, 110, 'Micro Pleat', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFH6hDmbNJZEwAsgo6mNwZtn0xZSbZp__zYg2mX1jO_zHcU8dMCjDy6nuWX7ulOwNy8UIIw9BlJwtLNrl2EaQYQJX7aodVzIuu4cCvCDpgcXRi2AL18HUOM-H92f8oZFgZ_C0TzJ8ENmK3Cpy7HIhfWK_9pKcGx7pmo89Jctz_GmCQZyV0sDZC9j_umhfdLIG5ZqjebNfiEFlb67V_wMkgjpVa9OpAo0X2erflUS70o_dBSOsj5yA'),
('p0000005-0000-0000-0000-000000000005', 'c0000002-0000-0000-0000-000000000002', 'Segi Empat Voal Premium', 'Jilbab segi empat ultrafine voal yang tegak di dahi dan sejuk dipakai seharian.', 30000, 45000, 33, 4.9, 1400, 200, 'Ultrafine Voal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDCMAJ-_hyj4O7w0ZZr2HsWFf_TRkV7ycknC3WqCEdX9Uhfu08yUhW8BuRi47tCdu7PmJS7R5rCTAm5fFnmyXHHQLto7A-WrDHYw1Hb1YpS7m6Nw6GGIzkPGztxTO6EI_8v7dha4sx8Bp2BFDgNiTDicuT2592hmb8noNXyqzme-lflIFH70eInSuKKiI9V8vZ8q-Sw1g20xyJolFsF7k7e-D4TZi4gDcuxj1IWUHRUdvT05VsM4'),
('p0000006-0000-0000-0000-000000000006', 'c0000003-0000-0000-0000-000000000003', 'Bergo Daily Jersey', 'Bergo santai bahan comfort jersey premium, tinggal slup langsung rapi dan menutup dada sempurna.', 38000, 50000, 24, 4.7, 920, 85, 'Comfort Jersey', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFH6hDmbNJZEwAsgo6mNwZtn0xZSbZp__zYg2mX1jO_zHcU8dMCjDy6nuWX7ulOwNy8UIIw9BlJwtLNrl2EaQYQJX7aodVzIuu4cCvCDpgcXRi2AL18HUOM-H92f8oZFgZ_C0TzJ8ENmK3Cpy7HIhfWK_9pKcGx7pmo89Jctz_GmCQZyV0sDZC9j_umhfdLIG5ZqjebNfiEFlb67V_wMkgjpVa9OpAo0X2erflUS70o_dBSOsj5yA')
ON CONFLICT (id) DO NOTHING;

-- C. Product Variants Seed
INSERT INTO public.product_variants (id, product_id, variant_name, variant_value, color_hex, stock) VALUES
('v0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Warna', 'Soft Blue', '#A8C7EC', 45),
('v0000002-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Warna', 'Warm Beige', '#EAE1D5', 38),
('v0000003-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Warna', 'Dusty Grey', '#B8BDC6', 35),
('v0000004-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Warna', 'Sage Green', '#BAC8B6', 30),
('v0000005-0000-0000-0000-000000000002', 'p0000002-0000-0000-0000-000000000002', 'Warna', 'Warm Beige', '#EAE1D5', 50),
('v0000006-0000-0000-0000-000000000002', 'p0000002-0000-0000-0000-000000000002', 'Warna', 'Mocca', '#C4A482', 40),
('v0000007-0000-0000-0000-000000000002', 'p0000002-0000-0000-0000-000000000002', 'Warna', 'Navy', '#0D3558', 30)
ON CONFLICT (id) DO NOTHING;

-- D. Reviews Seed
INSERT INTO public.reviews (id, product_id, user_name, rating, review_text, variant, created_at) VALUES
('r0000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Nadia S.', 5, 'Bahan silk sangat lembut, adem dan tidak licin. Warnanya cantik sekali sesuai foto produk. Jahitan tepi rapi!', 'Soft Blue', NOW() - INTERVAL '1 DAY'),
('r0000002-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Rania P.', 5, 'Pashmina ternyaman, gampang dibentuk di dahi. Packing pengiriman juga aman dan cepat sampai.', 'Soft Blue', NOW() - INTERVAL '3 DAYS'),
('r0000003-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Aisyah B.', 4, 'Kualitas kain bagus dan jatuh elegan. Sedikit transparan jika satu lapis tapi aman kalau dilipat dua.', 'Soft Blue', NOW() - INTERVAL '5 DAYS')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SELESAI: Skrip SQL siap dijalankan langsung di Supabase SQL Editor!
-- ====================================================================
