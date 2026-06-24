import { useState } from 'react';
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
  Grid3x3
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

  const designMutation = trpc.design.generateDesign.useMutation();
  const stylesList = Object.keys(DESIGN_STYLES);

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

            {/* Right: Preview */}
            <div className="space-y-6">
              {generatedDesigns ? (
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden h-96 bg-black">
                      <img src={currentDesignImage} alt="Generated Design" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold text-cyan-400">
                        {selectedStyle}
                      </div>
                    </div>

                    {/* Variation Selector */}
                    {generatedDesigns.variations.length > 0 && (
                      <div className="p-4 border-t border-white/10 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground">Variations ({generatedDesigns.variations.length + 1})</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          <button
                            onClick={() => setSelectedVariation(-1)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                              selectedVariation === -1 ? 'border-cyan-500' : 'border-white/20'
                            }`}
                          >
                            <img src={generatedDesigns.main} alt="Main" className="w-full h-full object-cover" />
                          </button>
                          {generatedDesigns.variations.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedVariation(i)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                                selectedVariation === i ? 'border-cyan-500' : 'border-white/20'
                              }`}
                            >
                              <img src={img} alt={`Variation ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="p-4 space-y-3 border-t border-white/10">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Template Name</label>
                        <Input
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="e.g., Neon Blue Fleet Wrap"
                          className="bg-white/10 border-white/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveTemplate}
                          className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Template
                        </Button>
                        <Button
                          onClick={() => handleDownloadTemplate(currentDesignImage || '', templateName || 'design', 'png')}
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => {
                            setGeneratedDesigns(null);
                            setDesignPrompt('');
                          }}
                          variant="outline"
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/5 border-white/10 border-2 border-dashed h-96 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <Grid3x3 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Describe your design and click "Generate with AI" to create professional mockups
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          // Gallery Tab
          <div className="space-y-6">
            {savedTemplates.length === 0 ? (
              <Card className="bg-white/5 border-white/10 py-12 text-center">
                <p className="text-muted-foreground">No templates yet. Create your first design! 🎨</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTemplates.map(template => (
                  <Card key={template.id} className="bg-white/5 border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all group">
                    <div className="relative overflow-hidden h-48">
                      <img src={template.mainDesign} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold text-cyan-400">
                        {template.style}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-sm">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">{template.category}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {template.createdBy}</span>
                        <button
                          onClick={() => handleLikeTemplate(template.id)}
                          className={`flex items-center gap-1 transition-colors ${template.isLiked ? 'text-pink-400' : 'hover:text-pink-400'}`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${template.isLiked ? 'fill-current' : ''}`} />
                          {template.likes}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDownloadTemplate(template.mainDesign, template.name)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 text-xs"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button
                          onClick={() => setSelectedTemplate(template)}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 text-xs"
                        >
                          <Share2 className="h-3 w-3" />
                          Share
                        </Button>
                        <Button
                          onClick={() => handleDeleteTemplate(template.id)}
                          variant="outline"
                          size="sm"
                          className="gap-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
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

      {/* Share Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border-white/10 max-w-md w-full">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Share Template</h2>
              <p className="text-sm text-muted-foreground">Share "{selectedTemplate.name}" with your team</p>
              <div className="flex gap-2">
                <Input
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="team@example.com"
                  className="bg-white/10 border-white/20"
                />
                <Button
                  onClick={() => handleShareTemplate(selectedTemplate)}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Share
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Shared with:</p>
                {selectedTemplate.sharedWith.length > 0 ? (
                  selectedTemplate.sharedWith.map(email => (
                    <div key={email} className="text-xs bg-white/5 px-2 py-1 rounded">
                      {email}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">Not shared yet</p>
                )}
              </div>
              <Button
                onClick={() => setSelectedTemplate(null)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
