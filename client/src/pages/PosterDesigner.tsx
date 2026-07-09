import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap,
  Download,
  Loader2,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  Settings,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface PosterTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  dpi: number;
  description: string;
}

const POSTER_SIZES: PosterTemplate[] = [
  { id: '11x17', name: '11" x 17" (Tabloid)', width: 11, height: 17, dpi: 300, description: 'Standard tabloid size' },
  { id: '18x24', name: '18" x 24" (Large)', width: 18, height: 24, dpi: 300, description: 'Large format poster' },
  { id: '24x36', name: '24" x 36" (Extra Large)', width: 24, height: 36, dpi: 300, description: 'Billboard-style poster' },
  { id: '27x40', name: '27" x 40" (Movie Poster)', width: 27, height: 40, dpi: 300, description: 'Movie poster size' },
  { id: '32x48', name: '32" x 48" (Jumbo)', width: 32, height: 48, dpi: 300, description: 'Jumbo format' },
  { id: 'custom', name: 'Custom Size', width: 0, height: 0, dpi: 300, description: 'Define your own dimensions' }
];

const POSTER_STYLES = {
  'Bold & Eye-Catching': 'Vibrant colors, large bold text, high contrast, attention-grabbing design',
  'Modern Minimalist': 'Clean layout, minimal text, sophisticated typography, elegant spacing',
  'Retro Vintage': 'Retro aesthetic, vintage colors, classic typography, nostalgic feel',
  'Neon Cyberpunk': 'Neon colors, glowing effects, futuristic design, high energy',
  'Graffiti Street Art': 'Street art style, bold graffiti lettering, urban vibe, artistic flair',
  'Professional Corporate': 'Corporate design, professional colors, clean typography, business-focused',
  'Artistic Abstract': 'Abstract art, creative composition, artistic elements, unique design',
  'Promotional Sale': 'Sale-focused design, discount emphasis, urgent call-to-action, promotional colors'
};

