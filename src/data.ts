export interface ProductVariant {
  id: string;
  name: string;
  hex: string;
  stock: number;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  soldCount: number;
  stock: number;
  tag: string;
  material: string;
  description: string;
  imageUrl: string;
  variants: ProductVariant[];
}

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  tagline: string;
  icon: string;
  img: string;
}

export interface CartProduct {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  checked: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  initials: string;
  date: string;
  variant: string;
  rating: number;
  text: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    categoryId: 'c1',
    categoryName: 'Pashmina',
    name: 'Pashmina Silk Premium',
    price: 35000,
    originalPrice: 55000,
    discount: 36,
    rating: 4.9,
    soldCount: 1200,
    stock: 148,
    tag: 'Silk Premium',
    material: 'Silk Shimmer',
    description: 'Pashmina berbahan silk premium dengan tekstur lembut, adem di kulit, mudah dibentuk, dan memberikan kesan anggun berkilau untuk acara formal maupun santai.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU1A8Z40gwlh1H0W9KdgT1a6MzQUHxxNCCig6n5EFsp3uPYgG9jtpYS5P6FSyQG0LdQhp-dsxQtA2ZBssf4rCE1_h4DPVxDysHYFdXdjqGf3KEp8qCeIkpClH8luFFyjWNZeyN1KWijYDKAz7JIrEyW2efJP8sTDM2oVdG3a36o6IIRNLhTRTWURTEaP6l6TuX4VShvHDsG5nmYI5nSE2FU_PvdM6QAlB4Bd7vRgxfRQlEQSpG4YI',
    variants: [
      { id: 'v1', name: 'Soft Blue', hex: '#A8C7EC', stock: 45 },
      { id: 'v2', name: 'Warm Beige', hex: '#EAE1D5', stock: 38 },
      { id: 'v3', name: 'Dusty Grey', hex: '#B8BDC6', stock: 35 },
      { id: 'v4', name: 'Sage Green', hex: '#BAC8B6', stock: 30 }
    ]
  },
  {
    id: 'p2',
    categoryId: 'c1',
    categoryName: 'Pashmina',
    name: 'Pashmina Ceruty',
    price: 32000,
    originalPrice: 48000,
    discount: 33,
    rating: 4.8,
    soldCount: 980,
    stock: 120,
    tag: 'Babydoll',
    material: 'Babydoll',
    description: 'Pashmina ceruty babydoll berkualitas tinggi, flowy, adem saat dipakai, dan gampang dikreasikan tanpa mudah kusut.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUur2pmpXI-8S1pBGWBVovkcjipgkamvEQO4MPrrkkPFPSwgp_PBXek3C7nRfZlR-2VdMucoCO-vCKGJg3TV8qup_ItWlsJiE4nF8CHoXJYBZKH54ls8dkPcrC4W6841R0FVkqz6V_p8AUK6-D09GD9_GceA76faVMd1BEfBXW2E6PWMs71mvcV542zZNxzBcmeL6A6PxCyZ0uw7hTxkA-lWQHlqMpNl3QPNdppvPAsFhc89E079s',
    variants: [
      { id: 'v5', name: 'Warm Beige', hex: '#EAE1D5', stock: 50 },
      { id: 'v6', name: 'Mocca', hex: '#C4A482', stock: 40 },
      { id: 'v7', name: 'Navy', hex: '#0D3558', stock: 30 }
    ]
  },
  {
    id: 'p3',
    categoryId: 'c1',
    categoryName: 'Pashmina',
    name: 'Pashmina Crinkle',
    price: 28000,
    originalPrice: 42000,
    discount: 33,
    rating: 4.7,
    soldCount: 750,
    stock: 95,
    tag: 'Ironless',
    material: 'Textured Voal',
    description: 'Pashmina textured voal crinkle yang ironless, sangat praktis untuk kuliah atau bekerja tanpa perlu disetrika.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDCMAJ-_hyj4O7w0ZZr2HsWFf_TRkV7ycknC3WqCEdX9Uhfu08yUhW8BuRi47tCdu7PmJS7R5rCTAm5fFnmyXHHQLto7A-WrDHYw1Hb1YpS7m6Nw6GGIzkPGztxTO6EI_8v7dha4sx8Bp2BFDgNiTDicuT2592hmb8noNXyqzme-lflIFH70eInSuKKiI9V8vZ8q-Sw1g20xyJolFsF7k7e-D4TZi4gDcuxj1IWUHRUdvT05VsM4',
    variants: [
      { id: 'v8', name: 'Dusty Grey', hex: '#B8BDC6', stock: 35 },
      { id: 'v9', name: 'Sage Green', hex: '#BAC8B6', stock: 30 }
    ]
  },
  {
    id: 'p4',
    categoryId: 'c1',
    categoryName: 'Pashmina',
    name: 'Pashmina Plisket',
    price: 30000,
    originalPrice: 45000,
    discount: 33,
    rating: 4.8,
    soldCount: 860,
    stock: 110,
    tag: 'Micro Pleat',
    material: 'Micro Pleat',
    description: 'Pashmina lipit micro pleat rapi penuh dengan ujung jahit tepi rapat. Tampilan modis dan jatuh anggun.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFH6hDmbNJZEwAsgo6mNwZtn0xZSbZp__zYg2mX1jO_zHcU8dMCjDy6nuWX7ulOwNy8UIIw9BlJwtLNrl2EaQYQJX7aodVzIuu4cCvCDpgcXRi2AL18HUOM-H92f8oZFgZ_C0TzJ8ENmK3Cpy7HIhfWK_9pKcGx7pmo89Jctz_GmCQZyV0sDZC9j_umhfdLIG5ZqjebNfiEFlb67V_wMkgjpVa9OpAo0X2erflUS70o_dBSOsj5yA',
    variants: [
      { id: 'v10', name: 'Soft Blue', hex: '#A8C7EC', stock: 45 },
      { id: 'v11', name: 'Warm Beige', hex: '#EAE1D5', stock: 38 }
    ]
  },
  {
    id: 'p5',
    categoryId: 'c2',
    categoryName: 'Segi Empat',
    name: 'Segi Empat Voal',
    price: 30000,
    originalPrice: 45000,
    discount: 33,
    rating: 4.9,
    soldCount: 1400,
    stock: 200,
    tag: 'Ultrafine Voal',
    material: 'Ultrafine Voal',
    description: 'Jilbab segi empat ultrafine voal yang tegak di dahi dan sejuk dipakai seharian.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDCMAJ-_hyj4O7w0ZZr2HsWFf_TRkV7ycknC3WqCEdX9Uhfu08yUhW8BuRi47tCdu7PmJS7R5rCTAm5fFnmyXHHQLto7A-WrDHYw1Hb1YpS7m6Nw6GGIzkPGztxTO6EI_8v7dha4sx8Bp2BFDgNiTDicuT2592hmb8noNXyqzme-lflIFH70eInSuKKiI9V8vZ8q-Sw1g20xyJolFsF7k7e-D4TZi4gDcuxj1IWUHRUdvT05VsM4',
    variants: [
      { id: 'v12', name: 'Soft Navy', hex: '#294C70', stock: 60 },
      { id: 'v13', name: 'Cream', hex: '#EAE1D5', stock: 50 }
    ]
  },
  {
    id: 'p6',
    categoryId: 'c3',
    categoryName: 'Bergo',
    name: 'Bergo Daily',
    price: 38000,
    originalPrice: 50000,
    discount: 24,
    rating: 4.7,
    soldCount: 920,
    stock: 85,
    tag: 'Comfort Jersey',
    material: 'Comfort Jersey',
    description: 'Bergo santai bahan comfort jersey premium, tinggal slup langsung rapi dan menutup dada sempurna.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFH6hDmbNJZEwAsgo6mNwZtn0xZSbZp__zYg2mX1jO_zHcU8dMCjDy6nuWX7ulOwNy8UIIw9BlJwtLNrl2EaQYQJX7aodVzIuu4cCvCDpgcXRi2AL18HUOM-H92f8oZFgZ_C0TzJ8ENmK3Cpy7HIhfWK_9pKcGx7pmo89Jctz_GmCQZyV0sDZC9j_umhfdLIG5ZqjebNfiEFlb67V_wMkgjpVa9OpAo0X2erflUS70o_dBSOsj5yA',
    variants: [
      { id: 'v14', name: 'Dusty Blue', hex: '#A8C7EC', stock: 40 },
      { id: 'v15', name: 'Hitam', hex: '#243447', stock: 45 }
    ]
  }
];

