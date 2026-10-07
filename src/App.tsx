import React, { useState, useEffect } from 'react';
import {
  INITIAL_PRODUCTS,
  CATEGORIES,
  INITIAL_REVIEWS,
  BRAND_LOGO_URL,
  USER_AVATAR_URL,
  Product,
  ProductVariant,
  CartProduct,
  ReviewItem
} from './data';

export default function App() {
  // Screen Routing:
  // 1: Splash, 2: Login, 3: Home, 4: Category, 5: Pashmina List, 6: Product Detail,
  // 7: Cart, 8: Checkout, 9: Payment Instruction, 10: Order Tracking, 11: Account, 12: Product Review
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'beranda' | 'kategori' | 'keranjang' | 'pesanan' | 'akun'>('beranda');

  // Splash auto-transition to Login after 2.5 seconds
  useEffect(() => {
    if (currentScreen === 1) {
      const timer = setTimeout(() => {
        setCurrentScreen(2);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Products & Detail
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(INITIAL_PRODUCTS[0].variants[0]);
  const [detailQty, setDetailQty] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>(['p1']);

  // Cart FULL CRUD State
  const [cartItems, setCartItems] = useState<CartProduct[]>([
    {
      id: 'cart-1',
      productId: 'p1',
      productName: 'Pashmina Silk',
      variantName: 'Soft Blue',
      price: 35000,
      quantity: 1,
      imageUrl: INITIAL_PRODUCTS[0].imageUrl,
      checked: true
    },
    {
      id: 'cart-2',
      productId: 'p2',
      productName: 'Pashmina Ceruty',
      variantName: 'Warm Beige',
      price: 32000,
      quantity: 2,
      imageUrl: INITIAL_PRODUCTS[1].imageUrl,
      checked: true
    }
  ]);

  // Checkout State
  const [shippingMethod, setShippingMethod] = useState<'reguler' | 'express'>('reguler');
  const [paymentMethod, setPaymentMethod] = useState<'bca_va' | 'bri_va' | 'bni_va' | 'mandiri_va' | 'dana'>('bca_va');

  // Payment Countdown (23:59:15)
  const [countdownSeconds, setCountdownSeconds] = useState(86355);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatRupiah = (val: number) => {
    return 'Rp' + val.toLocaleString('id-ID');
  };

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Cart Calculations
  const checkedCartItems = cartItems.filter(i => i.checked);
  const cartSubtotal = checkedCartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingFee = shippingMethod === 'reguler' ? 15000 : 25000;
  const grandTotal = cartSubtotal + shippingFee;

  // Cart CRUD Handlers
  const handleAddToCart = (product = selectedProduct, variant = selectedVariant, qty = detailQty) => {
    const existing = cartItems.find(i => i.productId === product.id && i.variantName === variant.name);
    if (existing) {
      setCartItems(cartItems.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      setCartItems([
        ...cartItems,
        {
          id: 'cart-' + Date.now(),
          productId: product.id,
          productName: product.name,
          variantName: variant.name,
          price: product.price,
          quantity: qty,
          imageUrl: product.imageUrl,
          checked: true
        }
      ]);
    }
    showToast(`${product.name} dimasukkan ke keranjang`);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    }));
  };

  const handleDeleteCartItem = (id: string) => {
    setCartItems(cartItems.filter(i => i.id !== id));
    showToast('Item berhasil dihapus');
  };

  const handleToggleCheck = (id: string) => {
    setCartItems(cartItems.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const handleSelectAll = (checked: boolean) => {
    setCartItems(cartItems.map(i => ({ ...i, checked })));
  };

  // Filtered products for Search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab change
  const navigateTab = (tab: 'beranda' | 'kategori' | 'keranjang' | 'pesanan' | 'akun') => {
    setActiveTab(tab);
    if (tab === 'beranda') setCurrentScreen(3);
    else if (tab === 'kategori') setCurrentScreen(4);
    else if (tab === 'keranjang') setCurrentScreen(7);
    else if (tab === 'pesanan') setCurrentScreen(10);
    else if (tab === 'akun') setCurrentScreen(11);
  };

  // Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#071320] flex items-center justify-center p-0 sm:p-4">
      {/* Mobile Frame Container (Standard Android Aspect) */}
      <div className="w-[390px] h-[844px] max-w-full max-h-screen sm:max-h-[844px] bg-[#f8f9ff] text-[#0b1c2e] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative select-none font-['Plus_Jakarta_Sans']">
        
        {/* Global Toast */}
        {toastMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0d3558] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#a7c9f4]">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* =========================================================================
            SCREEN 1: SPLASH SCREEN
        ========================================================================= */}
        {currentScreen === 1 && (
          <div
            onClick={() => setCurrentScreen(2)}
            className="flex-1 flex flex-col justify-between items-center px-4 py-8 bg-[#f8f9ff] cursor-pointer"
          >
            <div className="w-full h-8 opacity-0" />

            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="relative mb-6">
                <div className="absolute -inset-2 bg-[#a7c9f4]/40 rounded-full blur-md opacity-70" />
                <div className="relative w-[88px] h-[88px] rounded-full bg-white shadow-md flex items-center justify-center p-2.5">
                  <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              <h1 className="font-['Noto_Serif'] text-3xl font-bold text-[#294c70] tracking-tight mb-1">
                HijabKu
              </h1>
              <p className="text-sm text-[#43474e] font-medium">
                Tampil Anggun, Tetap Nyaman.
              </p>

              <div className="mt-6 flex items-center gap-1.5 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#294c70] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7c9f4] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#eae1d5] animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col items-center w-full max-w-[220px] pb-2">
              <div className="w-16 h-0.5 bg-[#eae1d5] rounded-full mb-2 opacity-90" />
              <span className="text-xs text-[#43474e]/80">Versi 1.0.0</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: LOGIN
        ========================================================================= */}
        {currentScreen === 2 && (
          <div className="flex-1 flex flex-col px-6 py-4 bg-[#f8f9ff] overflow-y-auto">
            <div className="flex flex-col items-center text-center space-y-3 pt-6">
              <div className="w-14 h-14 rounded-xl shadow-sm bg-white flex items-center justify-center p-1.5 overflow-hidden">
                <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <h1 className="font-['Noto_Serif'] text-xl font-bold text-[#294c70] tracking-tight">
                  Selamat Datang di HijabKu
                </h1>
                <p className="text-xs text-[#43474e] mt-1">
                  Silakan masuk untuk melanjutkan belanja
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c2e] mb-1.5">
                  Email atau Nomor HP
                </label>
                <input
                  type="text"
                  defaultValue="anisa@email.com"
                  placeholder="nama@email.com atau 08xx..."
                  className="w-full h-12 px-3.5 bg-white text-[#0b1c2e] text-xs rounded-xl shadow-sm border border-slate-100 focus:outline-none focus:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c2e] mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full h-12 pl-3.5 pr-11 bg-white text-[#0b1c2e] text-xs rounded-xl shadow-sm border border-slate-100 focus:outline-none focus:bg-slate-50 tracking-widest"
                  />
                  <span className="material-symbols-outlined absolute right-3 text-[20px] text-slate-400">
                    visibility
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-[#294c70]">
                  Lupa Kata Sandi?
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Masuk berhasil');
                  setCurrentScreen(3);
                }}
                className="w-full h-12 bg-[#294c70] text-white rounded-xl text-sm font-semibold shadow-sm active:scale-[0.98] transition-transform"
              >
                Masuk
              </button>
            </div>

            <div className="text-center pt-6 pb-4">
              <p className="text-xs text-[#43474e]">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentScreen(13)}
                  className="text-xs text-[#294c70] font-bold hover:underline cursor-pointer"
                >
                  Daftar
                </button>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 13: DAFTAR AKUN BARU (REGISTER)
        ========================================================================= */}
        {currentScreen === 13 && (
          <div className="flex-1 flex flex-col px-6 py-4 bg-[#f8f9ff] overflow-y-auto">
            <div className="flex items-center -ml-2 mb-1">
              <button
                type="button"
                onClick={() => setCurrentScreen(2)}
                className="w-10 h-10 flex items-center justify-center text-[#0b1c2e]"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <span className="text-xs font-semibold text-[#0d3558]">Kembali ke Masuk</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 pt-1">
              <div className="w-14 h-14 rounded-xl shadow-sm bg-white flex items-center justify-center p-1.5 overflow-hidden">
                <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <h1 className="font-['Noto_Serif'] text-xl font-bold text-[#294c70] tracking-tight">
                  Daftar Akun Baru
                </h1>
                <p className="text-xs text-[#43474e] mt-0.5">
                  Bergabunglah bersama keluarga besar HijabKu
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c2e] mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white text-[#0b1c2e] text-xs rounded-xl shadow-sm border border-slate-100 focus:outline-none focus:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c2e] mb-1">
                  Email atau Nomor HP
                </label>
                <input
                  type="text"
                  placeholder="nama@email.com atau 08xx..."
                  value={regIdentifier}
                  onChange={(e) => setRegIdentifier(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white text-[#0b1c2e] text-xs rounded-xl shadow-sm border border-slate-100 focus:outline-none focus:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c2e] mb-1">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full h-11 pl-3.5 pr-11 bg-white text-[#0b1c2e] text-xs rounded-xl shadow-sm border border-slate-100 focus:outline-none focus:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 text-slate-400"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showRegPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0b1c2e] mb-1">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  type="password"
                  placeholder="Ulangi kata sandi"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white text-[#0b1c2e] text-xs rounded-xl shadow-sm border border-slate-100 focus:outline-none focus:bg-slate-50"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  defaultChecked
                  className="accent-[#0d3558] rounded mt-0.5"
                />
                <label htmlFor="termsCheckbox" className="text-[10px] text-slate-500 leading-tight cursor-pointer">
                  Saya menyetujui <span className="text-[#0d3558] font-semibold">Syarat & Ketentuan</span> serta <span className="text-[#0d3558] font-semibold">Kebijakan Privasi</span> HijabKu
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Pendaftaran Berhasil! Selamat datang di HijabKu');
                  setCurrentScreen(3);
                }}
                className="w-full h-12 bg-[#294c70] text-white rounded-xl text-sm font-semibold shadow-sm active:scale-[0.98] transition-transform mt-1"
              >
                Daftar Sekarang
              </button>
            </div>

            <div className="text-center pt-4 pb-4">
              <p className="text-xs text-[#43474e]">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentScreen(2)}
                  className="text-xs text-[#294c70] font-bold hover:underline cursor-pointer"
                >
                  Masuk
                </button>
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: BERANDA (HOME)
        ========================================================================= */}
        {currentScreen === 3 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-16">
            {/* Top Bar Header */}
            <div className="h-14 px-4 flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="h-8 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="font-['Noto_Serif'] text-base font-bold text-[#0d3558] tracking-tight truncate leading-none">HijabKu</span>
                  <span className="text-[10px] text-[#43474e] tracking-wide mt-0.5">Beranda</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => setCurrentScreen(4)} className="w-10 h-10 flex items-center justify-center text-[#43474e]">
                  <span className="material-symbols-outlined text-[22px]">search</span>
                </button>
                <button type="button" className="w-10 h-10 flex items-center justify-center text-[#43474e]">
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                </button>
                <img
                  src={USER_AVATAR_URL}
                  alt="Profile"
                  onClick={() => navigateTab('akun')}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#d1e4ff] cursor-pointer ml-1"
                />
              </div>
            </div>

            <div className="px-4 py-3 space-y-4">
              {/* Search Bar */}
              <div className="relative flex items-center w-full">
                <div className="absolute left-3.5 flex items-center text-[#42617c]">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Cari hijab favoritmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-full bg-white text-[#0b1c2e] text-xs placeholder:text-slate-400 shadow-sm border border-slate-100 focus:outline-none"
                />
              </div>

              {/* Promo Banner: Koleksi Hijab Terbaru */}
              <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#aacae9] via-[#bddefd] to-[#eae1d5] p-4 shadow-sm">
                <div className="relative z-10 flex flex-col items-start max-w-[65%]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 text-[#0d3558] text-[10px] font-semibold mb-1.5 shadow-xs">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    Diskon Spesial Hari Ini
                  </span>
                  <h2 className="font-['Noto_Serif'] text-lg text-[#0d3558] font-bold tracking-tight leading-tight mb-1">
                    Koleksi Hijab Terbaru
                  </h2>
                  <p className="text-xs text-[#2a4a63] mb-3 line-clamp-1">
                    Sentuhan sutra & voal premium harian.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen(5)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d3558] text-white text-xs font-semibold active:scale-95 transition-transform shadow-xs"
                  >
                    Lihat Semua
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
                <div className="absolute right-2 -bottom-2 w-28 h-28 opacity-90">
                  <img src={BRAND_LOGO_URL} alt="Brand" className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
              </section>

              {/* Kategori Pilihan */}
              <section className="pt-1">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-['Noto_Serif'] text-sm font-bold text-[#0b1c2e]">Kategori Pilihan</h3>
                  <span onClick={() => setCurrentScreen(4)} className="text-xs text-[#42617c] font-semibold cursor-pointer">Eksplor</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => setCurrentScreen(5)} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0d3558] shadow-sm active:scale-90 transition">
                      <span className="material-symbols-outlined text-[24px]">styler</span>
                    </div>
                    <span className="mt-1.5 text-xs text-[#0b1c2e] font-semibold">Pashmina</span>
                  </button>
                  <button type="button" onClick={() => setCurrentScreen(4)} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0d3558] shadow-sm active:scale-90 transition">
                      <span className="material-symbols-outlined text-[24px]">crop_square</span>
                    </div>
                    <span className="mt-1.5 text-xs text-[#0b1c2e] font-semibold">Segi Empat</span>
                  </button>
                  <button type="button" onClick={() => setCurrentScreen(4)} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0d3558] shadow-sm active:scale-90 transition">
                      <span className="material-symbols-outlined text-[24px]">face_3</span>
                    </div>
                    <span className="mt-1.5 text-xs text-[#0b1c2e] font-semibold">Bergo</span>
                  </button>
                  <button type="button" onClick={() => setCurrentScreen(4)} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#0d3558] shadow-sm active:scale-90 transition">
                      <span className="material-symbols-outlined text-[24px]">bolt</span>
                    </div>
                    <span className="mt-1.5 text-xs text-[#0b1c2e] font-semibold">Instan</span>
                  </button>
                </div>
              </section>

              {/* Produk Terlaris Grid 2 Kolom */}
              <section className="pt-1 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-['Noto_Serif'] text-sm font-bold text-[#0b1c2e]">Produk Terlaris</h3>
                    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d1e4ff] text-[#0d3558]">HOT</span>
                  </div>
                  <button type="button" onClick={() => setCurrentScreen(5)} className="text-xs text-[#42617c]">
                    Lihat Semua
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((p) => (
                    <article
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setSelectedVariant(p.variants[0]);
                        setCurrentScreen(6);
                      }}
                      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer"
                    >
                      <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWishlist(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400"
                        >
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{
                              fontVariationSettings: wishlist.includes(p.id) ? "'FILL' 1" : "'FILL' 0",
                              color: wishlist.includes(p.id) ? '#ba1a1a' : undefined
                            }}
                          >
                            favorite
                          </span>
                        </button>
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm flex items-center gap-0.5 shadow-xs">
                          <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-[10px] text-[#0b1c2e] font-semibold">{p.rating}</span>
                        </div>
                      </div>

                      <div className="p-2.5 flex flex-col flex-1 justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-tight font-medium">{p.tag}</span>
                          <h4 className="text-xs font-semibold text-[#0b1c2e] line-clamp-1 leading-snug">{p.name}</h4>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1">
                          <span className="text-xs font-bold text-[#0d3558]">{formatRupiah(p.price)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(p, p.variants[0], 1);
                            }}
                            className="w-8 h-8 rounded-lg bg-[#0d3558] text-white flex items-center justify-center active:scale-90 transition shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: KATEGORI
        ========================================================================= */}
        {currentScreen === 4 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-16">
            <div className="h-14 px-4 flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="h-8 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="font-['Noto_Serif'] text-base font-bold text-[#0d3558] tracking-tight truncate leading-none">HijabKu</span>
                  <span className="text-[10px] text-[#43474e] tracking-wide mt-0.5">Kategori</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[22px] text-[#43474e]">search</span>
                <span className="material-symbols-outlined text-[22px] text-[#43474e] ml-1">notifications</span>
                <img src={USER_AVATAR_URL} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#d1e4ff] ml-1" />
              </div>
            </div>

            <div className="px-4 pb-6">
              <div className="flex flex-col pt-3 pb-3">
                <div className="flex items-center justify-between">
                  <h1 className="font-['Noto_Serif'] text-lg font-bold text-[#294c70] tracking-tight">Kategori</h1>
                  <span className="px-2.5 py-1 rounded-full bg-[#bddefd] text-[#001d31] text-[10px] font-semibold">
                    5 Koleksi Utama
                  </span>
                </div>
                <p className="text-xs text-[#43474e] mt-0.5">
                  Eksplorasi ragam pilihan hijab premium dan pelengkap santun Anda.
                </p>
              </div>

              <div className="relative w-full mb-3">
                <div className="relative flex items-center bg-white rounded-xl shadow-xs px-3.5 h-11 border border-slate-100">
                  <span className="material-symbols-outlined text-[#42617c] text-[20px] mr-2">search</span>
                  <input
                    type="text"
                    placeholder="Cari kategori atau jenis kain..."
                    className="w-full bg-transparent text-xs text-[#0b1c2e] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {CATEGORIES.map((c) => (
                  <article
                    key={c.id}
                    onClick={() => setCurrentScreen(5)}
                    className="bg-white rounded-xl shadow-xs border border-slate-100 p-3 flex items-center gap-3.5 cursor-pointer hover:shadow-md transition active:scale-[0.99]"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-[#213144]/75 text-white text-[9px] backdrop-blur-sm">
                        {c.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h2 className="text-sm font-bold text-[#294c70] truncate">{c.name}</h2>
                        <span className="text-[10px] text-[#42617c] font-semibold bg-[#dbe9ff] px-2 py-0.5 rounded-full">
                          {c.count} Produk
                        </span>
                      </div>
                      <p className="text-xs text-[#43474e] truncate">{c.tagline}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#294c70]" />
                        <span className="text-[10px] text-[#42617c] font-medium">Favorit Koleksi</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#eef4ff] text-[#42617c]">
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 5: DAFTAR PRODUK PASHMINA
        ========================================================================= */}
        {currentScreen === 5 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-16">
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between shadow-xs border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentScreen(3)} className="w-9 h-9 flex items-center justify-center rounded-full text-[#0d3558]">
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <div className="flex flex-col">
                  <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#294c70] tracking-tight">Pashmina</h1>
                  <span className="text-[10px] text-[#43474e]">142 Koleksi Pilihan</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[22px] text-[#0d3558] p-1">search</span>
                <span className="material-symbols-outlined text-[22px] text-[#0d3558] p-1">tune</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto py-2.5 px-4 flex items-center gap-2">
              <button type="button" className="shrink-0 h-8 px-4 rounded-full bg-[#294c70] text-white text-xs font-semibold">
                Semua
              </button>
              <button type="button" className="shrink-0 h-8 px-4 rounded-full bg-white text-[#0b1c2e] text-xs border border-slate-200">
                Silk
              </button>
              <button type="button" className="shrink-0 h-8 px-4 rounded-full bg-white text-[#0b1c2e] text-xs border border-slate-200">
                Ceruty
              </button>
              <button type="button" className="shrink-0 h-8 px-4 rounded-full bg-white text-[#0b1c2e] text-xs border border-slate-200">
                Plisket
              </button>
              <button type="button" className="shrink-0 h-8 px-4 rounded-full bg-white text-[#0b1c2e] text-xs border border-slate-200">
                Terlaris
              </button>
            </div>

            <div className="px-4 py-1 flex items-center justify-between text-xs text-[#43474e]">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#42617c]">check_circle</span>
                <span className="text-[11px]">Original HijabKu Material</span>
              </div>
              <span className="text-[11px] text-[#294c70] font-medium">Urutkan: Popularitas</span>
            </div>

            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-3">
                {products.filter(p => p.categoryName === 'Pashmina').map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setSelectedVariant(p.variants[0]);
                      setCurrentScreen(6);
                    }}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-xs border border-slate-100 cursor-pointer"
                  >
                    <div className="relative w-full aspect-square bg-slate-50">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setWishlist(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 flex items-center justify-center text-slate-400"
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{
                            fontVariationSettings: wishlist.includes(p.id) ? "'FILL' 1" : "'FILL' 0",
                            color: wishlist.includes(p.id) ? '#ba1a1a' : undefined
                          }}
                        >
                          favorite
                        </span>
                      </button>
                      <div className="absolute bottom-2 left-2 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#294c70] uppercase">
                        {p.tag}
                      </div>
                    </div>
                    <div className="p-2.5 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-xs font-bold text-[#0b1c2e] line-clamp-1">{p.name}</h3>
                        <span className="text-[10px] text-[#43474e]">{p.material}</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-2">
                        <span className="text-xs font-bold text-[#294c70]">{formatRupiah(p.price)}</span>
                        <div className="flex items-center gap-0.5 bg-[#eef4ff] px-1.5 py-0.5 rounded text-[10px] font-bold text-[#0b1c2e]">
                          <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span>{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 6: DETAIL PRODUK
        ========================================================================= */}
        {currentScreen === 6 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-20">
            <div className="h-14 px-3 flex items-center justify-between bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCurrentScreen(5)} className="w-10 h-10 flex items-center justify-center text-[#0b1c2e]">
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558] truncate">Detail Produk</h1>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setWishlist(prev => prev.includes(selectedProduct.id) ? prev.filter(x => x !== selectedProduct.id) : [...prev, selectedProduct.id])}
                  className="w-9 h-9 flex items-center justify-center text-[#43474e]"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: wishlist.includes(selectedProduct.id) ? "'FILL' 1" : "'FILL' 0",
                      color: wishlist.includes(selectedProduct.id) ? '#ba1a1a' : undefined
                    }}
                  >
                    favorite
                  </span>
                </button>
                <button type="button" className="w-9 h-9 flex items-center justify-center text-[#43474e]">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            </div>

            <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 shadow-sm">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-white/85 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs text-xs text-[#0d3558] font-medium">
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  <span>1 / 4 Foto</span>
                </div>
                <div className="absolute top-3 left-3 bg-[#294c70] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Original Silk
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-white p-4 rounded-xl shadow-xs border border-slate-100">
                <div className="flex items-center justify-between text-xs text-[#42617c]">
                  <span className="text-[10px] tracking-wider uppercase font-semibold">Hijab Segiempat & Pashmina</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-[#0b1c2e] font-bold">{selectedProduct.rating}</span>
                    <span className="text-slate-300">•</span>
                    <span>{selectedProduct.soldCount} Terjual</span>
                  </div>
                </div>
                <h2 className="font-['Noto_Serif'] text-lg font-bold text-[#0d3558] tracking-tight">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-[#0d3558]">
                    {formatRupiah(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatRupiah(selectedProduct.originalPrice)}
                    </span>
                  )}
                  <span className="bg-[#d1e4ff] text-[#0d3558] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -{selectedProduct.discount}%
                  </span>
                </div>
              </div>

              {/* Pilihan Warna / Varian */}
              <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c2e]">Pilihan Warna</span>
                  <span className="text-xs text-[#42617c] font-semibold">{selectedVariant.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-1 rounded-full transition ${selectedVariant.id === v.id ? 'bg-[#0d3558]/10 ring-2 ring-[#0d3558]' : ''}`}
                    >
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-inner"
                        style={{ backgroundColor: v.hex }}
                      >
                        {selectedVariant.id === v.id && (
                          <span className="material-symbols-outlined text-[#0d3558] text-[18px]">check</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pengatur Jumlah */}
              <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0b1c2e]">Jumlah</span>
                  <span className="text-[11px] text-[#43474e]">Stok tersedia: {selectedVariant.stock} pcs</span>
                </div>
                <div className="flex items-center gap-3 bg-[#eef4ff] p-1.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0d3558] shadow-xs active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="text-sm font-bold text-[#0d3558] w-6 text-center">{detailQty}</span>
                  <button
                    type="button"
                    onClick={() => setDetailQty(detailQty + 1)}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0d3558] shadow-xs active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              {/* Deskripsi & Tombol Ulasan */}
              <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0b1c2e]">Deskripsi Produk</h3>
                  <button type="button" onClick={() => setCurrentScreen(12)} className="text-xs font-bold text-[#0d3558]">
                    Ulasan (128) →
                  </button>
                </div>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 bg-slate-50 p-2.5 rounded-lg text-[11px] text-[#43474e]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0d3558]">auto_awesome</span>
                    <span>Bahan Kilau Elegan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0d3558]">air</span>
                    <span>Adem & Nyaman</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0d3558]">check_circle</span>
                    <span>Ukuran: 180 x 75 cm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0d3558]">verified</span>
                    <span>Jahit Tepi Rapi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3 z-40 border-t border-slate-100 max-w-[390px] mx-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAddToCart()}
                className="flex-1 h-12 rounded-xl bg-[#eae1d5] text-[#0d3558] flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition shadow-xs"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span>Tambah Keranjang</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  setCurrentScreen(8);
                }}
                className="flex-1 h-12 rounded-xl bg-[#0d3558] text-white flex items-center justify-center text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>Beli Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 7: KERANJANG (FULL CRUD)
        ========================================================================= */}
        {currentScreen === 7 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-24">
            <div className="h-14 px-4 flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="h-8 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="font-['Noto_Serif'] text-base font-bold text-[#0d3558] tracking-tight truncate leading-none">HijabKu</span>
                  <span className="text-[10px] text-[#43474e] tracking-wide mt-0.5">Keranjang</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[22px] text-[#43474e]">search</span>
                <span className="material-symbols-outlined text-[22px] text-[#43474e] ml-1">notifications</span>
                <img src={USER_AVATAR_URL} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#d1e4ff] ml-1" />
              </div>
            </div>

            <div className="px-4 pb-20">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Noto_Serif'] text-lg font-bold text-[#294c70]">Keranjang</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#bddefd] text-[#001d31] text-[10px] font-bold">
                    {cartItems.length} produk
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectAll(!cartItems.every(i => i.checked))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eef4ff] text-xs font-semibold text-[#294c70]"
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center ${cartItems.every(i => i.checked) ? 'bg-[#294c70] text-white' : 'border border-slate-300'}`}>
                    {cartItems.every(i => i.checked) && <span className="material-symbols-outlined text-[13px]">check</span>}
                  </div>
                  <span>Pilih Semua ({cartItems.length})</span>
                </button>
              </div>

              {/* Free Shipping Milestone */}
              <div className="mb-3 p-3 rounded-xl bg-[#eef4ff] flex flex-col gap-1.5 shadow-xs border border-[#d1e4ff]">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[#294c70] font-bold">
                    <span className="material-symbols-outlined text-[16px] text-[#0d3558]">local_shipping</span>
                    Selamat! Kamu berhak dapat Bebas Ongkir
                  </span>
                  <span className="text-[#42617c] font-semibold">Rp0</span>
                </div>
                <div className="w-full bg-[#dbe9ff] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#294c70] h-full w-full rounded-full" />
                </div>
              </div>

              {/* Cart List */}
              <div className="flex flex-col gap-2.5">
                {cartItems.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center text-xs text-slate-400">
                    Keranjang kosong. Tambahkan hijab favoritmu sekarang!
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-white shadow-xs border border-slate-100 flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleCheck(item.id)}
                        className={`mt-4 w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          item.checked ? 'bg-[#294c70] text-white' : 'border border-slate-300'
                        }`}
                      >
                        {item.checked && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </button>

                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-50">
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="text-xs font-bold text-[#0b1c2e] truncate">{item.productName}</h3>
                            <button
                              type="button"
                              onClick={() => handleDeleteCartItem(item.id)}
                              className="text-slate-400 hover:text-red-500 p-1"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded bg-[#eef4ff] text-[#43474e] text-[10px] font-medium mt-0.5">
                            {item.variantName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-[#294c70]">{formatRupiah(item.price)}</span>
                          <div className="flex items-center gap-1.5 bg-[#eef4ff] px-1.5 py-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white text-[#0b1c2e]"
                            >
                              <span className="material-symbols-outlined text-[13px]">remove</span>
                            </button>
                            <span className="text-xs font-bold text-[#0b1c2e] w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQty(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center rounded bg-white text-[#0b1c2e]"
                            >
                              <span className="material-symbols-outlined text-[13px]">add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Voucher Card */}
              <div className="mt-3 p-3 rounded-xl bg-[#eef4ff] shadow-xs flex items-center justify-between gap-2.5 border border-[#d1e4ff]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#a7c9f4] flex items-center justify-center text-[#294c70] shrink-0">
                    <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[#0b1c2e] font-bold truncate">Gunakan Voucher HijabKu</span>
                    <span className="text-[10px] text-[#43474e] truncate">Hemat s.d Rp15.000 hari ini</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Voucher berhasil diklaim!')}
                  className="px-3 py-1.5 rounded-lg bg-[#d1e4ff] text-[#001d36] text-xs font-bold"
                >
                  Klaim
                </button>
              </div>
            </div>

            {/* Bottom Total & Checkout Bar */}
            <div className="fixed bottom-14 inset-x-0 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg border-t border-slate-100 max-w-[390px] mx-auto flex items-center justify-between z-40">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#43474e]">Total Belanja</span>
                <span className="font-['Noto_Serif'] text-base text-[#294c70] font-bold">{formatRupiah(cartSubtotal)}</span>
              </div>
              <button
                type="button"
                disabled={checkedCartItems.length === 0}
                onClick={() => setCurrentScreen(8)}
                className="h-11 px-6 rounded-xl bg-[#294c70] text-white text-xs font-bold flex items-center gap-2 shadow-xs active:scale-95 transition disabled:opacity-50"
              >
                <span>Checkout</span>
                <span className="bg-[#0d3558] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {checkedCartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 8: CHECKOUT PEMBAYARAN
        ========================================================================= */}
        {currentScreen === 8 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-20">
            <div className="h-14 px-3 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button type="button" onClick={() => setCurrentScreen(7)} className="w-10 h-10 flex items-center justify-center text-[#0b1c2e]">
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558] truncate">Checkout Pembayaran</h1>
              </div>
              <img src={USER_AVATAR_URL} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#d1e4ff]" />
            </div>

            <div className="px-4 py-3 flex flex-col gap-3">
              {/* Progress Breadcrumbs */}
              <div className="flex items-center justify-between px-1 text-xs text-[#43474e]">
                <div className="flex items-center gap-1.5 text-[#0d3558]">
                  <span className="w-4 h-4 rounded-full bg-[#0d3558] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span className="font-bold text-[11px]">Checkout</span>
                </div>
                <div className="h-0.5 w-12 bg-[#d1e4ff] rounded-full" />
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-[#43474e] flex items-center justify-center text-[10px]">2</span>
                  <span className="text-[11px]">Pembayaran</span>
                </div>
                <div className="h-0.5 w-12 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-1.5 opacity-60">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-[#43474e] flex items-center justify-center text-[10px]">3</span>
                  <span className="text-[11px]">Selesai</span>
                </div>
              </div>

              {/* 1. Alamat Pengiriman */}
              <section className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#0d3558] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    <span className="text-xs font-bold text-[#0d3558]">Alamat Pengiriman</span>
                  </div>
                  <button type="button" className="text-[#0d3558] text-xs font-semibold">Ubah Alamat</button>
                </div>
                <div className="bg-[#eef4ff] rounded-lg p-2.5 flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-[#0b1c2e]">Anisa</span>
                    <span className="text-slate-500 text-[11px]">0812-3456-7890</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    Jl. Pemuda No. 45, Kota Cirebon, Jawa Barat
                  </p>
                </div>
              </section>

              {/* 2. Ringkasan Produk */}
              <section className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0d3558]">Ringkasan Produk ({checkedCartItems.length})</span>
                  <span className="text-[10px] text-slate-400">HijabKu Official</span>
                </div>
                {checkedCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-[#eef4ff] p-2 rounded-lg">
                    <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-white shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#0b1c2e] truncate">{item.productName} ({item.variantName})</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-slate-500">{item.quantity}x • {formatRupiah(item.price)}</span>
                        <span className="text-xs font-bold text-[#0d3558]">{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* 3. Opsi Pengiriman */}
              <section className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="material-symbols-outlined text-[#0d3558] text-[18px]">local_shipping</span>
                  <span className="text-xs font-bold text-[#0d3558]">Opsi Pengiriman</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    onClick={() => setShippingMethod('reguler')}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer ${
                      shippingMethod === 'reguler' ? 'bg-[#e5eeff] border border-[#0d3558]' : 'bg-[#eef4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input type="radio" checked={shippingMethod === 'reguler'} readOnly className="accent-[#0d3558]" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0b1c2e]">Reguler (2–3 hari)</span>
                        <span className="text-[10px] text-slate-500">Estimasi tiba Rabu, 18 Okt</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0d3558]">Rp15.000</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer ${
                      shippingMethod === 'express' ? 'bg-[#e5eeff] border border-[#0d3558]' : 'bg-[#eef4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input type="radio" checked={shippingMethod === 'express'} readOnly className="accent-[#0d3558]" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0b1c2e]">Express (1 hari)</span>
                        <span className="text-[10px] text-slate-500">Estimasi tiba Besok</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0b1c2e]">Rp25.000</span>
                  </label>
                </div>
              </section>

              {/* 4. Metode Pembayaran */}
              <section className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#0d3558] text-[18px]">payments</span>
                    <span className="text-xs font-bold text-[#0d3558]">Metode Pembayaran</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Virtual Account & E-Wallet</span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs">
                  {[
                    { id: 'bca_va', label: 'BCA Virtual Account', badge: 'BCA' },
                    { id: 'bri_va', label: 'BRI Virtual Account', badge: 'BRI' },
                    { id: 'bni_va', label: 'BNI Virtual Account', badge: 'BNI' },
                    { id: 'mandiri_va', label: 'Mandiri Virtual Account', badge: 'MANDIRI' },
                    { id: 'dana', label: 'DANA E-Wallet', badge: 'DANA' },
                  ].map((m) => (
                    <label
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                        paymentMethod === m.id ? 'bg-[#e5eeff] border border-[#0d3558]' : 'bg-[#eef4ff]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input type="radio" checked={paymentMethod === m.id} readOnly className="accent-[#0d3558]" />
                        <span className="px-1.5 py-0.5 rounded bg-[#0d3558] text-white font-bold text-[9px]">{m.badge}</span>
                        <span className="font-medium text-[#0b1c2e] text-[11px] truncate">{m.label}</span>
                      </div>
                      {paymentMethod === m.id && (
                        <span className="material-symbols-outlined text-[#0d3558] text-[18px]">check_circle</span>
                      )}
                    </label>
                  ))}
                </div>
              </section>

              {/* 5. Rincian Pembayaran */}
              <section className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0d3558]">Rincian Pembayaran</span>
                  <div className="flex items-center gap-1 text-[#0d3558] bg-[#d1e4ff]/50 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>Aman & Terpercaya</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 pt-1 text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-[#0b1c2e]">{formatRupiah(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Ongkos Kirim</span>
                    <span className="font-semibold text-[#0b1c2e]">{formatRupiah(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#42617c]">
                    <span>Biaya Layanan</span>
                    <span className="bg-[#bddefd] text-[#001d31] px-1.5 py-0.5 rounded text-[10px] font-bold">GRATIS</span>
                  </div>
                </div>
                <div className="bg-[#eef4ff] p-2 rounded-lg flex items-center justify-between mt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Tagihan</span>
                    <span className="font-['Noto_Serif'] text-base font-bold text-[#0d3558]">{formatRupiah(grandTotal)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Termasuk PPN</span>
                </div>
              </section>

              {/* Action Button */}
              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentScreen(9)}
                  className="w-full h-12 bg-[#294c70] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition"
                >
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Bayar Sekarang</span>
                </button>
                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-center text-[10px]">
                  <span className="material-symbols-outlined text-[13px] text-[#0d3558]">security</span>
                  <span>Enkripsi 256-bit transaksi terjamin aman</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 9: INSTRUKSI PEMBAYARAN
        ========================================================================= */}
        {currentScreen === 9 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-8">
            <div className="h-14 px-3 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button type="button" onClick={() => setCurrentScreen(8)} className="w-10 h-10 flex items-center justify-center text-[#0b1c2e]">
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558] truncate">Instruksi Pembayaran</h1>
              </div>
              <img src={USER_AVATAR_URL} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#d1e4ff]" />
            </div>

            <div className="p-4 flex flex-col gap-3.5">
              {/* Alert Card Selesaikan Pembayaran */}
              <div className="w-full bg-[#f4ebe1] rounded-xl p-4 flex flex-col gap-3 shadow-xs border border-[#e5dcce]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#4e4940]">
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                    <span className="text-xs font-bold tracking-wider uppercase">Selesaikan Pembayaran</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-[#eae1d5] text-[#4e4940] px-2 py-0.5 rounded-full">Batas Waktu</span>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>Bayar dalam</span>
                  </div>
                  <span className="font-['Noto_Serif'] text-base font-bold text-[#0d3558] tracking-tight">
                    {formatCountdown(countdownSeconds)}
                  </span>
                </div>
              </div>

              {/* Detail Metode Pembayaran Terpilih */}
              <div className="w-full bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-8 bg-[#eef4ff] rounded flex items-center justify-center text-[#0d3558] font-bold text-xs border border-[#0d3558]/20">
                      BCA
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0b1c2e]">BCA Virtual Account</span>
                      <span className="text-[10px] text-slate-400">Verifikasi otomatis 24 jam</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#0d3558] text-[22px]">account_balance</span>
                </div>

                {/* Nomor VA */}
                <div className="bg-[#eef4ff] rounded-xl p-3 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500">Nomor Virtual Account</span>
                    <span className="text-xs font-bold text-[#0d3558] tracking-wider">123 456 7890 1234</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Nomor VA tersalin ke papan klip')}
                    className="px-3 py-1.5 bg-white text-[#0d3558] rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Salin</span>
                  </button>
                </div>

                {/* Total Tagihan */}
                <div className="bg-[#eef4ff] rounded-xl p-3 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-500">Total Pembayaran</span>
                    <span className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558]">{formatRupiah(grandTotal)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Nominal tagihan tersalin!')}
                    className="px-3 py-1.5 bg-white text-[#0d3558] rounded-lg border border-slate-200 text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Salin</span>
                  </button>
                </div>
              </div>

              {/* Petunjuk Transfer */}
              <div className="w-full bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#0d3558] text-[18px]">help_outline</span>
                    <span className="text-xs font-bold text-[#0b1c2e]">Petunjuk Transfer Singkat</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">3 Langkah</span>
                </div>
                <div className="flex flex-col gap-2 pt-1 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#d1e4ff] text-[#0d3558] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p className="text-slate-600 leading-snug">Buka aplikasi <strong>m-BCA</strong> atau kunjungi ATM BCA terdekat.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#d1e4ff] text-[#0d3558] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p className="text-slate-600 leading-snug">Pilih menu <strong>Transfer &gt; BCA Virtual Account</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#d1e4ff] text-[#0d3558] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <p className="text-slate-600 leading-snug">Masukkan nomor VA di atas lalu teliti jumlah tagihan dan konfirmasi pembayaran.</p>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="w-full flex flex-col gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Pembayaran Berhasil Terverifikasi!');
                    setTimeout(() => setCurrentScreen(10), 1000);
                  }}
                  className="w-full h-12 bg-[#0d3558] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  <span>Cek Status Pembayaran</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center">Simulasi pembayaran.</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 10: LACAK PENGIRIMAN
        ========================================================================= */}
        {currentScreen === 10 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-8">
            <div className="h-14 px-3 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button type="button" onClick={() => setCurrentScreen(3)} className="w-10 h-10 flex items-center justify-center text-[#0b1c2e]">
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558] truncate">Lacak Pengiriman</h1>
              </div>
              <img src={USER_AVATAR_URL} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#d1e4ff]" />
            </div>

            <div className="px-4 py-3 space-y-3.5">
              {/* Status Banner Live Pulse */}
              <div className="bg-[#dbe9ff] rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#d1e4ff] text-[#0d3558]">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d3558] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0d3558]" />
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#42617c] uppercase tracking-wider font-semibold">Estimasi Tiba</p>
                    <p className="text-xs font-bold text-[#0b1c2e]">Besok, 19 Okt 2023</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#0d3558] text-white text-[10px] font-semibold">
                  On Schedule
                </span>
              </div>

              {/* Card Ringkasan Pesanan */}
              <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400">Nomor Pesanan</span>
                    <span className="text-xs font-bold text-[#0d3558]">#HJB-20231018-09</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#bddefd] text-[#001d31] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#42617c] animate-pulse" />
                    Sedang Dikirim (J&T Express)
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-[#eef4ff] p-2.5 rounded-lg">
                  <img src={INITIAL_PRODUCTS[0].imageUrl} alt="Hijab" className="w-12 h-12 rounded-lg object-cover bg-white shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-bold text-[#0b1c2e] truncate">Pashmina Silk & Pashmina Ceruty</h2>
                    <p className="text-[10px] text-slate-500">2 Item Koleksi Eksklusif</p>
                    <p className="text-xs font-bold text-[#0d3558] mt-0.5">{formatRupiah(grandTotal)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    18 Oktober 2023, 09:30 WIB
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lunas</span>
                </div>
              </div>

              {/* Kurir & Resi */}
              <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0d3558] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Kurir & Resi Pengiriman</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs font-semibold text-[#0b1c2e] truncate">J&T Express</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-[#0d3558] truncate">JP9876543210</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Nomor resi tersalin!')}
                  className="px-2.5 py-1 rounded-lg bg-[#eef4ff] text-[#0d3558] text-xs font-semibold flex items-center gap-1 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>Salin</span>
                </button>
              </div>

              {/* Timeline Status Pengiriman */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <h3 className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558]">Status Pengiriman</h3>
                  <span className="text-[10px] text-[#42617c]">Terakhir Diperbarui 11:45 WIB</span>
                </div>

                <div className="relative pl-1 space-y-4 text-xs">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#294c70] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#0b1c2e]">Pesanan Dibuat</span>
                        <span className="text-[10px] text-slate-400">18 Okt, 09:30</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Pesanan Anda telah berhasil dibuat dalam sistem</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#294c70] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#0b1c2e]">Pembayaran Berhasil</span>
                        <span className="text-[10px] text-slate-400">18 Okt, 09:35</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Verifikasi transaksi pembayaran terkonfirmasi lunas</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#294c70] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#0b1c2e]">Pesanan Diproses</span>
                        <span className="text-[10px] text-slate-400">18 Okt, 11:00</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Produk sedang dikemas rapi dengan kotak eksklusif</p>
                    </div>
                  </div>

                  {/* Step 4: Active */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#a7c9f4] text-[#0d3558] ring-2 ring-[#0d3558] flex items-center justify-center shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0d3558]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#0d3558]">Pesanan Dikirim</span>
                        <span className="text-[10px] text-[#0d3558]">Dalam Perjalanan</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">Sedang dalam perjalanan oleh kurir menuju alamat tujuan</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#e5eeff] flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-400">Pesanan Diterima</span>
                        <span className="text-[10px] text-slate-400">Estimasi Besok</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Paket akan diserahterimakan kepada penerima</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Return Action */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Menghubungkan ke Customer Care HijabKu...')}
                  className="w-full h-11 rounded-xl bg-[#dbe9ff] text-[#0d3558] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                  <span>Hubungi Penjual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen(3)}
                  className="w-full h-11 rounded-xl bg-[#0d3558] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  <span>Kembali ke Beranda</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 11: AKUN SAYA
        ========================================================================= */}
        {currentScreen === 11 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-16">
            <div className="h-14 px-4 flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={BRAND_LOGO_URL} alt="HijabKu Logo" className="h-8 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="font-['Noto_Serif'] text-base font-bold text-[#0d3558] tracking-tight truncate leading-none">HijabKu</span>
                  <span className="text-[10px] text-[#43474e] tracking-wide mt-0.5">Akun</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[22px] text-[#43474e]">search</span>
                <span className="material-symbols-outlined text-[22px] text-[#43474e] ml-1">notifications</span>
                <img src={USER_AVATAR_URL} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#d1e4ff] ml-1" />
              </div>
            </div>

            <div className="px-4 py-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-['Noto_Serif'] text-lg font-bold text-[#0d3558] tracking-tight">Akun Saya</h1>
                  <p className="text-xs text-[#43474e]">Kelola profil, pesanan, dan preferensi Anda</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0d3558]">
                  <span className="material-symbols-outlined text-[18px]">notifications_none</span>
                </div>
              </div>

              {/* User Profile Header Card */}
              <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative shrink-0">
                    <img src={USER_AVATAR_URL} alt="Anisa Rahmawati" className="w-16 h-16 rounded-full object-cover shadow-xs" />
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0d3558] text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[10px]">verified</span>
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-[#0d3558] truncate">Anisa Rahmawati</h2>
                    <p className="text-xs text-[#43474e] truncate mt-0.5">0812-3456-7890 • anisa@email.com</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eae1d5] text-[#0d3558] w-fit">
                      <span className="material-symbols-outlined text-[12px]">stars</span>
                      <span className="text-[10px] font-semibold">Member Silver HijabKu</span>
                    </div>
                  </div>
                </div>

                {/* Quick Snapshot */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="bg-[#eef4ff] rounded-lg p-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#0d3558]">loyalty</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Poin Cantik</span>
                      <span className="text-xs font-bold text-[#0d3558]">1.450 Poin</span>
                    </div>
                  </div>
                  <div className="bg-[#eef4ff] rounded-lg p-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#0d3558]">confirmation_number</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kupon Saya</span>
                      <span className="text-xs font-bold text-[#0d3558]">3 Kupon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu List */}
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">Aktivitas Belanja</span>
                <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden divide-y divide-slate-100 text-xs">
                  <div
                    onClick={() => setCurrentScreen(10)}
                    className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#0d3558]">shopping_bag</span>
                      <div>
                        <span className="font-semibold text-[#0b1c2e] block">Pesanan Saya</span>
                        <span className="text-[10px] text-slate-400">Riwayat transaksi & status pesanan</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#bddefd] text-[#001d31] text-[10px] font-semibold">1 Dikirim</span>
                      <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
                    </div>
                  </div>

                  <div
                    onClick={() => showToast(`${wishlist.length} item tersimpan di wishlist`)}
                    className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#0d3558]">favorite</span>
                      <div>
                        <span className="font-semibold text-[#0b1c2e] block">Favorit & Wishlist</span>
                        <span className="text-[10px] text-slate-400">Koleksi hijab yang Anda simpan</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400">{wishlist.length} item</span>
                      <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">Pengaturan Akun</span>
                <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#0d3558]">location_on</span>
                      <div>
                        <span className="font-semibold text-[#0b1c2e] block">Alamat Pengiriman</span>
                        <span className="text-[10px] text-slate-400">Jl. Pemuda No. 45, Kota Cirebon</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#0d3558]">account_balance_wallet</span>
                      <div>
                        <span className="font-semibold text-[#0b1c2e] block">Metode Pembayaran</span>
                        <span className="text-[10px] text-slate-400">BCA Virtual Account, DANA</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#0d3558]">settings</span>
                      <div>
                        <span className="font-semibold text-[#0b1c2e] block">Pengaturan</span>
                        <span className="text-[10px] text-slate-400">Keamanan & kata sandi</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
                  </div>

                  {/* Keluar */}
                  <div
                    onClick={() => {
                      showToast('Berhasil keluar dari akun');
                      setCurrentScreen(2);
                    }}
                    className="flex items-center justify-between p-3.5 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      <span className="font-semibold">Keluar</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 12: ULASAN PRODUK
        ========================================================================= */}
        {currentScreen === 12 && (
          <div className="flex-1 flex flex-col overflow-y-auto pb-20">
            <div className="h-14 px-3 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <button type="button" onClick={() => setCurrentScreen(6)} className="w-10 h-10 flex items-center justify-center text-[#0b1c2e]">
                  <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="font-['Noto_Serif'] text-sm font-bold text-[#0d3558] truncate">Ulasan Produk</h1>
              </div>
              <img src={USER_AVATAR_URL} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#d1e4ff]" />
            </div>

            <div className="px-4 py-3 flex flex-col gap-3">
              {/* Product Summary Card */}
              <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-14 h-14 rounded-lg object-cover bg-slate-50 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#0d3558] truncate">{selectedProduct.name}</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-['Noto_Serif'] text-base font-bold text-[#294c70]">★ 4.8</span>
                    <span className="text-[10px] text-slate-400">/ 5.0</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Berdasarkan 128 Ulasan Pembeli</span>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                <button type="button" className="shrink-0 h-7 px-3 rounded-full bg-[#294c70] text-white text-xs font-medium">
                  Semua (128)
                </button>
                <button type="button" className="shrink-0 h-7 px-3 rounded-full bg-[#eef4ff] text-[#43474e] text-xs font-medium">
                  5 Bintang (110)
                </button>
                <button type="button" className="shrink-0 h-7 px-3 rounded-full bg-[#eef4ff] text-[#43474e] text-xs font-medium">
                  4 Bintang (14)
                </button>
              </div>

              {/* Review Items */}
              <div className="flex flex-col gap-2.5">
                {reviews.map((r) => (
                  <article key={r.id} className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e5eeff] text-[#0d3558] flex items-center justify-center font-bold text-xs">
                          {r.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#0d3558]">{r.author}</span>
                          <span className="text-[10px] text-slate-400">{r.date} • Varian: {r.variant}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-500 text-xs">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                  </article>
                ))}
              </div>
            </div>

            {/* Bottom Write Review Button */}
            <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3 border-t border-slate-100 z-40 max-w-[390px] mx-auto">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="w-full h-11 bg-[#0d3558] text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Tulis Ulasan
              </button>
            </div>

            {/* Review Dialog Modal */}
            {showReviewModal && (
              <div className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center p-4">
                <div className="bg-white rounded-2xl p-4 w-full shadow-2xl flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-[#0d3558]">Tulis Ulasan Produk</h4>
                  <textarea
                    rows={3}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Bagikan ulasan pengalaman Anda..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newReviewText.trim()) {
                          setReviews([
                            {
                              id: 'r-' + Date.now(),
                              author: 'Anisa Rahmawati',
                              initials: 'AR',
                              date: 'Baru saja',
                              variant: selectedVariant.name,
                              rating: 5,
                              text: newReviewText
                            },
                            ...reviews
                          ]);
                          setNewReviewText('');
                          setShowReviewModal(false);
                          showToast('Ulasan berhasil ditambahkan!');
                        }
                      }}
                      className="flex-1 py-2 bg-[#0d3558] text-white rounded-xl text-xs font-semibold"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            BOTTOM NAVIGATION BAR (Available on Screens 3, 4, 7, 10, 11)
        ========================================================================= */}
        {[3, 4, 7, 10, 11].includes(currentScreen) && (
          <nav className="fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 max-w-[390px]">
            <div className="flex justify-around items-center h-14 px-2">
              <a
                href="#beranda"
                onClick={(e) => { e.preventDefault(); navigateTab('beranda'); }}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-colors ${
                  activeTab === 'beranda' ? 'text-[#0d3558] font-bold' : 'text-[#43474e]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">home</span>
                <span className="text-[10px]">Beranda</span>
              </a>

              <a
                href="#kategori"
                onClick={(e) => { e.preventDefault(); navigateTab('kategori'); }}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-colors ${
                  activeTab === 'kategori' ? 'text-[#0d3558] font-bold' : 'text-[#43474e]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">category</span>
                <span className="text-[10px]">Kategori</span>
              </a>

              <a
                href="#keranjang"
                onClick={(e) => { e.preventDefault(); navigateTab('keranjang'); }}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-colors relative ${
                  activeTab === 'keranjang' ? 'text-[#0d3558] font-bold' : 'text-[#43474e]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span className="text-[10px]">Keranjang</span>
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-[#ba1a1a] text-white text-[9px] flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </a>

              <a
                href="#pesanan"
                onClick={(e) => { e.preventDefault(); navigateTab('pesanan'); }}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-colors ${
                  activeTab === 'pesanan' ? 'text-[#0d3558] font-bold' : 'text-[#43474e]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                <span className="text-[10px]">Pesanan</span>
              </a>

              <a
                href="#akun"
                onClick={(e) => { e.preventDefault(); navigateTab('akun'); }}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 transition-colors ${
                  activeTab === 'akun' ? 'text-[#0d3558] font-bold' : 'text-[#43474e]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
                <span className="text-[10px]">Akun</span>
              </a>
            </div>
          </nav>
        )}

      </div>
    </div>
  );
}
