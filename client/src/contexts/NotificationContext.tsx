import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType =
  | 'booking'
  | 'payment'
  | 'proof'
  | 'inventory'
  | 'job_update'
  | 'new_lead'
  | 'reminder'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string; // optional tab to navigate to
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'proof',
    title: 'Proof Awaiting Approval',
    message: "Cain's Ballroom window graphic proof has been pending for 2 days. Follow up needed.",
    timestamp: '2026-06-07 09:15',
    read: false,
    link: 'portal'
  },
  {
    id: 'notif_2',
    type: 'payment',
    title: 'Invoice Overdue',
    message: 'INV-2026-001 for Green Pro LLC ($4,177.25) is past due. Send a payment reminder.',
    timestamp: '2026-06-07 08:00',
    read: false,
    link: 'estimator'
  },
  {
    id: 'notif_3',
    type: 'inventory',
    title: 'Low Vinyl Stock Alert',
    message: '3M 2080 Gloss Deep Orange is below threshold — only 30 sq.ft remaining. Reorder soon.',
    timestamp: '2026-06-06 17:30',
    read: false,
    link: 'inventory'
  },
  {
    id: 'notif_4',
    type: 'new_lead',
    title: 'New Lead Captured',
    message: 'Marcus Williams called about a 3-truck fleet wrap. Logged in Comms & Growth Hub.',
    timestamp: '2026-06-06 14:00',
    read: true,
    link: 'comms'
  },
  {
    id: 'notif_5',
    type: 'job_update',
    title: 'Job Stage Advanced',
    message: 'Ford Transit Wrap moved to Installation stage by Mike (Installer).',
    timestamp: '2026-06-06 11:45',
    read: true,
    link: 'pipeline'
  }
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, markRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