export const CATEGORIES: CategoryItem[] = [
  { id: 'c1', name: 'Pashmina', count: 48, icon: 'styler', tagline: 'Favorit Acara Formal', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUur2pmpXI-8S1pBGWBVovkcjipgkamvEQO4MPrrkkPFPSwgp_PBXek3C7nRfZlR-2VdMucoCO-vCKGJg3TV8qup_ItWlsJiE4nF8CHoXJYBZKH54ls8dkPcrC4W6841R0FVkqz6V_p8AUK6-D09GD9_GceA76faVMd1BEfBXW2E6PWMs71mvcV542zZNxzBcmeL6A6PxCyZ0uw7hTxkA-lWQHlqMpNl3QPNdppvPAsFhc89E079s' },
  { id: 'c2', name: 'Segi Empat', count: 64, icon: 'crop_square', tagline: 'Tegak Sempurna & Ringan', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDCMAJ-_hyj4O7w0ZZr2HsWFf_TRkV7ycknC3WqCEdX9Uhfu08yUhW8BuRi47tCdu7PmJS7R5rCTAm5fFnmyXHHQLto7A-WrDHYw1Hb1YpS7m6Nw6GGIzkPGztxTO6EI_8v7dha4sx8Bp2BFDgNiTDicuT2592hmb8noNXyqzme-lflIFH70eInSuKKiI9V8vZ8q-Sw1g20xyJolFsF7k7e-D4TZi4gDcuxj1IWUHRUdvT05VsM4' },
  { id: 'c3', name: 'Bergo', count: 35, icon: 'face_3', tagline: 'Praktis Untuk Keseharian', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFH6hDmbNJZEwAsgo6mNwZtn0xZSbZp__zYg2mX1jO_zHcU8dMCjDy6nuWX7ulOwNy8UIIw9BlJwtLNrl2EaQYQJX7aodVzIuu4cCvCDpgcXRi2AL18HUOM-H92f8oZFgZ_C0TzJ8ENmK3Cpy7HIhfWK_9pKcGx7pmo89Jctz_GmCQZyV0sDZC9j_umhfdLIG5ZqjebNfiEFlb67V_wMkgjpVa9OpAo0X2erflUS70o_dBSOsj5yA' },
  { id: 'c4', name: 'Hijab Instan', count: 29, icon: 'bolt', tagline: 'Syari & Sporty Chic', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU1A8Z40gwlh1H0W9KdgT1a6MzQUHxxNCCig6n5EFsp3uPYgG9jtpYS5P6FSyQG0LdQhp-dsxQtA2ZBssf4rCE1_h4DPVxDysHYFdXdjqGf3KEp8qCeIkpClH8luFFyjWNZeyN1KWijYDKAz7JIrEyW2efJP8sTDM2oVdG3a36o6IIRNLhTRTWURTEaP6l6TuX4VShvHDsG5nmYI5nSE2FU_PvdM6QAlB4Bd7vRgxfRQlEQSpG4YI' },
  { id: 'c5', name: 'Ciput & Inner', count: 18, icon: 'diamond', tagline: 'Anti Pusing & Sejuk', img: 'https://lh3.googleusercontent.com/aida/AEtjO1VHjPjG3YmkB-IjbchX1K-tnWBZx9UK6Z9RcXPIv4uFq2yVhL9MsI1ULDMZdI3GqOLQo2lJtKb_aBIf9IancpDsM7YqkA30xMgPiZNfGHkP39RBNJDD2v7ZvqYyfihW6BkJdy_p97R5YH229q-Q0mvmsfy2h_drkyKunSNpUgTqJxVzLR8XUlHV40KcXbO9OfGNuMley5MbOBtOyXmwKWiNGoS5Rn3WnJiGyILBJIWKHcSD1n6W294cQw' }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  { id: 'r1', author: 'Nadia S.', initials: 'NS', date: 'Kemarin', variant: 'Soft Blue', rating: 5, text: 'Bahan silk sangat lembut, adem dan tidak licin. Warnanya cantik sekali sesuai foto produk. Jahitan tepi rapi!' },
  { id: 'r2', author: 'Rania P.', initials: 'RP', date: '3 hari lalu', variant: 'Soft Blue', rating: 5, text: 'Pashmina ternyaman, gampang dibentuk di dahi. Packing pengiriman juga aman dan cepat sampai.' },
  { id: 'r3', author: 'Aisyah B.', initials: 'AB', date: '5 hari lalu', variant: 'Soft Blue', rating: 4, text: 'Kualitas kain bagus dan jatuh elegan. Sedikit transparan jika satu lapis tapi aman kalau dilipat dua.' }
];

export const BRAND_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1VHjPjG3YmkB-IjbchX1K-tnWBZx9UK6Z9RcXPIv4uFq2yVhL9MsI1ULDMZdI3GqOLQo2lJtKb_aBIf9IancpDsM7YqkA30xMgPiZNfGHkP39RBNJDD2v7ZvqYyfihW6BkJdy_p97R5YH229q-Q0mvmsfy2h_drkyKunSNpUgTqJxVzLR8XUlHV40KcXbO9OfGNuMley5MbOBtOyXmwKWiNGoS5Rn3WnJiGyILBJIWKHcSD1n6W294cQw';
export const USER_AVATAR_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_D23PZtlvFkoKhXb8xeB6IWCgncX1aVOy0K_QH6SEmGhiSylTysKLsCpppH-v_Oh6TmW62eOYu-Vu2w3t1tvvt7FICsJf4RGjLAT_JmiziFRTYo-PKYmpU4TdohVVDGgqO3W8Du3EneNdiokP3Kv8ToV0cfU5ex6Klo2MI27rb_m-JBo3OAGJ74oOQ4av60Ckwv5GfGTLArkKRrjbmSJC6DdlXponTgQ22uTwktA8ddrTTjIoycs';
