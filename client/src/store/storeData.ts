export interface Product {
  id: string;
  name: string;
  category: 'stickers' | 'tshirts' | 'photo-prints';
  description: string;
  price: number;
  images: string[];
  variants?: {
    sizes?: string[];
    colors?: string[];
    materials?: string[];
  };
  customizable: boolean;
  featured: boolean;
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  customText?: string;
}

export const PRODUCTS: Product[] = [
  // ---- STICKERS ----
  {
    id: 'stk_001',
    name: 'Custom Die-Cut Vinyl Sticker',
    category: 'stickers',
    description: 'Premium 4mil cast vinyl die-cut sticker, cut precisely to your design shape. Weatherproof, UV-resistant, and perfect for vehicles, laptops, and outdoor use. Minimum order 1 sticker.',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ],
    variants: { materials: ['Gloss Vinyl', 'Matte Vinyl', 'Holographic'] },
    customizable: true,
    featured: true,
    inStock: true,
    badge: 'Best Seller'
  },
  {
    id: 'stk_002',
    name: 'Route 66 Tulsa Sticker Pack (5-Pack)',
    category: 'stickers',
    description: 'Exclusive All-Pro Coast 2 Coast Route 66 Tulsa collection. 5 unique designs celebrating the spirit of Route 66 and Tulsa culture. 3" x 3" each, gloss finish.',
    price: 14.99,
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80'
    ],
    customizable: false,
    featured: true,
    inStock: true,
    badge: 'Exclusive'
  },
  {
    id: 'stk_003',
    name: 'Custom Kiss-Cut Sticker Sheet',
    category: 'stickers',
    description: 'Full 8.5" x 11" sticker sheet with your custom designs kiss-cut for easy peeling. Perfect for branding, giveaways, and promotional use.',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80'
    ],
    variants: { materials: ['Gloss', 'Matte', 'Clear'] },
    customizable: true,
    featured: false,
    inStock: true
  },
  {
    id: 'stk_004',
    name: 'Holographic Chrome Sticker',
    category: 'stickers',
    description: 'Eye-catching holographic chrome vinyl sticker. Shifts colors in the light. Perfect for custom car builds, laptops, and gear. 3" diameter circle.',
    price: 6.99,
    images: [
      'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80'
    ],
    variants: { materials: ['Holographic Silver', 'Holographic Gold', 'Holographic Rainbow'] },
    customizable: true,
    featured: false,
    inStock: true,
    badge: 'New'
  },

  // ---- T-SHIRTS ----
  {
    id: 'tsh_001',
    name: 'All-Pro Coast 2 Coast Signature Tee',
    category: 'tshirts',
    description: 'Premium Gildan Softstyle 100% ringspun cotton tee featuring the iconic All-Pro Coast 2 Coast logo with Route 66 graphic. Soft, durable, and comfortable for everyday wear.',
    price: 24.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
    ],
    variants: {
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      colors: ['Black', 'White', 'Navy', 'Charcoal', 'Red']
    },
    customizable: false,
    featured: true,
    inStock: true,
    badge: 'Fan Favorite'
  },
  {
    id: 'tsh_002',
    name: 'Custom Screenprinted T-Shirt',
    category: 'tshirts',
    description: 'Fully custom screenprinted t-shirt with your logo or design. Minimum order 12 shirts. Price per shirt. Gildan Softstyle or Bella+Canvas available. Perfect for teams, events, and businesses.',
    price: 18.99,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80'
    ],
    variants: {
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
      colors: ['Black', 'White', 'Navy', 'Red', 'Royal Blue', 'Forest Green', 'Charcoal']
    },
    customizable: true,
    featured: true,
    inStock: true,
    badge: 'Custom'
  },
  {
    id: 'tsh_003',
    name: 'Tulsa Wraps & Rides Hoodie',
    category: 'tshirts',
    description: 'Heavy-blend 8oz pullover hoodie with the Tulsa Wraps & Rides graphic. Double-lined hood, front pouch pocket. Gildan 18500 blank.',
    price: 44.99,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80'
    ],
    variants: {
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'Charcoal', 'Navy']
    },
    customizable: false,
    featured: false,
    inStock: true
  },

  // ---- PHOTO PRINTS ----
  {
    id: 'prt_001',
    name: 'Custom Vehicle Wrap Photo Print',
    category: 'photo-prints',
    description: 'High-resolution professional photo print of your completed vehicle wrap. Printed on premium 10mil satin photo paper with UV coating. Perfect for framing or portfolio display.',
    price: 19.99,
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
    ],
    variants: {
      sizes: ['5x7"', '8x10"', '11x14"', '16x20"', '24x36"']
    },
    customizable: true,
    featured: true,
    inStock: true,
    badge: 'Popular'
  },
  {
    id: 'prt_002',
    name: 'Route 66 Tulsa Art Print',
    category: 'photo-prints',
    description: 'Exclusive All-Pro Coast 2 Coast Route 66 Tulsa artwork print. Printed on museum-quality 300gsm fine art paper with archival inks. Signed and numbered limited edition.',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
    ],
    variants: {
      sizes: ['8x10"', '11x14"', '16x20"']
    },
    customizable: false,
    featured: true,
    inStock: true,
    badge: 'Limited Edition'
  },
  {
    id: 'prt_003',
    name: 'Custom Canvas Photo Print',
    category: 'photo-prints',
    description: 'Your photo or design printed on a premium gallery-wrapped canvas. 1.5" thick solid pine frame, ready to hang. Fade-resistant archival inks.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: {
      sizes: ['8x10"', '11x14"', '16x20"', '20x30"']
    },
    customizable: true,
    featured: false,
    inStock: true
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products', emoji: '🛍️' },
  { id: 'stickers', name: 'Custom Stickers', emoji: '🎨' },
  { id: 'tshirts', name: 'T-Shirts & Apparel', emoji: '👕' },
  { id: 'photo-prints', name: 'Photo Prints', emoji: '🖼️' }
];
