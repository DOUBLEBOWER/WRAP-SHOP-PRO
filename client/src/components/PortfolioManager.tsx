import React, { useState, useRef } from 'react';
import { usePortfolio, PortfolioItem } from '../contexts/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  UploadCloud,
  Trash2,
  Star,
  StarOff,
  PenLine,
  Check,
  X,
  Image as ImageIcon,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

const PORTFOLIO_CATEGORIES = [
  'Vehicle Wrap',
  'Storefront',
  'Custom Apparel',
  'Hydro Dipping',
  'Custom Stickers',
  'Window Tinting',
  'Decals & Signs',
  'Detailing',
  'Photo Prints',
  'Other'
];

export default function PortfolioManager() {
  const { items, addItem, removeItem, toggleFeatured, updateItem } = usePortfolio();

  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New upload form state
  const [pendingFiles, setPendingFiles] = useState<{ file: File; preview: string }[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Vehicle Wrap');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    processFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    processFiles(files);
    if (e.target) e.target.value = '';
  };

  const processFiles = (files: File[]) => {
    if (files.length === 0) {
      toast.error('Please select image files only (JPG, PNG, WEBP).');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = ev.target?.result as string;
        setPendingFiles(prev => [...prev, { file, preview }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadPending = () => {
    if (pendingFiles.length === 0) return;

    pendingFiles.forEach((pf, idx) => {
      const item: PortfolioItem = {
        id: `portfolio_${Date.now()}_${idx}`,
        title: newTitle || pf.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: newCategory,
        img: pf.preview,
        fileName: pf.file.name,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        featured: false
      };
      addItem(item);
    });

    toast.success(`${pendingFiles.length} photo${pendingFiles.length > 1 ? 's' : ''} added to your portfolio!`);
    setPendingFiles([]);
    setNewTitle('');
    setNewCategory('Vehicle Wrap');
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
  };

  const handleSaveEdit = (id: string) => {
    updateItem(id, { title: editTitle, category: editCategory });
    setEditingId(null);
    toast.success('Portfolio item updated!');
  };

  const handleDelete = (id: string, title: string) => {
    removeItem(id);
    toast.success(`"${title}" removed from portfolio.`);
  };

  const filteredItems = filterCategory === 'All'
    ? items
    : items.filter(i => i.category === filterCategory);

  const realItems = items.filter(i => i.fileName !== 'placeholder');
  const placeholderItems = items.filter(i => i.fileName === 'placeholder');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Portfolio Manager
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload your real job photos here. They will instantly appear in the public portfolio gallery on your website.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/40 border-white/5 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-pink-400 font-mono">{realItems.length}</span>
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold mt-0.5">Real Photos</span>
        </Card>
        <Card className="bg-card/40 border-white/5 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-amber-400 font-mono">{items.filter(i => i.featured).length}</span>
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold mt-0.5">Featured</span>
        </Card>
        <Card className="bg-card/40 border-white/5 rounded-2xl p-4 text-center">
          <span className="text-2xl font-black text-muted-foreground font-mono">{placeholderItems.length}</span>
          <span className="text-[10px] text-muted-foreground block uppercase font-semibold mt-0.5">Placeholders</span>
        </Card>
      </div>

      {/* Upload Area */}
      <Card className="bg-card/40 border-white/5 rounded-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-sm font-semibold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
            <UploadCloud className="h-4 w-4" /> Upload New Photos
          </CardTitle>
          <CardDescription className="text-xs">
            Drag and drop photos or click to browse. Supports JPG, PNG, WEBP. Multiple files at once are supported.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-pink-500 bg-pink-500/5 scale-[1.01]'
                : 'border-white/10 bg-black/10 hover:border-pink-500/40 hover:bg-black/20'
            }`}
          >
            <UploadCloud className={`h-10 w-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-pink-400' : 'text-muted-foreground/40'}`} />
            <p className="font-bold text-sm text-foreground">
              {isDragging ? 'Drop your photos here!' : 'Drag & Drop Photos Here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse your computer</p>
            <p className="text-[10px] text-muted-foreground/60 mt-2">JPG · PNG · WEBP · Multiple files OK</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Pending Files Preview */}
          {pendingFiles.length > 0 && (
            <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {pendingFiles.length} Photo{pendingFiles.length > 1 ? 's' : ''} Ready to Upload
              </h4>

              {/* Thumbnails */}
              <div className="flex flex-wrap gap-3">
                {pendingFiles.map((pf, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={pf.preview}
                      alt={pf.file.name}
                      className="h-20 w-20 object-cover rounded-xl border border-white/10"
                    />
                    <button
                      onClick={() => handleRemovePending(idx)}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <p className="text-[9px] text-muted-foreground text-center mt-1 max-w-[80px] truncate">{pf.file.name}</p>
                  </div>
                ))}
              </div>

              {/* Title & Category for batch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Photo Title (optional)</Label>
                  <Input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Ford F-150 Full Wrap"
                    className="bg-black/40 border-white/10 rounded-xl h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-pink-500"
                  >
                    {PORTFOLIO_CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-card">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={handleUploadPending}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold py-5"
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Add {pendingFiles.length} Photo{pendingFiles.length > 1 ? 's' : ''} to Portfolio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Grid with Filters */}
      <Card className="bg-card/40 border-white/5 rounded-2xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold tracking-wider uppercase text-pink-400 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Portfolio Gallery ({filteredItems.length} items)
              </CardTitle>
              <CardDescription className="text-xs">
                Click ⭐ to feature a photo in the hero section. Click 🗑️ to remove. Click ✏️ to rename.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', ...PORTFOLIO_CATEGORIES.slice(0, 5)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    filterCategory === cat
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:border-pink-500/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-2xl">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No photos in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                  {/* Photo */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.featured && (
                      <Badge className="bg-amber-500/80 text-white border-0 text-[9px] font-bold px-1.5 py-0.5">
                        ⭐ Featured
                      </Badge>
                    )}
                    {item.fileName === 'placeholder' && (
                      <Badge className="bg-black/60 text-muted-foreground border-white/10 text-[9px] px-1.5 py-0.5">
                        Sample
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons (hover overlay) */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors shadow-md ${
                        item.featured ? 'bg-amber-500 text-white' : 'bg-black/70 text-muted-foreground hover:text-amber-400'
                      }`}
                      title={item.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {item.featured ? <Star className="h-3.5 w-3.5" /> : <StarOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="h-7 w-7 rounded-lg bg-black/70 text-muted-foreground hover:text-cyan-400 flex items-center justify-center transition-colors shadow-md"
                      title="Edit title & category"
                    >
                      <PenLine className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="h-7 w-7 rounded-lg bg-black/70 text-muted-foreground hover:text-red-400 flex items-center justify-center transition-colors shadow-md"
                      title="Remove from portfolio"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Info Footer */}
                  {editingId === item.id ? (
                    <div className="p-2 space-y-1.5 bg-black/90">
                      <Input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="bg-white/10 border-white/10 rounded-lg h-7 text-[11px]"
                        autoFocus
                      />
                      <select
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-foreground focus:outline-none"
                      >
                        {PORTFOLIO_CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="bg-card">{cat}</option>
                        ))}
                      </select>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(item.id)}
                          className="flex-1 h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                        >
                          <Check className="h-3 w-3 mr-1" /> Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="flex-1 h-6 text-[10px] border-white/10 rounded-lg"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-black/60">
                      <p className="font-bold text-[11px] text-foreground truncate">{item.title}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <Badge className="bg-white/5 border-white/5 text-muted-foreground text-[9px] py-0 px-1.5">
                          {item.category}
                        </Badge>
                        {item.uploadedAt && (
                          <span className="text-[9px] text-muted-foreground font-mono">{item.uploadedAt}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tip Box */}
      <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-xs text-muted-foreground space-y-1">
        <p className="font-bold text-cyan-400">💡 Portfolio Tips:</p>
        <p>• <strong className="text-foreground">Star (⭐) your best photos</strong> — Featured photos appear first in the public gallery.</p>
        <p>• <strong className="text-foreground">Delete sample photos</strong> — Once you've uploaded real work, remove the placeholder samples.</p>
        <p>• <strong className="text-foreground">Use clear titles</strong> — e.g., "2023 Ford F-150 Full Wrap" helps customers find your work.</p>
        <p>• <strong className="text-foreground">Upload high-resolution photos</strong> — At least 1200px wide for best quality on the website.</p>
      </div>
    </div>
  );
}