export default function PosterDesigner() {
  const [selectedSize, setSelectedSize] = useState<string>('24x36');
  const [selectedStyle, setSelectedStyle] = useState<string>('Bold & Eye-Catching');
  const [customWidth, setCustomWidth] = useState<number>(24);
  const [customHeight, setCustomHeight] = useState<number>(36);
  const [posterTitle, setPosterTitle] = useState<string>('');
  const [posterSubtitle, setPostSubtitle] = useState<string>('');
  const [posterDescription, setPosterDescription] = useState<string>('');
  const [mainMessage, setMainMessage] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<{ url: string; mimeType: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSize = selectedSize === 'custom' 
    ? { width: customWidth, height: customHeight, dpi: 300 }
    : POSTER_SIZES.find(s => s.id === selectedSize) || POSTER_SIZES[2];

  const handleAddReferenceImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/upload-reference-image', {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          
          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();
          
          setReferenceImages(prev => [...prev, {
            url: data.url,
            mimeType: file.type
          }]);
        } catch (uploadError) {
          toast.error(`Failed to upload ${file.name}`);
          console.error(uploadError);
        }
      }
      toast.success(`Added ${files.length} reference image(s)`);
    } catch (error) {
      toast.error('Failed to add reference images');
      console.error(error);
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePoster = async () => {
    if (!posterTitle.trim()) {
      toast.error('Please enter a poster title');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Create a super high-quality large-format poster design for printing at ${currentSize.width}" x ${currentSize.height}" at ${currentSize.dpi} DPI.

Style: ${selectedStyle}

Title: ${posterTitle}
${posterSubtitle ? `Subtitle: ${posterSubtitle}` : ''}
${mainMessage ? `Main Message: ${mainMessage}` : ''}
${callToAction ? `Call to Action: ${callToAction}` : ''}
${posterDescription ? `Description: ${posterDescription}` : ''}

Requirements:
- Ultra high resolution (${currentSize.dpi} DPI minimum)
- Professional print-ready quality
- Bold, eye-catching design
- Clear hierarchy and readability
- Suitable for large format printing
- Vibrant colors optimized for printing
- No watermarks or logos unless specified
- Full bleed design with proper margins

${referenceImages.length > 0 ? `Reference images provided for design inspiration.` : ''}`;

      // TODO: Call image generation API with poster specifications
      toast.success('Poster design generated! (Feature coming soon)');
    } catch (error) {
      toast.error('Failed to generate poster');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPoster = () => {
    if (!generatedImage) {
      toast.error('No poster to download');
      return;
    }
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `Coast2Coast-Poster-${currentSize.width}x${currentSize.height}-${Date.now()}.png`;
    link.click();
    toast.success('Poster downloaded!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Maximize2 className="h-8 w-8 text-cyan-400" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              THE COAST 2 COAST INSTANT POSTER DESIGNER 2.0
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Generate super high-quality posters optimized for large-format printing. Print-ready at 300 DPI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 space-y-6">
                {/* Poster Size Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Poster Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {POSTER_SIZES.map(size => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selectedSize === size.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <p className="font-semibold text-sm">{size.name}</p>
                        <p className="text-xs text-muted-foreground">{size.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Size (if selected) */}
                {selectedSize === 'custom' && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <div>
                      <label className="text-xs font-semibold block mb-2">Width (inches)</label>
                      <Input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="bg-white/10 border-white/20"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-2">Height (inches)</label>
                      <Input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="bg-white/10 border-white/20"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>
                )}

                {/* Poster Style */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Design Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-foreground focus:outline-none focus:border-cyan-500/50"
                  >
                    {Object.keys(POSTER_STYLES).map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>

                {/* Poster Content */}
                <div className="space-y-4 p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                  <label className="block text-sm font-semibold text-pink-300">Poster Content</label>
                  
                  <div>
                    <label className="text-xs font-semibold block mb-2">Main Title *</label>
                    <Input
                      value={posterTitle}
                      onChange={(e) => setPosterTitle(e.target.value)}
                      placeholder="e.g., SUMMER SALE 2024"
                      className="bg-white/10 border-white/20 font-bold text-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2">Subtitle</label>
                    <Input
                      value={posterSubtitle}
                      onChange={(e) => setPostSubtitle(e.target.value)}
                      placeholder="e.g., Up to 50% Off Everything"
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2">Main Message</label>
                    <textarea
                      value={mainMessage}
                      onChange={(e) => setMainMessage(e.target.value)}
                      placeholder="Your key message or description..."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 resize-none h-20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2">Call to Action</label>
                    <Input
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      placeholder="e.g., SHOP NOW • CALL TODAY • LEARN MORE"
                      className="bg-white/10 border-white/20 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-2">Additional Details</label>
                    <textarea
                      value={posterDescription}
                      onChange={(e) => setPosterDescription(e.target.value)}
                      placeholder="Phone number, website, address, or other details..."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 resize-none h-16"
                    />
                  </div>
                </div>

                {/* Reference Images */}
                <div className="space-y-3 p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                  <label className="block text-sm font-semibold text-cyan-300 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Reference Images (Optional)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Add photos, logos, or design references to inspire the poster design
                  </p>
                  
                  {referenceImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {referenceImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img.url}
                            alt={`reference-${idx}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveReferenceImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImages}
                    variant="outline"
                    className="w-full border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 gap-2"
                  >
                    {isUploadingImages ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding Images...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Reference Images
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleAddReferenceImages(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGeneratePoster}
                  disabled={isGenerating || !posterTitle.trim()}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white rounded-xl font-bold py-6 text-lg gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Poster...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Generate Poster (300 DPI)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview & Info */}
          <div className="space-y-6">
            {/* Size Info */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-cyan-400" />
                  Print Specifications
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-semibold">{currentSize.width}" × {currentSize.height}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span className="font-semibold">{currentSize.dpi} DPI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aspect Ratio:</span>
                    <span className="font-semibold">{(currentSize.width / currentSize.height).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-semibold">Print-Ready PNG</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Poster Preview */}
            {generatedImage && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Generated Poster</h3>
                  <img
                    src={generatedImage}
                    alt="Generated poster"
                    className="w-full rounded-lg mb-4 border border-white/10"
                  />
                  <Button
                    onClick={handleDownloadPoster}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Poster (300 DPI)
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 text-purple-300">Print Tips</h3>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li>✓ 300 DPI ensures crisp, professional quality</li>
                  <li>✓ All designs are print-ready with proper margins</li>
                  <li>✓ Compatible with all major print shops</li>
                  <li>✓ Use CMYK color profile for best results</li>
                  <li>✓ Download as PNG for maximum quality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
