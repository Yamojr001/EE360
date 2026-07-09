/**
 * IndexedDB Manager for Offline-First Support
 * Handles local data caching and sync queue management
 */

interface SyncQueueItem {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: any;
  timestamp: number;
  retries: number;
}

interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export class OfflineDatabase {
  private dbName = 'ExcellenceAcademy';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // Object store names
  private stores = {
    cache: 'cache',
    syncQueue: 'syncQueue',
    settings: 'settings',
  };

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineDB] Initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create cache store
        if (!db.objectStoreNames.contains(this.stores.cache)) {
          const cacheStore = db.createObjectStore(this.stores.cache, { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create sync queue store
        if (!db.objectStoreNames.contains(this.stores.syncQueue)) {
          const syncStore = db.createObjectStore(this.stores.syncQueue, { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Create settings store
        if (!db.objectStoreNames.contains(this.stores.settings)) {
          db.createObjectStore(this.stores.settings, { keyPath: 'key' });
        }

        console.log('[OfflineDB] Database schema created');
      };
    });
  }

  /**
   * Save data to cache
   */
  async setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.cache], 'readwrite');
      const store = transaction.objectStore(this.stores.cache);

      const entry: CacheEntry<T> = {
        key,
        value,
        timestamp: Date.now(),
        ttl,
      };

      const request = store.put(entry);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[OfflineDB] Cached:', key);
        resolve();
      };
    });
  }

  /**
   * Get data from cache
   */
  async getCache<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.cache], 'readonly');
      const store = transaction.objectStore(this.stores.cache);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as CacheEntry<T> | undefined;
        
        if (!entry) {
          resolve(null);
          return;
        }

        // Check if expired
        if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
          // Delete expired entry
          store.delete(key);
          resolve(null);
          return;
        }

        resolve(entry.value);
      };
    });
  }

  /**
   * Delete cache entry
   */
  async deleteCache(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.cache], 'readwrite');
      const store = transaction.objectStore(this.stores.cache);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[OfflineDB] Deleted cache:', key);
        resolve();
      };
    });
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.cache], 'readwrite');
      const store = transaction.objectStore(this.stores.cache);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[OfflineDB] Cleared all cache');
        resolve();
      };
    });
  }

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: any
  ): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);

      const item: SyncQueueItem = {
        id: `${method}-${url}-${Date.now()}`,
        method,
        url,
        body,
        timestamp: Date.now(),
        retries: 0,
      };

      const request = store.add(item);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[OfflineDB] Added to sync queue:', item.id);
        resolve();
      };
    });
  }

  /**
   * Get all sync queue items
   */
  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.syncQueue], 'readonly');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const items = request.result as SyncQueueItem[];
        console.log('[OfflineDB] Sync queue items:', items.length);
        resolve(items);
      };
    });
  }

  /**
   * Remove item from sync queue
   */
  async removeSyncQueueItem(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[OfflineDB] Removed from sync queue:', id);
        resolve();
      };
    });
  }

  /**
   * Update sync queue item retry count
   */
  async incrementSyncQueueRetries(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result as SyncQueueItem;
        if (item) {
          item.retries++;
          const updateRequest = store.put(item);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Clear sync queue
   */
  async clearSyncQueue(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.syncQueue], 'readwrite');
      const store = transaction.objectStore(this.stores.syncQueue);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[OfflineDB] Cleared sync queue');
        resolve();
      };
    });
  }

  /**
   * Save setting
   */
  async setSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.settings], 'readwrite');
      const store = transaction.objectStore(this.stores.settings);

      const request = store.put({ key, value });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get setting
   */
  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.settings], 'readonly');
      const store = transaction.objectStore(this.stores.settings);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result as { key: string; value: any } | undefined;
        resolve(entry?.value || null);
      };
    });
  }

  /**
   * Close database
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const offlineDb = new OfflineDatabase();
