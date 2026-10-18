const memoryCache = new Map();

export const cache = {
  get: (key) => memoryCache.get(key),
  set: (key, value) => memoryCache.set(key, value),
  has: (key) => memoryCache.has(key),
  delete: (key) => memoryCache.delete(key),
  clear: () => memoryCache.clear(),
};