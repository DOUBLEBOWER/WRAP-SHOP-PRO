import React, { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string; // S3 URL or remote URL
  imageKey?: string; // S3 storage key for deletion
  featured: boolean;
  uploadedAt: Date;
}

interface PortfolioContextValue {
  items: PortfolioItem[];
  addItem: (item: Omit<PortfolioItem, 'id' | 'uploadedAt'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<PortfolioItem>) => Promise<void>;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

// Pre-load the landing page placeholder photos so the gallery isn't empty
// until the owner uploads real photos. Owner can delete these anytime.
const PLACEHOLDER_ITEMS: PortfolioItem[] = [
  {
    id: 'placeholder_1',
    title: 'Vehicle Wrap — Sample',
    category: 'Vehicle Wrap',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    featured: true,
    uploadedAt: new Date()
  },
  {
    id: 'placeholder_2',
    title: 'Storefront Graphics — Sample',
    category: 'Storefront',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    featured: true,
    uploadedAt: new Date()
  },
  {
    id: 'placeholder_3',
    title: 'Custom Apparel — Sample',
    category: 'Custom Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    featured: true,
    uploadedAt: new Date()
  },
  {
    id: 'placeholder_4',
    title: 'Hydro Dipping — Sample',
    category: 'Hydro Dipping',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    featured: false,
    uploadedAt: new Date()
  },
  {
    id: 'placeholder_5',
    title: 'Trailer Wrap — Sample',
    category: 'Vehicle Wrap',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    featured: false,
    uploadedAt: new Date()
  },
  {
    id: 'placeholder_6',
    title: 'Custom Stickers — Sample',
    category: 'Custom Stickers',
    imageUrl: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80',
    featured: false,
    uploadedAt: new Date()
  }
];

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load portfolio items from database
  const { data: dbItems = [], isLoading: dbLoading, refetch } = trpc.crm.portfolio.list.useQuery();
  const createMutation = trpc.crm.portfolio.create.useMutation();
  const updateMutation = trpc.crm.portfolio.update.useMutation();
  const deleteMutation = trpc.crm.portfolio.delete.useMutation();

  // Initialize items from database or placeholders
  useEffect(() => {
    if (!dbLoading) {
      const dbPortfolioItems = (dbItems as any[]).map(item => ({
        ...item,
        uploadedAt: new Date(item.uploadedAt)
      }));
      
      // If no items in database, use placeholders
      if (dbPortfolioItems.length === 0) {
        setItems(PLACEHOLDER_ITEMS);
      } else {
        setItems(dbPortfolioItems);
      }
      setIsLoading(false);
    }
  }, [dbItems, dbLoading]);

  const addItem = async (item: Omit<PortfolioItem, 'id' | 'uploadedAt'>) => {
    const id = `portfolio_${Date.now()}`;
    try {
      await createMutation.mutateAsync({
        id,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        imageKey: item.imageKey,
        featured: item.featured
      });
      // Refetch to get the new item with proper timestamps
      await refetch();
    } catch (error) {
      console.error('Failed to add portfolio item:', error);
      throw error;
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
      // Refetch to update the list
      await refetch();
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
      throw error;
    }
  };

  const toggleFeatured = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    try {
      await updateMutation.mutateAsync({
        id,
        featured: !item.featured
      });
      // Refetch to get updated item
      await refetch();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    try {
      await updateMutation.mutateAsync({
        id,
        title: updates.title,
        category: updates.category,
        featured: updates.featured
      });
      // Refetch to get updated item
      await refetch();
    } catch (error) {
      console.error('Failed to update portfolio item:', error);
      throw error;
    }
  };

  return (
    <PortfolioContext.Provider value={{ items, addItem, removeItem, toggleFeatured, updateItem, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
