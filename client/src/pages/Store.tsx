import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, Product, CartItem } from '../store/storeData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  Search,
  Star,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Printer,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Package,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useStoreCheckout } from '../hooks/useStripeCheckout';

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [customText, setCustomText] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'info' | 'confirm'>('cart');

  // Checkout form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { checkout: stripeCheckout, isLoading: stripeLoading } = useStoreCheckout();

  const handleAddToCart = (product: Product, size?: string, color?: string, text?: string) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1, selectedSize: size, selectedColor: color, customText: text }]);
    }

    toast.success(`"${product.name}" added to cart!`);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
    setCustomText('');
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(0, updated[index].quantity + delta);
    if (updated[index].quantity === 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('confirm');
  };

  const handleSimulateStripePayment = async () => {
    const stripeItems = cart.map(item => ({
      name: item.product.name + (item.selectedSize ? ` (${item.selectedSize})` : '') + (item.selectedColor ? ` - ${item.selectedColor}` : ''),
      price: item.product.price,
      quantity: item.quantity,
      description: item.customText ? `Custom: ${item.customText}` : item.product.category
    }));
    await stripeCheckout(stripeItems, email || undefined, `${firstName} ${lastName}`.trim() || undefined);
  };

  const featuredProducts = PRODUCTS.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== TOP NAV ===== */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center">
            <img
              src="/manus-storage/c2c_logo_d01c1ec7.webp"
              alt="All-Pro Coast 2 Coast LLC"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Search */}
          <div className="relative hidden md:block flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stickers, shirts, prints..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10 pl-9 rounded-xl h-9 text-xs"
            />
          </div>

          {/* Cart Button */}
          <Button
            onClick={() => { setCartOpen(true); setCheckoutStep('cart'); }}
            className="relative bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold"
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-cyan-400 text-black text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* ===== HERO BANNER ===== */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-background to-cyan-950/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
            🎨 Tulsa's Custom Print Shop
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Custom Stickers,
            </span>
            <br />
            <span className="text-foreground">Shirts & Prints</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Premium quality custom printing from All-Pro Coast 2 Coast LLC. Die-cut vinyl stickers, screenprinted apparel, and professional photo prints — all made right here in Tulsa, OK.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => setSelectedCategory('stickers')}
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold"
            >
              Shop Stickers
            </Button>
            <Button
              onClick={() => setSelectedCategory('tshirts')}
              variant="outline"
              className="border-white/20 hover:bg-white/5 rounded-xl font-bold"
            >
              Shop Apparel
            </Button>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <div className="border-y border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: '🎨', label: 'Custom Designs', sub: 'Your artwork or ours' },
            { icon: '⚡', label: 'Fast Turnaround', sub: '3–5 business days' },
            { icon: '🚚', label: 'Free Shipping', sub: 'On orders over $50' },
            { icon: '⭐', label: 'Premium Quality', sub: 'Cast vinyl & pro inks' }
          ].map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-1 py-2">
              <span className="text-xl">{b.icon}</span>
              <span className="text-xs font-bold text-foreground">{b.label}</span>
              <span className="text-[10px] text-muted-foreground">{b.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MAIN SHOP AREA ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl text-xs font-semibold gap-1.5 ${selectedCategory === cat.id ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'border-white/10 hover:bg-white/5'}`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Mobile Search */}
        <div className="relative md:hidden">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 pl-9 rounded-xl h-9 text-xs"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Card
              key={product.id}
              className="bg-card/40 border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/5"
              onClick={() => {
                setSelectedProduct(product);
                setSelectedSize(product.variants?.sizes?.[0] || '');
                setSelectedColor(product.variants?.colors?.[0] || '');
              }}
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden relative bg-black/20">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-pink-600 text-white border-0 text-[10px] font-bold">
                    {product.badge}
                  </Badge>
                )}
                {product.customizable && (
                  <Badge className="absolute top-3 right-3 bg-cyan-500/80 text-white border-0 text-[10px] font-bold">
                    Customizable
                  </Badge>
                )}
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                    {product.category.replace('-', ' ')}
                  </p>
                  <h3 className="font-bold text-sm text-foreground leading-tight mt-0.5 line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-pink-400 font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={e => {
                    e.stopPropagation();
                    if (product.variants?.sizes?.length || product.variants?.colors?.length) {
                      setSelectedProduct(product);
                      setSelectedSize(product.variants?.sizes?.[0] || '');
                      setSelectedColor(product.variants?.colors?.[0] || '');
                    } else {
                      handleAddToCart(product);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold h-9"
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No products found matching your search.</p>
          </div>
        )}
      </main>

      {/* ===== PRODUCT DETAIL MODAL ===== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-2xl bg-card border-white/10 rounded-2xl shadow-2xl my-8 relative overflow-hidden">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground z-10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square overflow-hidden bg-black/20 rounded-tl-2xl rounded-bl-2xl">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-6 space-y-5">
                <div>
                  {selectedProduct.badge && (
                    <Badge className="bg-pink-600 text-white border-0 text-[10px] font-bold mb-2">{selectedProduct.badge}</Badge>
                  )}
                  <h2 className="text-lg font-black text-foreground">{selectedProduct.name}</h2>
                  <p className="text-2xl font-black text-pink-400 font-mono mt-1">${selectedProduct.price.toFixed(2)}</p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{selectedProduct.description}</p>

                {/* Size Selector */}
                {selectedProduct.variants?.sizes && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedSize === size
                              ? 'bg-pink-600 border-pink-600 text-white'
                              : 'bg-white/5 border-white/10 text-muted-foreground hover:border-pink-500/40'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {selectedProduct.variants?.colors && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Color: <span className="text-foreground">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedColor === color
                              ? 'bg-pink-600 border-pink-600 text-white'
                              : 'bg-white/5 border-white/10 text-muted-foreground hover:border-pink-500/40'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Text */}
                {selectedProduct.customizable && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Custom Text / Notes (optional)
                    </label>
                    <Input
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      placeholder="e.g., Add my business name or logo..."
                      className="bg-black/40 border-white/10 rounded-xl text-xs h-9"
                    />
                  </div>
                )}

                <Button
                  onClick={() => handleAddToCart(selectedProduct, selectedSize, selectedColor, customText)}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold py-5"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart — ${selectedProduct.price.toFixed(2)}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ===== CART DRAWER ===== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-card border-l border-white/10 flex flex-col h-full shadow-2xl overflow-y-auto">
            {/* Cart Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {checkoutStep !== 'cart' && (
                  <button onClick={() => setCheckoutStep('cart')} className="p-1 rounded-lg hover:bg-white/5 mr-1">
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                <h3 className="font-bold text-base text-foreground">
                  {checkoutStep === 'cart' ? `Your Cart (${cartCount})` : checkoutStep === 'info' ? 'Shipping Info' : 'Order Review'}
                </h3>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Cart Step: Items */}
            {checkoutStep === 'cart' && (
              <div className="flex-1 flex flex-col">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 opacity-20 mb-3" />
                    <p className="text-sm font-medium">Your cart is empty</p>
                    <p className="text-xs mt-1">Add some products to get started!</p>
                    <Button onClick={() => setCartOpen(false)} className="mt-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs">
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-bold text-xs text-foreground line-clamp-1">{item.product.name}</h4>
                            {item.selectedSize && <p className="text-[10px] text-muted-foreground">Size: {item.selectedSize}</p>}
                            {item.selectedColor && <p className="text-[10px] text-muted-foreground">Color: {item.selectedColor}</p>}
                            {item.customText && <p className="text-[10px] text-cyan-400 italic">"{item.customText}"</p>}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleUpdateQuantity(idx, -1)} className="h-5 w-5 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center">
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-mono font-bold">{item.quantity}</span>
                                <button onClick={() => handleUpdateQuantity(idx, 1)} className="h-5 w-5 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center">
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-xs font-mono font-bold text-pink-400">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-mono text-foreground">${cartTotal.toFixed(2)}</span>
                      </div>
                      {cartTotal >= 50 && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold text-center">
                          🎉 You qualify for FREE shipping!
                        </div>
                      )}
                      <Button
                        onClick={() => setCheckoutStep('info')}
                        className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold py-5"
                      >
                        Proceed to Checkout
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Cart Step: Shipping Info */}
            {checkoutStep === 'info' && (
              <form onSubmit={handleCheckout} className="flex-1 flex flex-col">
                <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">First Name</label>
                      <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">Last Name</label>
                      <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">Email Address</label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">Phone Number</label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                  </div>

                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider pt-2">Shipping Address</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">Street Address</label>
                    <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] text-muted-foreground">City</label>
                      <Input value={city} onChange={e => setCity(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">State</label>
                      <Input value={state} onChange={e => setState(e.target.value)} placeholder="OK" className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">ZIP</label>
                      <Input value={zip} onChange={e => setZip(e.target.value)} className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" required />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5">
                  <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold py-5">
                    Review Order
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </form>
            )}

            {/* Cart Step: Confirm & Pay */}
            {checkoutStep === 'confirm' && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                  {/* Order Summary */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Order Summary</h4>
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                        <span className="font-mono font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-bold">
                      <span>Total:</span>
                      <span className="font-mono text-pink-400">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1 text-muted-foreground">
                    <p className="font-bold text-foreground">Shipping To:</p>
                    <p>{firstName} {lastName}</p>
                    <p>{address}, {city}, {state} {zip}</p>
                    <p>{email} · {phone}</p>
                  </div>

                  {/* Stripe Payment Notice */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-cyan-950/20 border border-pink-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold text-foreground">Secure Stripe Checkout</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Your payment is processed securely by Stripe. We accept all major credit/debit cards.
                    </p>
                    <p className="text-[10px] text-cyan-400 font-mono">Test card: 4242 4242 4242 4242</p>
                  </div>
                </div>

                <div className="p-4 border-t border-white/5">
                  <Button
                    onClick={handleSimulateStripePayment}
                    disabled={stripeLoading}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold py-5"
                  >
                    {stripeLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Opening Stripe Checkout...</>
                    ) : (
                      <><ShieldCheck className="h-4 w-4 mr-2" /> Pay Securely — ${cartTotal.toFixed(2)}</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 bg-black/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-muted-foreground">
          <div className="space-y-3">
            <img src="/manus-storage/c2c_logo_d01c1ec7.webp" alt="All-Pro Coast 2 Coast LLC" className="h-10 w-auto object-contain" />
            <p>Tulsa's premier custom print shop for vehicle wraps, stickers, apparel, and more.</p>
            <p className="font-mono text-cyan-400">(918) 555-0199</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Products</h4>
            {['Custom Stickers', 'T-Shirts & Apparel', 'Photo Prints', 'Vehicle Wraps', 'Window Graphics'].map(p => (
              <p key={p} className="hover:text-foreground cursor-pointer transition-colors">{p}</p>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Contact</h4>
            <p>5812 E 11th St, Tulsa, OK 74112</p>
            <p>design@coast2coast.com</p>
            <p>Mon–Fri: 8am–6pm CST</p>
            <p>Sat: 9am–3pm CST</p>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} All-Pro Coast 2 Coast LLC. All rights reserved. Tulsa, OK.
        </div>
      </footer>
    </div>
  );
}
