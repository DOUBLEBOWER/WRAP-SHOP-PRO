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
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  createdBy: string;
  sharedWith: string[];
}

const TEMPLATE_CATEGORIES = [
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
  const [designPrompt, setDesignPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [shareEmail, setShareEmail] = useState('');

  // Mock AI generation (in production, this would call the tRPC mutation)
  const handleGenerateDesign = async () => {
    if (!designPrompt.trim()) {
      toast.error('Please describe your design concept');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, call: const { imageUrl } = await trpc.design.generateTemplate.useMutation()
      // For now, use a placeholder
      setGeneratedImage(`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80&t=${Date.now()}`);
      toast.success('Design generated! Review and save to your templates.');
    } catch (error) {
      toast.error('Failed to generate design. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !generatedImage) {
      toast.error('Please name your template and generate a design');
      return;
    }

    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: templateName,
      category: selectedCategory,
      description: designPrompt,
      imageUrl: generatedImage,
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
    setGeneratedImage(null);
    setUploadedImage(null);
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

  const handleDownloadTemplate = (imageUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name}-template.png`;
    link.click();
    toast.success('Template downloaded!');
  };

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
                Design Templates
              </h1>
              <p className="text-sm text-muted-foreground">Create, save, and share wrap designs with AI</p>
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
                    <label className="block text-sm font-semibold mb-3">Template Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-foreground focus:outline-none focus:border-cyan-500/50"
                    >
                      {TEMPLATE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Design Prompt */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Design Concept</label>
                    <textarea
                      value={designPrompt}
                      onChange={(e) => setDesignPrompt(e.target.value)}
                      placeholder="Describe your design idea... e.g., 'Bold neon blue and pink geometric patterns with our company logo and phone number'"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 resize-none h-32"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Reference Image (Optional)</label>
                    <div className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-all cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setUploadedImage(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {uploadedImage ? (
                        <div className="space-y-2">
                          <img src={uploadedImage} alt="Uploaded" className="h-20 w-20 mx-auto rounded-lg object-cover" />
                          <p className="text-xs text-cyan-400">Image uploaded ✓</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm font-semibold">Click to upload reference image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateDesign}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Generate Design with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview */}
            <div className="space-y-6">
              {generatedImage ? (
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <CardContent className="p-0">
                    <img src={generatedImage} alt="Generated Design" className="w-full h-96 object-cover" />
                    <div className="p-6 space-y-4">
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
                          onClick={() => handleDownloadTemplate(generatedImage, templateName || 'design')}
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => {
                            setGeneratedImage(null);
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
                    <Zap className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Describe your design and click "Generate" to see a preview
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
                      <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-semibold text-cyan-400">
                        {template.category}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-sm">{template.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
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
                          onClick={() => handleDownloadTemplate(template.imageUrl, template.name)}
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
