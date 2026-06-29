import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap,
  Upload,
  Save,
  Share2,
  Download,
  Trash2,
  Copy,
  Eye,
  Plus,
  Loader2,
  RefreshCw,
  Heart,
  Settings,
  Grid3x3,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface Template {
  id: string;
  name: string;
  category: string;
  style: string;
  description: string;
  mainDesign: string;
  variations: string[];
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  createdBy: string;
  sharedWith: string[];
}

const DESIGN_STYLES = {
  'Modern Minimalist': 'Clean, modern design with minimal text, bold geometric shapes',
  'Neon Cyber': 'Vibrant neon colors, glowing effects, futuristic aesthetic',
  'Graffiti Street': 'Bold graffiti-style lettering, street art, urban vibe',
  'Corporate Professional': 'Clean corporate design, professional colors, elegant',
  'Retro Route 66': 'Vintage 1950s-60s aesthetic, warm colors, nostalgic',
  'Holographic': 'Iridescent colors, holographic effects, futuristic shimmer',
  'Metallic Chrome': 'Chrome and metallic effects, reflective surfaces, premium',
  'Watercolor Art': 'Soft watercolor blending, artistic brush strokes, organic'
};

const DESIGN_CATEGORIES = [
  'Vehicle Wrap',
  'Storefront',
  'Custom Apparel',
  'Hydro Dipping',
  'Window Tinting',
  'Custom Stickers',
  'Photo Prints'
];

