import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, AppNotification, NotificationType } from '../contexts/NotificationContext';
import { Bell, X, CheckCheck, Trash2, Package, CreditCard, Eye, AlertTriangle, UserPlus, Wrench, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationBellProps {
  onNavigate: (tab: string) => void;
}

const TYPE_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string }> = {
  booking:    { icon: <Calendar className="h-3.5 w-3.5" />,    color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20' },
  payment:    { icon: <CreditCard className="h-3.5 w-3.5" />,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  proof:      { icon: <Eye className="h-3.5 w-3.5" />,         color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
  inventory:  { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  job_update: { icon: <Wrench className="h-3.5 w-3.5" />,      color: 'text-pink-400',    bg: 'bg-pink-500/10 border-pink-500/20' },
  new_lead:   { icon: <UserPlus className="h-3.5 w-3.5" />,    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  reminder:   { icon: <Bell className="h-3.5 w-3.5" />,        color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  system:     { icon: <Zap className="h-3.5 w-3.5" />,         color: 'text-foreground',  bg: 'bg-white/5 border-white/10' }
};

function timeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp.replace(' ', 'T'));
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

export default function NotificationBell({ onNavigate }: NotificationBellProps) {
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotificationClick = (notif: AppNotification) => {
    markRead(notif.id);
    if (notif.link) {
      onNavigate(notif.link);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all"
      >
        <Bell className={`h-4 w-4 ${unreadCount > 0 ? 'text-pink-400' : 'text-muted-foreground'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-pink-500 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-pink-500/30 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-11 w-96 max-h-[520px] flex flex-col bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-pink-400" />
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-[10px] font-bold">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Bell className="h-8 w-8 opacity-20 mb-2" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[11px] opacity-70">No new notifications right now.</p>
              </div>
            ) : (
              notifications.map(notif => {
                const config = TYPE_CONFIG[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left flex gap-3 px-4 py-3.5 border-b border-white/5 hover:bg-white/5 transition-colors relative ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                  >
                    {/* Unread dot */}
                    {!notif.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-pink-500" />
                    )}

                    {/* Icon */}
                    <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xs font-bold leading-tight ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">{timeAgo(notif.timestamp)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <span className={`text-[10px] font-semibold ${config.color}`}>
                          Tap to view →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
