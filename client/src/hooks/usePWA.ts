import { useEffect, useState } from 'react';

export interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  deferredPrompt: any;
  isUpdating: boolean;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isOnline: navigator.onLine,
    isInstalled: false,
    canInstall: false,
    deferredPrompt: null,
    isUpdating: false
  });

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = async () => {
      if ('getInstalledRelatedApps' in navigator) {
        const installed = await (navigator as any).getInstalledRelatedApps();
        setState(prev => ({ ...prev, isInstalled: installed.length > 0 }));
      }
    };
    checkInstalled();

    // Listen for online/offline events
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        canInstall: true,
        deferredPrompt: e
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        deferredPrompt: null
      }));
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({ ...prev, isUpdating: false }));
        window.location.reload();
      });

      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdating: true }));
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!state.deferredPrompt) return;

    state.deferredPrompt.prompt();
    const { outcome } = await state.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setState(prev => ({
        ...prev,
        canInstall: false,
        deferredPrompt: null
      }));
    }
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.update();
    }
  };

  return {
    ...state,
    installApp,
    checkForUpdates
  };
}
