import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { X, Download, Wifi, WifiOff } from 'lucide-react';

export function PWAInstallBanner() {
  const pwa = usePWA();
  const [showInstall, setShowInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (pwa.canInstall && !pwa.isInstalled) {
      setShowInstall(true);
    }
  }, [pwa.canInstall, pwa.isInstalled]);

  useEffect(() => {
    if (pwa.isUpdating) {
      setShowUpdate(true);
    }
  }, [pwa.isUpdating]);

  if (!showInstall && !showUpdate && pwa.isOnline) {
    return null;
  }

  // Offline banner
  if (!pwa.isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-amber-600 text-white px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-semibold">You're offline - using cached data</span>
        </div>
      </div>
    );
  }

  // Update banner
  if (showUpdate) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 animate-pulse" />
          <span className="text-sm font-semibold">New version available!</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => window.location.reload()}
            className="bg-white text-blue-600 hover:bg-blue-50 text-xs"
          >
            Reload
          </Button>
          <button onClick={() => setShowUpdate(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Install banner
  if (showInstall) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-pink-600 to-cyan-600 text-white px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="text-sm font-semibold">Install C2C CRM as an app</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              pwa.installApp();
              setShowInstall(false);
            }}
            className="bg-white text-pink-600 hover:bg-pink-50 text-xs"
          >
            Install
          </Button>
          <button onClick={() => setShowInstall(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
