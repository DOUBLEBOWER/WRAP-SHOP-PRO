import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Printer, ShoppingCart, UploadCloud, X, ChevronRight,
  Sparkles, Star, CheckCircle, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const SHAPES = [
  { id: 'circle', label: 'Circle', css: 'rounded-full' },
  { id: 'square', label: 'Square', css: 'rounded-lg' },
  { id: 'rounded', label: 'Rounded Rect', css: 'rounded-2xl' },
  { id: 'die-cut', label: 'Die-Cut', css: 'rounded-[40%_60%_60%_40%/40%_40%_60%_60%]' }
];

const FINISHES = [
  { id: 'gloss', label: 'Gloss', desc: 'Shiny, vibrant colors', price: 0 },
  { id: 'matte', label: 'Matte', desc: 'Smooth, no-glare finish', price: 0.5 },
  { id: 'holographic', label: 'Holographic', desc: 'Color-shifting rainbow effect', price: 1.5 },
  { id: 'clear', label: 'Clear', desc: 'Transparent background', price: 1.0 }
];

const SIZES = [
  { id: 'xs', label: '2"', px: 80, price: 2.99 },
  { id: 'sm', label: '3"', px: 110, price: 3.99 },
  { id: 'md', label: '4"', px: 140, price: 4.99 },
  { id: 'lg', label: '5"', px: 170, price: 5.99 },
  { id: 'xl', label: '6"', px: 200, price: 6.99 }
];

const QTY_BREAKS = [
  { qty: 1, label: '1 sticker', discount: 0 },
  { qty: 5, label: '5 pack', discount: 0.05 },
  { qty: 10, label: '10 pack', discount: 0.10 },
  { qty: 25, label: '25 pack', discount: 0.15 },
  { qty: 50, label: '50 pack', discount: 0.20 },
  { qty: 100, label: '100 pack', discount: 0.25 }
];

