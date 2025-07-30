// Performance optimization utilities

// Debounce function for expensive operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for frequent events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization helper
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Lazy loading helper
export const lazyLoad = (importFunc) => {
  return React.lazy(() => importFunc());
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual scrolling helper
export const createVirtualScroller = (items, itemHeight, containerHeight) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  return {
    getVisibleRange: (scrollTop) => {
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + visibleCount, items.length);
      return { start, end };
    },
    getVisibleItems: (scrollTop) => {
      const { start, end } = this.getVisibleRange(scrollTop);
      return items.slice(start, end).map((item, index) => ({
        ...item,
        index: start + index,
        style: {
          position: 'absolute',
          top: (start + index) * itemHeight,
          height: itemHeight,
        }
      }));
    },
    totalHeight
  };
};

// Image optimization
export const optimizeImage = (src, width, quality = 80) => {
  // Add image optimization parameters
  const url = new URL(src);
  url.searchParams.set('w', width);
  url.searchParams.set('q', quality);
  url.searchParams.set('auto', 'format');
  return url.toString();
};

// Bundle size optimization
export const preloadComponent = (importFunc) => {
  return () => {
    const Component = React.lazy(importFunc);
    return <Component />;
  };
};

// Memory management
export const cleanupMemory = () => {
  if (typeof window !== 'undefined' && window.gc) {
    window.gc();
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
};

// Async performance monitoring
export const measureAsyncPerformance = async (name, fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
}; 