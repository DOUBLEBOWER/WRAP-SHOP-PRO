import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, UploadCloud, Sparkles, Download, X, ChevronRight,
  ChevronLeft, Loader2, CheckCircle, Car, Palette, Building2, Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

// ---- Vehicle Database ----
const VEHICLE_MAKES: Record<string, string[]> = {
  'Ford': ['F-150', 'F-250', 'F-350', 'Transit Van', 'Transit Connect', 'Explorer', 'Expedition', 'Ranger', 'Maverick', 'Edge'],
  'Chevrolet': ['Silverado 1500', 'Silverado 2500', 'Express Van', 'Tahoe', 'Suburban', 'Equinox', 'Traverse', 'Colorado'],
  'GMC': ['Sierra 1500', 'Sierra 2500', 'Savana Van', 'Yukon', 'Canyon', 'Terrain'],
  'RAM': ['1500', '2500', '3500', 'ProMaster Van', 'ProMaster City'],
  'Toyota': ['Tundra', 'Tacoma', 'Sienna', '4Runner', 'Highlander', 'Sequoia', 'Land Cruiser'],
  'Honda': ['Ridgeline', 'Pilot', 'Odyssey', 'Passport', 'HR-V'],
  'Nissan': ['Titan', 'Frontier', 'NV Cargo', 'Armada', 'Pathfinder', 'Murano'],
  'Mercedes-Benz': ['Sprinter Van', 'Metris', 'G-Class', 'GLS', 'GLE'],
  'Dodge': ['Durango', 'Grand Caravan', 'Charger', 'Challenger'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Gladiator', 'Cherokee', 'Commander'],
  'Trailer': ['12ft Enclosed', '16ft Enclosed', '20ft Enclosed', '24ft Enclosed', '28ft Enclosed', 'Open Car Hauler', 'Flatbed'],
  'Box Truck': ['14ft Box Truck', '16ft Box Truck', '20ft Box Truck', '24ft Box Truck', '26ft Box Truck'],
  'Other': ['Custom Vehicle', 'Motorcycle', 'Golf Cart', 'ATV / UTV', 'Boat']
};

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

const DESIGN_STYLES = [
  { id: 'bold-graffiti', name: 'Bold Graffiti', desc: 'Street art inspired, vibrant colors, dynamic lettering', emoji: '🎨', preview: 'from-pink-600 via-purple-600 to-cyan-500' },
  { id: 'clean-corporate', name: 'Clean Corporate', desc: 'Professional, minimal, strong brand identity', emoji: '💼', preview: 'from-blue-700 via-blue-600 to-slate-500' },
  { id: 'neon-cyber', name: 'Neon Cyber', desc: 'Dark background, glowing neon accents, futuristic', emoji: '⚡', preview: 'from-black via-purple-900 to-cyan-900' },
  { id: 'retro-route66', name: 'Retro Route 66', desc: 'Vintage Americana, warm tones, classic signage feel', emoji: '🛣️', preview: 'from-amber-700 via-red-700 to-orange-600' },
  { id: 'flames-chrome', name: 'Flames & Chrome', desc: 'Classic hot rod flames, metallic chrome accents', emoji: '🔥', preview: 'from-red-700 via-orange-600 to-yellow-500' },
  { id: 'camo-tactical', name: 'Camo & Tactical', desc: 'Military camo patterns, rugged outdoor aesthetic', emoji: '🌿', preview: 'from-green-800 via-green-700 to-stone-600' },
  { id: 'carbon-fiber', name: 'Carbon Fiber', desc: 'Sleek carbon texture, racing-inspired, monochrome', emoji: '🏎️', preview: 'from-zinc-900 via-zinc-700 to-zinc-600' },
  { id: 'full-color-photo', name: 'Full Color Photo', desc: 'Photo-realistic imagery, maximum visual impact', emoji: '📸', preview: 'from-violet-600 via-pink-500 to-orange-500' }
];

const COLOR_PALETTES = [
  { id: 'c2c-brand', name: 'C2C Brand Colors', colors: ['#ec4899', '#8b5cf6', '#06b6d4'] },
  { id: 'black-gold', name: 'Black & Gold', colors: ['#1a1a1a', '#d4af37', '#ffffff'] },
  { id: 'red-black', name: 'Red & Black', colors: ['#dc2626', '#1a1a1a', '#ffffff'] },
  { id: 'blue-silver', name: 'Blue & Silver', colors: ['#1d4ed8', '#94a3b8', '#ffffff'] },
  { id: 'green-black', name: 'Green & Black', colors: ['#16a34a', '#1a1a1a', '#ffffff'] },
  { id: 'orange-black', name: 'Orange & Black', colors: ['#ea580c', '#1a1a1a', '#ffffff'] },
  { id: 'purple-chrome', name: 'Purple & Chrome', colors: ['#7c3aed', '#c0c0c0', '#ffffff'] },
  { id: 'custom', name: 'Custom Colors', colors: [] }
];

export default function WrapDesigner() {
  const [step, setStep] = useState(1);

  // Step 1: Vehicle
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMake, setSelectedMake] = useState('Ford');
  const [selectedModel, setSelectedModel] = useState('F-150');

  // Step 2: Brand Info
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Design Style
  const [selectedStyle, setSelectedStyle] = useState(DESIGN_STYLES[0]);
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [customPrompt, setCustomPrompt] = useState('');

  // Step 4: Generation
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generateMutation = trpc.wrap.generateDesign.useMutation({
    onSuccess: (data: { imageUrl: string; prompt: string }) => {
      setGeneratedImage(data.imageUrl ?? null);
      setIsGenerating(false);
      toast.success('Your wrap design has been generated! 🎨');
    },
    onError: (err: { message: string }) => {
      setIsGenerating(false);
      setGenerationError(err.message);
      toast.error('Generation failed. Please try again.');
    }
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogoFile(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleExtraUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setExtraImages(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setStep(4);

    const prompt = buildPrompt();

    try {
      await generateMutation.mutateAsync({
        prompt,
        vehicleInfo: `${selectedYear} ${selectedMake} ${selectedModel}`,
        style: selectedStyle.id,
        businessName,
        phone,
        website,
        tagline,
        logoDataUrl: logoFile || undefined
      });
    } catch (e) {
      // handled by onError
    }
  };

  const buildPrompt = () => {
    const parts = [
      `Professional vehicle wrap design for a ${selectedYear} ${selectedMake} ${selectedModel}.`,
      `Design style: ${selectedStyle.name} — ${selectedStyle.desc}.`,
      businessName ? `Business name prominently displayed: "${businessName}".` : '',
      tagline ? `Tagline: "${tagline}".` : '',
      phone ? `Phone number: ${phone}.` : '',
      website ? `Website: ${website}.` : '',
      `Color palette: ${selectedPalette.name}.`,
      `The design should be high-resolution, production-ready, photorealistic vehicle wrap mockup showing the full vehicle with the wrap applied.`,
      `Show the vehicle from a 3/4 front angle with dramatic studio lighting. Ultra-detailed, 8K resolution, professional automotive photography style.`,
      customPrompt ? `Additional requirements: ${customPrompt}.` : ''
    ].filter(Boolean);

    return parts.join(' ');
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `${selectedMake}-${selectedModel}-wrap-design.png`;
    a.click();
    toast.success('High-resolution design saved!');
  };

  const steps = [
    { num: 1, label: 'Vehicle', icon: Car },
    { num: 2, label: 'Brand Info', icon: Building2 },
    { num: 3, label: 'Design Style', icon: Palette },
    { num: 4, label: 'Generate', icon: Wand2 }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center">
            <img src="/manus-storage/c2c_logo_d01c1ec7.webp" alt="All-Pro Coast 2 Coast" className="h-10 w-auto object-contain" />
          </a>
          <div className="text-center hidden sm:block">
            <h1 className="font-black text-sm bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Wrap Design Generator
            </h1>
            <p className="text-[10px] text-muted-foreground">Select vehicle · Add your brand · Generate your wrap</p>
          </div>
          <a href="/store">
            <Button variant="outline" className="border-white/10 rounded-xl text-xs font-bold">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Store
            </Button>
          </a>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                    isDone ? 'bg-emerald-500 text-white' :
                    isActive ? 'bg-pink-600 text-white' :
                    'bg-white/10 text-muted-foreground'
                  }`}>
                    {isDone ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full ${step > s.num ? 'bg-emerald-500' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pb-16">

        {/* ===== STEP 1: VEHICLE SELECTION ===== */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-foreground">Select Your Vehicle</h2>
              <p className="text-sm text-muted-foreground">Choose the year, make, and model you want to design a wrap for.</p>
            </div>

            <Card className="bg-card/40 border-white/5 rounded-2xl p-6 space-y-5">
              {/* Year */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Year</Label>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-3 text-sm text-foreground focus:outline-none focus:border-pink-500">
                  {YEARS.map(y => <option key={y} value={y} className="bg-card">{y}</option>)}
                </select>
              </div>

              {/* Make */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Make / Brand</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {Object.keys(VEHICLE_MAKES).map(make => (
                    <button
                      key={make}
                      onClick={() => { setSelectedMake(make); setSelectedModel(VEHICLE_MAKES[make][0]); }}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${
                        selectedMake === make
                          ? 'bg-pink-600 border-pink-600 text-white'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:border-pink-500/40 hover:text-foreground'
                      }`}
                    >
                      {make}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Model</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {VEHICLE_MAKES[selectedMake].map(model => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                        selectedModel === model
                          ? 'bg-cyan-600 border-cyan-600 text-white'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:border-cyan-500/40 hover:text-foreground'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-cyan-500/5 border border-pink-500/20 flex items-center gap-3">
                <Car className="h-5 w-5 text-pink-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-foreground">{selectedYear} {selectedMake} {selectedModel}</p>
                  <p className="text-xs text-muted-foreground">Selected for wrap design generation</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold px-8 py-5">
                Next: Brand Info <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: BRAND INFO ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">{selectedYear} {selectedMake} {selectedModel}</Badge>
              <h2 className="text-2xl font-black text-foreground">Your Brand Information</h2>
              <p className="text-sm text-muted-foreground">Add your business details and logo. The AI will incorporate them into your wrap design.</p>
            </div>

            <Card className="bg-card/40 border-white/5 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Business Name</Label>
                  <Input value={businessName} onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g., All-Pro Coast 2 Coast LLC" className="bg-black/40 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Tagline / Slogan</Label>
                  <Input value={tagline} onChange={e => setTagline(e.target.value)}
                    placeholder="e.g., We Wrap. We Print. We Deliver." className="bg-black/40 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="(918) 555-0199" className="bg-black/40 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Website</Label>
                  <Input value={website} onChange={e => setWebsite(e.target.value)}
                    placeholder="www.yourwebsite.com" className="bg-black/40 border-white/10 rounded-xl" />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Upload Your Logo (optional but recommended)</Label>
                {logoFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <img src={logoFile} alt="Logo" className="h-14 w-14 rounded-lg object-contain border border-white/10 bg-white/5" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">Logo uploaded ✓</p>
                      <p className="text-[10px] text-muted-foreground">The AI will incorporate your logo into the design</p>
                    </div>
                    <button onClick={() => setLogoFile(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-pink-500/40 transition-all">
                    <UploadCloud className="h-7 w-7 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs font-bold text-foreground">Upload Logo / Brand Mark</p>
                    <p className="text-[10px] text-muted-foreground">PNG with transparent background works best</p>
                  </div>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>

              {/* Extra Reference Images */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Reference Images (optional)</Label>
                <p className="text-[11px] text-muted-foreground">Upload inspiration photos, existing brand materials, or reference wraps you like.</p>
                <div className="flex flex-wrap gap-2">
                  {extraImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="h-16 w-16 rounded-lg object-cover border border-white/10" />
                      <button onClick={() => setExtraImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => extraInputRef.current?.click()}
                    className="h-16 w-16 rounded-lg border-2 border-dashed border-white/10 hover:border-pink-500/40 flex items-center justify-center text-muted-foreground hover:text-pink-400 transition-all">
                    <UploadCloud className="h-5 w-5" />
                  </button>
                </div>
                <input ref={extraInputRef} type="file" accept="image/*" multiple onChange={handleExtraUpload} className="hidden" />
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="border-white/10 rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold px-8 py-5">
                Next: Design Style <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: DESIGN STYLE ===== */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">{selectedYear} {selectedMake} {selectedModel}</Badge>
              <h2 className="text-2xl font-black text-foreground">Choose Your Design Style</h2>
              <p className="text-sm text-muted-foreground">Select the visual direction for your wrap. Our AI will generate a professional, production-ready design.</p>
            </div>

            {/* Style Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DESIGN_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                    selectedStyle.id === style.id
                      ? 'border-pink-500/50 bg-pink-500/10'
                      : 'border-white/5 bg-card/40 hover:border-pink-500/20'
                  }`}
                >
                  <div className={`h-16 w-full rounded-xl bg-gradient-to-br ${style.preview} mb-3`} />
                  <span className="text-xl block mb-1">{style.emoji}</span>
                  <h3 className="font-bold text-xs text-foreground">{style.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{style.desc}</p>
                </button>
              ))}
            </div>

            {/* Color Palette */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Color Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COLOR_PALETTES.map(palette => (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPalette.id === palette.id
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-white/5 bg-white/5 hover:border-cyan-500/20'
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {palette.colors.length > 0 ? palette.colors.map((c, i) => (
                        <div key={i} className="h-5 flex-1 rounded-md border border-white/10" style={{ backgroundColor: c }} />
                      )) : (
                        <div className="h-5 flex-1 rounded-md border border-dashed border-white/20 flex items-center justify-center">
                          <span className="text-[9px] text-muted-foreground">Custom</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-foreground">{palette.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Custom Prompt */}
            <Card className="bg-card/40 border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Additional Design Instructions (optional)</h3>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Describe any specific elements you want: e.g., 'Add a large eagle on the hood', 'Include Route 66 shield graphics', 'Make it look like flames are coming from the wheels'..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-foreground focus:outline-none focus:border-pink-500 transition-colors"
              />
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="border-white/10 rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold px-8 py-5 shadow-xl shadow-pink-500/20"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate My Wrap Design
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: GENERATION RESULT ===== */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20">{selectedYear} {selectedMake} {selectedModel} · {selectedStyle.name}</Badge>
              <h2 className="text-2xl font-black text-foreground">
                {isGenerating ? 'Generating Your Wrap Design...' : generatedImage ? 'Your Wrap Design is Ready!' : 'Generation Failed'}
              </h2>
              {isGenerating && (
                <p className="text-sm text-muted-foreground">Our AI is creating a professional, production-ready wrap mockup. This takes about 15–30 seconds.</p>
              )}
            </div>

            {/* Loading State */}
            {isGenerating && (
              <Card className="bg-card/40 border-white/5 rounded-2xl p-16 text-center space-y-6">
                <div className="relative h-24 w-24 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-1 rounded-full bg-card flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-pink-400 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-foreground">AI is designing your wrap...</p>
                  <div className="space-y-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
                    {[
                      '✓ Analyzing vehicle dimensions',
                      '✓ Applying design style',
                      '✓ Incorporating brand elements',
                      '⟳ Rendering high-resolution mockup'
                    ].map((step, i) => (
                      <p key={i} className={i === 3 ? 'text-pink-400 font-semibold animate-pulse' : 'text-muted-foreground'}>{step}</p>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Generated Image */}
            {generatedImage && !isGenerating && (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-pink-500/10">
                  <img src={generatedImage} alt="Generated Wrap Design" className="w-full h-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold py-5 col-span-2"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download High-Resolution Design
                  </Button>
                  <Button
                    onClick={() => { setGeneratedImage(null); setStep(3); }}
                    variant="outline"
                    className="border-white/10 rounded-xl font-bold py-5"
                  >
                    Regenerate
                  </Button>
                </div>

                <Card className="bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border-cyan-500/20 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Ready to Print?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This is a high-resolution AI-generated concept. Our design team at All-Pro Coast 2 Coast will refine it into a production-ready vector file before printing. Book a consultation to get started!
                  </p>
                  <div className="flex gap-3">
                    <a href="/book" className="flex-1">
                      <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold">
                        Book a Consultation
                      </Button>
                    </a>
                    <a href="/store" className="flex-1">
                      <Button variant="outline" className="w-full border-white/10 rounded-xl text-xs font-bold">
                        Get a Quote
                      </Button>
                    </a>
                  </div>
                </Card>
              </div>
            )}

            {/* Error State */}
            {generationError && !isGenerating && !generatedImage && (
              <Card className="bg-red-950/20 border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                <p className="text-sm font-bold text-red-400">Generation failed. Please try again.</p>
                <p className="text-xs text-muted-foreground">{generationError}</p>
                <Button onClick={() => setStep(3)} className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl">
                  Try Again
                </Button>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
