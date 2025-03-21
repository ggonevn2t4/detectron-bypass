
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  expirationTime?: number; // milliseconds
}

type CacheKey = string;

// Create a simple in-memory cache for API responses
class RequestCache {
  private cache: Map<CacheKey, CacheItem<any>> = new Map();
  private readonly DEFAULT_EXPIRATION = 15 * 60 * 1000; // 15 minutes

  public get<T>(key: CacheKey): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    const now = Date.now();
    if (now - item.timestamp > this.DEFAULT_EXPIRATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  public set<T>(key: CacheKey, data: T, options?: CacheOptions): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public remove(key: CacheKey): void {
    this.cache.delete(key);
  }
}

// Singleton instance
const requestCache = new RequestCache();
export default requestCache;
