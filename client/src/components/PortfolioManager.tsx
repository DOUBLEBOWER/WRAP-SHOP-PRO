import React, { useState as useStateImport, useRef } from 'react';
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
  EyeOff,
  Loader2
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
  const { items, addItem, removeItem, toggleFeatured, updateItem, isLoading } = usePortfolio();
  const [isUploading, setIsUploading] = useStateImport(false);

  const [isDragging, setIsDragging] = useStateImport(false);
  const [editingId, setEditingId] = useStateImport<string | null>(null);
  const [editTitle, setEditTitle] = useStateImport('');
  const [editCategory, setEditCategory] = useStateImport('');
  const [filterCategory, setFilterCategory] = useStateImport('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New upload form state
  const [pendingFiles, setPendingFiles] = useStateImport<{ file: File; preview: string }[]>([]);
  const [newTitle, setNewTitle] = useStateImport('');
  const [newCategory, setNewCategory] = useStateImport('Vehicle Wrap');

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

  const handleUploadPending = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const pf of pendingFiles) {
        // Convert base64 to blob
        const response = await fetch(pf.preview);
        const blob = await response.blob();
        
        // Create FormData and upload via fetch
        const formData = new FormData();
        formData.append('file', blob, pf.file.name);
        
        // Upload to storage endpoint
        const uploadRes = await fetch('/api/portfolio/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadRes.ok) {
          throw new Error('Failed to upload image');
        }
        
        const { imageUrl, imageKey } = await uploadRes.json();
        
        // Add to portfolio with S3 URL
        await addItem({
          title: newTitle || pf.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          category: newCategory,
          imageUrl: imageUrl,
          imageKey: imageKey,
          featured: false
        });
      }

      toast.success(`${pendingFiles.length} photo${pendingFiles.length > 1 ? 's' : ''} added to your portfolio!`);
      setPendingFiles([]);
      setNewTitle('');
      setNewCategory('Vehicle Wrap');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateItem(id, { title: editTitle, category: editCategory });
      setEditingId(null);
      toast.success('Portfolio item updated!');
    } catch (error) {
      toast.error('Failed to update item.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await removeItem(id);
      toast.success(`"${title}" removed from portfolio.`);
    } catch (error) {
      toast.error('Failed to delete item.');
    }
  };

  const filteredItems = filterCategory === 'All'
    ? items
    : items.filter(i => i.category === filterCategory);

  const realItems = items.filter(i => !i.id.startsWith('placeholder_'));
  const placeholderItems = items.filter(i => i.id.startsWith('placeholder_'));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 text-pink-400 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

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
        <Card className="bg-white/5 border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Photos</p>
            <p className="text-2xl font-bold text-pink-400">{realItems.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Featured</p>
            <p className="text-2xl font-bold text-amber-400">{items.filter(i => i.featured).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Categories</p>
            <p className="text-2xl font-bold text-cyan-400">{new Set(realItems.map(i => i.category)).size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Upload New Photos</CardTitle>
          <CardDescription>Drag & drop images or click to browse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-pink-400 bg-pink-500/10'
                : 'border-white/10 hover:border-white/20 bg-white/2'
            }`}
          >
            <UploadCloud className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">Drop images here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 10MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Pending Files Preview */}
          {pendingFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Ready to upload ({pendingFiles.length})</h4>
              <div className="grid grid-cols-4 gap-3">
                {pendingFiles.map((pf, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={pf.preview}
                      alt="preview"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemovePending(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Title (Optional)</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Blue Fleet Wrap"
                className="bg-white/5 border-white/10 mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground mt-1"
              >
                {PORTFOLIO_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleUploadPending}
                disabled={pendingFiles.length === 0 || isUploading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Upload {pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          onClick={() => setFilterCategory('All')}
          variant={filterCategory === 'All' ? 'default' : 'outline'}
          size="sm"
          className="whitespace-nowrap"
        >
          All ({items.length})
        </Button>
        {PORTFOLIO_CATEGORIES.map(cat => {
          const count = items.filter(i => i.category === cat).length;
          return count > 0 ? (
            <Button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              variant={filterCategory === cat ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
            >
              {cat} ({count})
            </Button>
          ) : null;
        })}
      </div>

      {/* Portfolio Grid */}
      <div className="space-y-6">
        {/* Real Items */}
        {realItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-pink-400 mb-4">Your Photos ({realItems.length})</h3>
            {filteredItems.filter(i => !i.id.startsWith('placeholder_')).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No photos in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.filter(i => !i.id.startsWith('placeholder_')).map(item => (
                  <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                    {/* Photo */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.imageUrl}
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
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                        title="Edit"
                      >
                        <PenLine className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                        title={item.featured ? 'Unfeature' : 'Feature'}
                      >
                        {item.featured ? (
                          <StarOff className="h-4 w-4" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Info (visible when not editing) */}
                    {editingId !== item.id && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="font-bold text-[11px] text-foreground truncate">{item.title}</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <Badge className="bg-white/5 border-white/5 text-muted-foreground text-[9px] py-0 px-1.5">
                            {item.category}
                          </Badge>
                          {item.uploadedAt && (
                            <span className="text-[9px] text-muted-foreground font-mono">{item.uploadedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Edit Mode */}
                    {editingId === item.id && (
                      <div className="absolute inset-0 bg-black/90 p-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-foreground"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-foreground"
                          >
                            {PORTFOLIO_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="flex-1 p-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-400 text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 p-1 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <X className="h-3 w-3" /> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Placeholder Items */}
        {placeholderItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Sample Photos (Delete anytime)</h3>
            {filteredItems.filter(i => i.id.startsWith('placeholder_')).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No sample photos in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.filter(i => i.id.startsWith('placeholder_')).map(item => (
                  <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-black/20 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-black/60 text-muted-foreground border-white/10 text-[9px] px-1.5 py-0.5">
                      Sample
                    </Badge>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