export default function StickerGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  const [selectedQty, setSelectedQty] = useState(QTY_BREAKS[0]);
  const [customText, setCustomText] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const basePrice = selectedSize.price + selectedFinish.price;
  const discountedPrice = basePrice * (1 - selectedQty.discount);
  const totalPrice = discountedPrice * selectedQty.qty;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WEBP, SVG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    if (!uploadedImage) {
      toast.error('Please upload your image or logo first!');
      return;
    }
    setAddedToCart(true);
    toast.success(`${selectedQty.qty}x ${selectedSize.label} ${selectedFinish.label} sticker${selectedQty.qty > 1 ? 's' : ''} added to cart! Total: $${totalPrice.toFixed(2)}`);
  };

  const getFinishOverlay = () => {
    switch (selectedFinish.id) {
      case 'holographic':
        return 'bg-gradient-to-br from-pink-400/30 via-cyan-400/20 to-purple-400/30 mix-blend-overlay';
      case 'matte':
        return 'bg-white/5';
      case 'clear':
        return 'bg-white/10 border-2 border-dashed border-white/30';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <a href="/store" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <img src="/manus-storage/c2c_logo_d01c1ec7.webp" alt="All-Pro Coast 2 Coast" className="h-9 w-auto object-contain" />
          </a>
          <div className="text-center">
            <h1 className="font-black text-sm bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Custom Sticker Designer
            </h1>
            <p className="text-[10px] text-muted-foreground">Upload your image · Choose your style · Order online</p>
          </div>
          <a href="/store">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5" /> Back to Store
            </Button>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ===== LEFT: LIVE PREVIEW ===== */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="text-center space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3 mr-1" /> Live Preview
              </Badge>
              <h2 className="text-2xl font-black text-foreground">Your Custom Sticker</h2>
            </div>

            {/* Preview Box */}
            <div className="flex items-center justify-center min-h-[320px] bg-gradient-to-br from-black/40 to-purple-950/20 rounded-2xl border border-white/5 p-8 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                backgroundSize: '12px 12px'
              }} />

              {/* Sticker Preview */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div
                  className={`relative overflow-hidden shadow-2xl shadow-pink-500/20 border-2 border-white/10 transition-all duration-300 ${selectedShape.css}`}
                  style={{ width: selectedSize.px, height: selectedSize.px }}
                >
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Your sticker" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-cyan-500/20 flex items-center justify-center">
                      <div className="text-center space-y-1">
                        <UploadCloud className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                        <p className="text-[10px] text-muted-foreground">Your image here</p>
                      </div>
                    </div>
                  )}
                  {/* Finish overlay */}
                  <div className={`absolute inset-0 pointer-events-none ${getFinishOverlay()}`} />
                </div>

                {customText && (
                  <p className="text-xs font-bold text-foreground bg-black/60 px-3 py-1 rounded-full border border-white/10">
                    {customText}
                  </p>
                )}

                <div className="text-center space-y-1">
                  <p className="text-[11px] text-muted-foreground">
                    {selectedSize.label} · {selectedShape.label} · {selectedFinish.label}
                  </p>
                  <p className="text-xs font-mono font-bold text-pink-400">
                    ${discountedPrice.toFixed(2)} each
                    {selectedQty.discount > 0 && (
                      <span className="text-emerald-400 ml-1">({(selectedQty.discount * 100).toFixed(0)}% off)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <Card className="bg-gradient-to-br from-purple-950/20 to-cyan-950/20 border-pink-500/20 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Base price ({selectedSize.label} {selectedFinish.label}):</span>
                <span className="font-mono text-foreground">${basePrice.toFixed(2)} ea</span>
              </div>
              {selectedQty.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                  <span>Bulk discount ({(selectedQty.discount * 100).toFixed(0)}% off):</span>
                  <span className="font-mono">-${(basePrice * selectedQty.discount).toFixed(2)} ea</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Quantity:</span>
                <span className="font-mono text-foreground">× {selectedQty.qty}</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between text-base font-black">
                <span className="text-cyan-400">Total:</span>
                <span className="font-mono text-cyan-400">${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`w-full rounded-xl font-bold py-5 text-sm transition-all ${
                  addedToCart
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600'
                } text-white`}
              >
                {addedToCart ? (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart — ${totalPrice.toFixed(2)}</>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                Printed on premium 4mil cast vinyl · Weatherproof · UV resistant
              </p>
            </Card>
          </div>

          {/* ===== RIGHT: CONFIGURATION PANEL ===== */}
          <div className="space-y-6">
            {/* Step 1: Upload Image */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-pink-600 text-white text-xs font-black flex items-center justify-center">1</div>
                <h3 className="font-bold text-sm text-foreground">Upload Your Image or Logo</h3>
              </div>

              {uploadedImage ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <img src={uploadedImage} alt="Uploaded" className="h-14 w-14 rounded-lg object-cover border border-white/10" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">Image uploaded ✓</p>
                    <p className="text-[10px] text-muted-foreground">Looking great! Adjust your options below.</p>
                  </div>
                  <button onClick={() => setUploadedImage(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-pink-500/40 hover:bg-black/10 transition-all"
                >
                  <UploadCloud className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs font-bold text-foreground">Drag & Drop or Click to Upload</p>
                  <p className="text-[10px] text-muted-foreground mt-1">JPG · PNG · WEBP · SVG · AI · PDF</p>
                  <p className="text-[10px] text-cyan-400 mt-2 font-semibold">Use high-resolution files for best print quality</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Add Custom Text (optional)</Label>
                <Input value={customText} onChange={e => setCustomText(e.target.value)}
                  placeholder="e.g., your website, phone number, or slogan"
                  className="bg-black/40 border-white/10 rounded-xl h-9 text-xs" />
              </div>
            </Card>

            {/* Step 2: Shape */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">2</div>
                <h3 className="font-bold text-sm text-foreground">Choose Shape</h3>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {SHAPES.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => setSelectedShape(shape)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedShape.id === shape.id
                        ? 'border-pink-500/50 bg-pink-500/10'
                        : 'border-white/5 bg-white/5 hover:border-pink-500/20'
                    }`}
                  >
                    <div className={`h-8 w-8 mx-auto mb-1.5 bg-gradient-to-br from-pink-400 to-cyan-400 ${shape.css}`} />
                    <span className="text-[10px] font-semibold text-foreground">{shape.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Step 3: Size */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-cyan-600 text-white text-xs font-black flex items-center justify-center">3</div>
                <h3 className="font-bold text-sm text-foreground">Choose Size</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedSize.id === size.id
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-white/5 bg-white/5 hover:border-cyan-500/20'
                    }`}
                  >
                    <span className="text-sm font-black text-foreground block">{size.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">${size.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Step 4: Finish */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center">4</div>
                <h3 className="font-bold text-sm text-foreground">Choose Finish</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FINISHES.map(finish => (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedFinish.id === finish.id
                        ? 'border-amber-500/50 bg-amber-500/10'
                        : 'border-white/5 bg-white/5 hover:border-amber-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-foreground">{finish.label}</span>
                      {finish.price > 0 && (
                        <Badge className="bg-white/10 border-white/10 text-muted-foreground text-[9px]">+${finish.price.toFixed(2)}</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{finish.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Step 5: Quantity */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">5</div>
                <h3 className="font-bold text-sm text-foreground">Choose Quantity</h3>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Bulk discounts available!</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {QTY_BREAKS.map(q => (
                  <button
                    key={q.qty}
                    onClick={() => setSelectedQty(q)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedQty.qty === q.qty
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-white/5 bg-white/5 hover:border-emerald-500/20'
                    }`}
                  >
                    <span className="font-black text-sm text-foreground block">{q.qty}</span>
                    <span className="text-[10px] text-muted-foreground">{q.label}</span>
                    {q.discount > 0 && (
                      <span className="text-[9px] text-emerald-400 font-bold block">{(q.discount * 100).toFixed(0)}% off</span>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/30 py-6 text-center text-[11px] text-muted-foreground mt-10">
        <p>All-Pro Coast 2 Coast LLC · 5812 E 11th St, Tulsa, OK 74112 · (918) 555-0199</p>
        <p className="mt-1">All stickers printed on premium 4mil cast vinyl with UV-resistant inks. Ships within 3–5 business days.</p>
      </footer>
    </div>
  );
}
