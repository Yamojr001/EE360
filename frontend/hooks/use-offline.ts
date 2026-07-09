'use client';

import { useState, useEffect, useCallback } from 'react';
import { offlineDb } from '@/lib/offline-db';

export interface OfflineState {
  isOnline: boolean;
  isInitialized: boolean;
  pendingSyncItems: number;
}

/**
 * Hook for managing offline state and service worker
 */
export function useOffline(): OfflineState & {
  registerServiceWorker: () => Promise<void>;
  syncPendingChanges: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
} {
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pendingSyncItems, setPendingSyncItems] = useState(0);

  // Initialize offline database on mount
  useEffect(() => {
    const initOfflineSupport = async () => {
      try {
        // Check if browser supports IndexedDB
        if (!window.indexedDB) {
          console.warn('[Offline] IndexedDB not available');
          setIsInitialized(true);
          return;
        }

        // Initialize offline database
        await offlineDb.init();
        console.log('[Offline] Database initialized');

        // Update sync count
        const queue = await offlineDb.getSyncQueue();
        setPendingSyncItems(queue.length);

        setIsInitialized(true);
      } catch (error) {
        console.error('[Offline] Failed to initialize:', error);
        setIsInitialized(true);
      }
    };

    initOfflineSupport();
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Offline] Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Offline] Went offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Register service worker
   */
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('[ServiceWorker] Not supported in this browser');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[ServiceWorker] Registered successfully:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready, but not activated
              console.log('[ServiceWorker] Update available');
              // You can notify the user here
            }
          });
        }
      });
    } catch (error) {
      console.error('[ServiceWorker] Registration failed:', error);
    }
  }, []);

  /**
   * Sync pending changes with server
   */
  const syncPendingChanges = useCallback(async () => {
    if (!isOnline) {
      console.warn('[Sync] Cannot sync while offline');
      return;
    }

    try {
      const queue = await offlineDb.getSyncQueue();
      console.log('[Sync] Processing', queue.length, 'pending items');

      let syncedCount = 0;
      const maxRetries = 3;

      for (const item of queue) {
        if (item.retries >= maxRetries) {
          console.warn('[Sync] Max retries reached for:', item.id);
          continue;
        }

        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: { 'Content-Type': 'application/json' },
            body: item.body ? JSON.stringify(item.body) : undefined,
            credentials: 'include',
          });

          if (response.ok) {
            await offlineDb.removeSyncQueueItem(item.id);
            syncedCount++;
            console.log('[Sync] Synced:', item.id);
          } else {
            await offlineDb.incrementSyncQueueRetries(item.id);
            console.warn('[Sync] Failed to sync:', item.id, 'Status:', response.status);
          }
        } catch (error) {
          await offlineDb.incrementSyncQueueRetries(item.id);
          console.error('[Sync] Error syncing item:', item.id, error);
        }
      }

      // Update pending count
      const remainingQueue = await offlineDb.getSyncQueue();
      setPendingSyncItems(remainingQueue.length);

      console.log('[Sync] Completed. Synced:', syncedCount, 'Remaining:', remainingQueue.length);
    } catch (error) {
      console.error('[Sync] Error during sync:', error);
    }
  }, [isOnline]);

  /**
   * Clear all offline data
   */
  const clearOfflineData = useCallback(async () => {
    try {
      await offlineDb.clearCache();
      await offlineDb.clearSyncQueue();
      setPendingSyncItems(0);
      console.log('[Offline] Cleared all offline data');
    } catch (error) {
      console.error('[Offline] Failed to clear data:', error);
    }
  }, []);

  return {
    isOnline,
    isInitialized,
    pendingSyncItems,
    registerServiceWorker,
    syncPendingChanges,
    clearOfflineData,
  };
}
