import config from '../config/environment';
import logger from '../services/logger';

// Memory cache for frequently accessed data
class MemoryCache {
  constructor(maxSize = 100, ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.accessOrder = new Map(); // Track access order for LRU
  }

  set(key, value, customTtl = null) {
    const ttl = customTtl || this.ttl;
    const expiresAt = Date.now() + ttl;
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.accessOrder.keys().next().value;
      this.delete(oldestKey);
    }
    
    this.cache.set(key, { value, expiresAt });
    this.accessOrder.set(key, Date.now());
    
    logger.debug('MemoryCache: Set', { key, ttl });
  }

  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug('MemoryCache: Miss', { key });
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      logger.debug('MemoryCache: Expired', { key });
      return null;
    }
    
    // Update access order
    this.accessOrder.set(key, Date.now());
    logger.debug('MemoryCache: Hit', { key });
    
    return entry.value;
  }

  delete(key) {
    this.cache.delete(key);
    this.accessOrder.delete(key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder.clear();
    logger.info('MemoryCache: Cleared');
  }

  size() {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.delete(key));
    
    if (expiredKeys.length > 0) {
      logger.debug('MemoryCache: Cleaned up expired entries', { count: expiredKeys.length });
    }
  }
}

// Browser storage cache with compression
class StorageCache {
  constructor(storage = localStorage, keyPrefix = 'tc_') {
    this.storage = storage;
    this.keyPrefix = keyPrefix;
  }

  set(key, value, ttl = config.PERFORMANCE.CACHE_DURATION) {
    try {
      const data = {
        value,
        expiresAt: ttl > 0 ? Date.now() + ttl : null,
        compressed: false
      };

      let serialized = JSON.stringify(data);
      
      // Compress large data
      if (serialized.length > 1024 && window.CompressionStream) {
        try {
          data.compressed = true;
          data.value = this.compress(JSON.stringify(value));
          serialized = JSON.stringify(data);
        } catch (error) {
          logger.warn('StorageCache: Compression failed', { key, error: error.message });
          data.compressed = false;
          data.value = value;
          serialized = JSON.stringify(data);
        }
      }

      this.storage.setItem(this.keyPrefix + key, serialized);
      logger.debug('StorageCache: Set', { key, size: serialized.length, compressed: data.compressed });
      
      return true;
    } catch (error) {
      logger.error('StorageCache: Set failed', { key, error: error.message });
      return false;
    }
  }

  get(key) {
    try {
      const serialized = this.storage.getItem(this.keyPrefix + key);
      
      if (!serialized) {
        logger.debug('StorageCache: Miss', { key });
        return null;
      }

      const data = JSON.parse(serialized);
      
      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.delete(key);
        logger.debug('StorageCache: Expired', { key });
        return null;
      }

      let value = data.value;
      
      // Decompress if needed
      if (data.compressed) {
        try {
          value = JSON.parse(this.decompress(data.value));
        } catch (error) {
          logger.error('StorageCache: Decompression failed', { key, error: error.message });
          this.delete(key);
          return null;
        }
      }

      logger.debug('StorageCache: Hit', { key, compressed: data.compressed });
      return value;
    } catch (error) {
      logger.error('StorageCache: Get failed', { key, error: error.message });
      return null;
    }
  }

  delete(key) {
    this.storage.removeItem(this.keyPrefix + key);
  }

  clear() {
    const keys = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.keyPrefix)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => this.storage.removeItem(key));
    logger.info('StorageCache: Cleared', { count: keys.length });
  }

  // Simple compression using base64 (fallback)
  compress(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  decompress(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  // Get cache statistics
  getStats() {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.keyPrefix)) {
        itemCount++;
        totalSize += this.storage.getItem(key).length;
      }
    }
    
    return { itemCount, totalSize };
  }
}

// Image cache for lazy loading
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.loading = new Set();
  }

  async get(src) {
    // Return cached image if available
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    // Return existing promise if already loading
    if (this.loading.has(src)) {
      return this.loading.get(src);
    }

    // Create loading promise
    const loadPromise = this.loadImage(src);
    this.loading.set(src, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(src, result);
      return result;
    } finally {
      this.loading.delete(src);
    }
  }

  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          loaded: true
        });
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }

  preload(sources) {
    return Promise.allSettled(
      sources.map(src => this.get(src))
    );
  }

  clear() {
    this.cache.clear();
    this.loading.clear();
  }
}

// Create cache instances
export const memoryCache = new MemoryCache();
export const localCache = new StorageCache(localStorage);
export const sessionCache = new StorageCache(sessionStorage, 'tcs_');
export const imageCache = new ImageCache();

// Cache cleanup interval
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup();
  }, 60000); // Cleanup every minute
}

// Cache utilities
export const cacheUtils = {
  // Generate cache key with parameters
  generateKey: (base, params = {}) => {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return paramString ? `${base}?${paramString}` : base;
  },

  // Cache with async function
  withCache: async (key, fn, cache = memoryCache, ttl = null) => {
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const result = await fn();
      cache.set(key, result, ttl);
      return result;
    } catch (error) {
      logger.error('Cache: Function execution failed', { key, error: error.message });
      throw error;
    }
  },

  // Invalidate cache patterns
  invalidatePattern: (pattern, cache = memoryCache) => {
    if (cache instanceof MemoryCache) {
      const keysToDelete = [];
      for (const key of cache.cache.keys()) {
        if (pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => cache.delete(key));
      
      logger.info('Cache: Invalidated pattern', { pattern: pattern.source, count: keysToDelete.length });
    }
  },

  // Get all cache statistics
  getAllStats: () => {
    return {
      memory: {
        size: memoryCache.size(),
        maxSize: memoryCache.maxSize
      },
      localStorage: localCache.getStats(),
      sessionStorage: sessionCache.getStats(),
      images: {
        cached: imageCache.cache.size,
        loading: imageCache.loading.size
      }
    };
  }
};

// Initialize performance monitoring for cache
if (config.FEATURES.PERFORMANCE_MONITORING) {
  // Monitor cache hit rates
  const originalMemoryGet = memoryCache.get;
  memoryCache.get = function(key) {
    const start = performance.now();
    const result = originalMemoryGet.call(this, key);
    const duration = performance.now() - start;
    
    logger.performance('MemoryCache Get', duration, {
      key,
      hit: result !== null
    });
    
    return result;
  };
}