import config from '../config/environment';
import logger from '../services/logger';

// Service worker registration and management
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isUpdateAvailable = false;
    this.callbacks = {
      updateAvailable: [],
      updateReady: [],
      offline: [],
      online: []
    };
  }

  // Register service worker
  async register() {
    if (!config.FEATURES.SERVICE_WORKER || !('serviceWorker' in navigator)) {
      logger.info('Service Worker: Not supported or disabled');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      
      logger.info('Service Worker: Registered successfully', {
        scope: this.registration.scope
      });

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Check for updates
      if (this.registration.waiting) {
        this.handleUpdateReady();
      }

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Set up message handling
      navigator.serviceWorker.addEventListener('message', event => {
        this.handleMessage(event);
      });

      return true;
    } catch (error) {
      logger.error('Service Worker: Registration failed', {
        error: error.message
      });
      return false;
    }
  }

  // Handle service worker updates
  handleUpdateFound() {
    const newWorker = this.registration.installing;
    
    if (!newWorker) return;

    logger.info('Service Worker: Update found');

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New version available
          this.isUpdateAvailable = true;
          this.notifyUpdateAvailable();
        } else {
          // First installation
          logger.info('Service Worker: First installation complete');
        }
      }
    });
  }

  // Handle update ready
  handleUpdateReady() {
    this.isUpdateAvailable = true;
    this.notifyUpdateReady();
  }

  // Handle messages from service worker
  handleMessage(event) {
    const { data } = event;
    
    if (data && data.type === 'CACHE_UPDATED') {
      logger.info('Service Worker: Cache updated', data);
    }
  }

  // Apply update
  applyUpdate() {
    if (!this.registration || !this.registration.waiting) {
      return;
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Clear cache
  async clearCache() {
    if (!this.registration) return false;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };
      
      this.registration.active.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  // Update cache
  async updateCache() {
    if (!this.registration) return false;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };
      
      this.registration.active.postMessage(
        { type: 'UPDATE_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  // Event listeners
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  // Notify update available
  notifyUpdateAvailable() {
    this.callbacks.updateAvailable.forEach(callback => {
      try {
        callback();
      } catch (error) {
        logger.error('Service Worker: Update available callback failed', {
          error: error.message
        });
      }
    });
  }

  // Notify update ready
  notifyUpdateReady() {
    this.callbacks.updateReady.forEach(callback => {
      try {
        callback();
      } catch (error) {
        logger.error('Service Worker: Update ready callback failed', {
          error: error.message
        });
      }
    });
  }

  // Check online status
  checkOnlineStatus() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      
      if (isOnline) {
        this.callbacks.online.forEach(callback => callback());
        logger.info('Service Worker: Online');
      } else {
        this.callbacks.offline.forEach(callback => callback());
        logger.info('Service Worker: Offline');
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();
  }

  // Unregister service worker
  async unregister() {
    if (!this.registration) return false;

    try {
      await this.registration.unregister();
      logger.info('Service Worker: Unregistered successfully');
      return true;
    } catch (error) {
      logger.error('Service Worker: Unregistration failed', {
        error: error.message
      });
      return false;
    }
  }
}

// Create singleton instance
const serviceWorkerManager = new ServiceWorkerManager();

// Auto-register if enabled
if (config.FEATURES.SERVICE_WORKER) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      serviceWorkerManager.register();
      serviceWorkerManager.checkOnlineStatus();
    });
  } else {
    serviceWorkerManager.register();
    serviceWorkerManager.checkOnlineStatus();
  }
}

export default serviceWorkerManager;