export default function DesignTemplates() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  const [selectedCategory, setSelectedCategory] = useState('Vehicle Wrap');
  const [selectedStyle, setSelectedStyle] = useState('Modern Minimalist');
  const [designPrompt, setDesignPrompt] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [variations, setVariations] = useState(1);
  const [resolution, setResolution] = useState<'standard' | 'high' | 'ultra'>('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<{ main: string; variations: string[] } | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [referenceImages, setReferenceImages] = useState<{ url: string; mimeType: string }[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const designMutation = trpc.design.generateDesign.useMutation();
  const stylesList = Object.keys(DESIGN_STYLES);

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

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setReferenceImages(prev => [...prev, {
            url: result,
            mimeType: file.type
          }]);
        };
        reader.readAsDataURL(file);
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

  const handleGenerateDesign = async () => {
    if (!designPrompt.trim()) {
      toast.error('Please describe your design concept');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await designMutation.mutateAsync({
        category: selectedCategory,
        style: selectedStyle,
        prompt: designPrompt,
        companyName: companyName || undefined,
        phoneNumber: phoneNumber || undefined,
        website: website || undefined,
        referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
        variations,
        resolution
      });

      setGeneratedDesigns({
        main: result.mainDesign,
        variations: result.variations ? result.variations.filter(Boolean) : []
      });
      setSelectedVariation(0);
      toast.success('Design generated! 🎨');
    } catch (error) {
      toast.error('Failed to generate design. Try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !generatedDesigns) {
      toast.error('Please name your template and generate a design');
      return;
    }

    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: templateName,
      category: selectedCategory,
      style: selectedStyle,
      description: designPrompt,
      mainDesign: generatedDesigns.main,
      variations: generatedDesigns.variations,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      createdBy: 'You',
      sharedWith: []
    };

    setSavedTemplates([newTemplate, ...savedTemplates]);
    toast.success('Template saved! 🎉');
    
    // Reset form
    setTemplateName('');
    setDesignPrompt('');
    setGeneratedDesigns(null);
    setCompanyName('');
    setPhoneNumber('');
    setWebsite('');
    setReferenceImages([]);
  };

  const handleDeleteTemplate = (id: string) => {
    setSavedTemplates(savedTemplates.filter(t => t.id !== id));
    toast.success('Template deleted');
  };

  const handleLikeTemplate = (id: string) => {
    setSavedTemplates(savedTemplates.map(t => 
      t.id === id ? { ...t, isLiked: !t.isLiked, likes: t.isLiked ? t.likes - 1 : t.likes + 1 } : t
    ));
  };

  const handleShareTemplate = (template: Template) => {
    if (!shareEmail.trim()) {
      toast.error('Enter an email to share');
      return;
    }
    
    const updated = savedTemplates.map(t =>
      t.id === template.id ? { ...t, sharedWith: [...t.sharedWith, shareEmail] } : t
    );
    setSavedTemplates(updated);
    toast.success(`Template shared with ${shareEmail}`);
    setShareEmail('');
  };

  const handleDownloadTemplate = (imageUrl: string, name: string, format: 'png' | 'jpg' = 'png') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name}-${resolution}.${format}`;
    link.click();
    toast.success('Design downloaded!');
  };

  const currentDesignImage = selectedVariation >= 0 && generatedDesigns?.variations[selectedVariation] ? generatedDesigns.variations[selectedVariation] : generatedDesigns?.main;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                AI Design Studio
              </h1>
              <p className="text-sm text-muted-foreground">Professional wrap & apparel designs powered by AI</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'create'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Create New
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'gallery'
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              }`}
            >
              <Eye className="h-4 w-4 inline mr-2" />
              My Templates ({savedTemplates.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {activeTab === 'create' ? (
          // Create Tab
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Input Form */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 space-y-6">
                  {/* Category Select */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Design Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-foreground focus:outline-none focus:border-cyan-500/50"
                    >
                      {DESIGN_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Style Select */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Design Style</label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-foreground focus:outline-none focus:border-cyan-500/50"
                    >
                      {stylesList.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  {/* Design Prompt */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Design Concept</label>
                    <textarea
                      value={designPrompt}
                      onChange={(e) => setDesignPrompt(e.target.value)}
                      placeholder="Describe your design idea in detail... Include colors, elements, mood, and any specific requirements."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 resize-none h-24"
                    />
                  </div>

                  {/* Reference Images Section */}
                  <div className="space-y-3 p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                    <label className="block text-sm font-semibold text-cyan-300 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Reference Images (Optional)
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Add photos of vehicles, storefronts, logos, or any reference images to help AI generate better designs
                    </p>
                    
                    {/* Reference Images Preview */}
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

                    {/* Upload Button */}
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
                          <Upload className="h-4 w-4" />
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
                    
                    {referenceImages.length > 0 && (
                      <p className="text-xs text-cyan-300 font-semibold">
                        {referenceImages.length} image{referenceImages.length > 1 ? 's' : ''} added
                      </p>
                    )}
                  </div>

                  {/* Business Info */}
                  <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <label className="block text-xs font-semibold text-muted-foreground">Business Information (Optional)</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className="bg-white/10 border-white/20 text-xs"
                    />
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      className="bg-white/10 border-white/20 text-xs"
                    />
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Website"
                      className="bg-white/10 border-white/20 text-xs"
                    />
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <label className="block text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Settings className="h-3 w-3" />
                      Advanced Options
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Variations</label>
                        <select
                          value={variations}
                          onChange={(e) => setVariations(Number(e.target.value))}
                          className="w-full px-2 py-1 rounded text-xs bg-white/10 border border-white/20"
                        >
                          {[1, 2, 3, 4].map(n => (
                            <option key={n} value={n}>{n} Design{n > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Resolution</label>
                        <select
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value as any)}
                          className="w-full px-2 py-1 rounded text-xs bg-white/10 border border-white/20"
                        >
                          <option value="standard">Standard</option>
                          <option value="high">High</option>
                          <option value="ultra">Ultra 4K</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateDesign}
                    disabled={isGenerating || designMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg gap-2"
                  >
                    {isGenerating || designMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview & Actions */}
            <div className="space-y-6">
              {generatedDesigns ? (
                <>
                  {/* Design Preview */}
                  <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <div className="aspect-square bg-black/50 flex items-center justify-center">
                      {currentDesignImage ? (
                        <img
                          src={currentDesignImage}
                          alt="Generated Design"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Zap className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No design generated</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Variation Selector */}
                  {generatedDesigns.variations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Variations</p>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setSelectedVariation(-1)}
                          className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                            selectedVariation === -1
                              ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <img
                            src={generatedDesigns.main}
                            alt="Main"
                            className="w-full h-full object-cover"
                          />
                        </button>
                        {generatedDesigns.variations.map((variation, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariation(idx)}
                            className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                              selectedVariation === idx
                                ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <img
                              src={variation}
                              alt={`Variation ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleDownloadTemplate(currentDesignImage || '', templateName || 'design', 'png')}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        onClick={handleGenerateDesign}
                        disabled={isGenerating}
                        variant="outline"
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>

                    {/* Save Template */}
                    <div className="space-y-2">
                      <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name..."
                        className="bg-white/10 border-white/20"
                      />
                      <Button
                        onClick={handleSaveTemplate}
                        className="w-full bg-pink-600 hover:bg-pink-700 gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save as Template
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Card className="bg-white/5 border-white/10 p-8 text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">
                    Fill in the form and click "Generate with AI" to create your design
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          // Gallery Tab
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Templates</h2>
            {savedTemplates.length === 0 ? (
              <Card className="bg-white/5 border-white/10 p-12 text-center">
                <Grid3x3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No templates saved yet. Create one to get started!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTemplates.map(template => (
                  <Card key={template.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-white/20 transition-all">
                    <div className="aspect-square bg-black/50 overflow-hidden">
                      <img
                        src={template.mainDesign}
                        alt={template.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-sm">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">{template.category} • {template.style}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleLikeTemplate(template.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                        >
                          <Heart className={`h-3 w-3 ${template.isLiked ? 'fill-current text-red-500' : ''}`} />
                          {template.likes}
                        </Button>
                        <Button
                          onClick={() => handleDownloadTemplate(template.mainDesign, template.name)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
