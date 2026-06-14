import React, { createContext, useContext, useState, useCallback } from 'react';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  img: string; // base64 data URL or remote URL
  fileName: string;
  uploadedAt: string;
  featured: boolean;
}

interface PortfolioContextValue {
  items: PortfolioItem[];
  addItem: (item: PortfolioItem) => void;
  removeItem: (id: string) => void;
  toggleFeatured: (id: string) => void;
  updateItem: (id: string, updates: Partial<PortfolioItem>) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

// Pre-load the landing page placeholder photos so the gallery isn't empty
// until the owner uploads real photos. Owner can delete these anytime.
const PLACEHOLDER_ITEMS: PortfolioItem[] = [
  {
    id: 'placeholder_1',
    title: 'Vehicle Wrap — Sample',
    category: 'Vehicle Wrap',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    fileName: 'placeholder',
    uploadedAt: '',
    featured: true
  },
  {
    id: 'placeholder_2',
    title: 'Storefront Graphics — Sample',
    category: 'Storefront',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    fileName: 'placeholder',
    uploadedAt: '',
    featured: true
  },
  {
    id: 'placeholder_3',
    title: 'Custom Apparel — Sample',
    category: 'Custom Apparel',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    fileName: 'placeholder',
    uploadedAt: '',
    featured: true
  },
  {
    id: 'placeholder_4',
    title: 'Hydro Dipping — Sample',
    category: 'Hydro Dipping',
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    fileName: 'placeholder',
    uploadedAt: '',
    featured: false
  },
  {
    id: 'placeholder_5',
    title: 'Trailer Wrap — Sample',
    category: 'Vehicle Wrap',
    img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    fileName: 'placeholder',
    uploadedAt: '',
    featured: false
  },
  {
    id: 'placeholder_6',
    title: 'Custom Stickers — Sample',
    category: 'Custom Stickers',
    img: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80',
    fileName: 'placeholder',
    uploadedAt: '',
    featured: false
  }
];

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PortfolioItem[]>(PLACEHOLDER_ITEMS);

  const addItem = useCallback((item: PortfolioItem) => {
    setItems(prev => [item, ...prev]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, featured: !i.featured } : i));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<PortfolioItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  return (
    <PortfolioContext.Provider value={{ items, addItem, removeItem, toggleFeatured, updateItem }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
