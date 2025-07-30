# ⚡ Performance Optimization Guide

## Overview

This guide provides comprehensive performance optimization strategies for the EV Routing Simulation Tool, ensuring fast, responsive, and efficient user experiences.

## 🎯 Performance Principles

### **Core Metrics**
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s

### **Optimization Goals**
- **Bundle Size**: Minimize JavaScript bundle size
- **Render Performance**: Optimize React rendering
- **Memory Usage**: Prevent memory leaks
- **Network Efficiency**: Reduce API calls and data transfer
- **Caching Strategy**: Implement effective caching

## 🧩 Component-Level Optimizations

### **React.memo Usage**

```jsx
// ✅ Good: Memoize expensive components
const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => heavyProcessing(item));
  }, [data]);

  return <div>{processedData}</div>;
});

// ✅ Good: Memoize callback functions
const ParentComponent = () => {
  const handleUpdate = useCallback((id) => {
    // Update logic
  }, []);

  return <ExpensiveComponent onUpdate={handleUpdate} />;
};
```

### **State Management Optimization**

```jsx
// ✅ Good: Use functional updates for complex state
const [items, setItems] = useState([]);

const addItem = useCallback((newItem) => {
  setItems(prev => [...prev, newItem]);
}, []);

const removeItem = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);

// ✅ Good: Batch state updates
const updateMultipleItems = useCallback((updates) => {
  setItems(prev => {
    const newItems = [...prev];
    updates.forEach(({ id, data }) => {
      const index = newItems.findIndex(item => item.id === id);
      if (index !== -1) {
        newItems[index] = { ...newItems[index], ...data };
      }
    });
    return newItems;
  });
}, []);
```

### **Event Handler Optimization**

```jsx
// ✅ Good: Debounce expensive operations
import { debounce } from 'lodash';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      performSearch(searchTerm);
    }, 300),
    []
  );

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return <input value={query} onChange={handleInputChange} />;
};

// ✅ Good: Throttle scroll events
const ScrollComponent = () => {
  const handleScroll = useCallback(
    throttle((e) => {
      // Handle scroll logic
    }, 16), // ~60fps
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};
```

## 🎨 Animation Performance

### **Hardware Acceleration**

```jsx
// ✅ Good: Use transform and opacity for animations
const AnimatedComponent = () => (
  <motion.div
    initial={{ opacity: 0, transform: 'translateY(20px)' }}
    animate={{ opacity: 1, transform: 'translateY(0)' }}
    transition={{ duration: 0.3 }}
    style={{
      // Force hardware acceleration
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
      transform: 'translateZ(0)',
    }}
  >
    Content
  </motion.div>
);

// ❌ Avoid: Animating layout properties
const BadAnimatedComponent = () => (
  <motion.div
    animate={{ width: '100%', height: '200px' }} // Causes layout thrashing
  >
    Content
  </motion.div>
);
```

### **Animation Optimization**

```jsx
// ✅ Good: Use CSS transforms for simple animations
const OptimizedAnimation = styled.div`
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// ✅ Good: Batch animations
const BatchAnimation = () => {
  const controls = useAnimation();
  
  const startAnimation = useCallback(async () => {
    await controls.start({
      opacity: [0, 1],
      y: [20, 0],
      transition: { duration: 0.3 }
    });
  }, [controls]);

  return (
    <motion.div animate={controls}>
      Content
    </motion.div>
  );
};
```

## 📦 Bundle Optimization

### **Code Splitting**

```jsx
// ✅ Good: Lazy load components
const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
);

// ✅ Good: Dynamic imports for routes
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./Dashboard')),
  },
  {
    path: '/settings',
    component: lazy(() => import('./Settings')),
  },
];
```

### **Tree Shaking**

```jsx
// ✅ Good: Named exports for tree shaking
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';

// ❌ Avoid: Default exports for utilities
// export default { Button, Card, Input };

// ✅ Good: Import only what you need
import { Button } from '../components/ui/Button';
import { debounce } from 'lodash-es'; // ES modules for tree shaking
```

### **Bundle Analysis**

```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Check for duplicate dependencies
npx npm-check-duplicates
```

## 🗄️ Memory Management

### **Cleanup Functions**

```jsx
// ✅ Good: Clean up subscriptions and timers
const DataComponent = () => {
  useEffect(() => {
    const subscription = dataService.subscribe(handleData);
    const timer = setInterval(updateData, 5000);
    
    return () => {
      subscription.unsubscribe();
      clearInterval(timer);
    };
  }, []);

  // ✅ Good: Clean up event listeners
  useEffect(() => {
    const handleResize = () => {
      // Handle resize
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
};

// ✅ Good: Clean up refs
const MapComponent = () => {
  const mapRef = useRef(null);
  
  useEffect(() => {
    mapRef.current = new Map();
    
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, []);
};
```

### **Memory Leak Prevention**

```jsx
// ✅ Good: Use AbortController for fetch requests
const DataFetcher = () => {
  useEffect(() => {
    const abortController = new AbortController();
    
    fetch('/api/data', { signal: abortController.signal })
      .then(response => response.json())
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      });
    
    return () => abortController.abort();
  }, []);

  // ✅ Good: Clear timeouts
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Do something
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);
};
```

## 🌐 Network Optimization

### **API Request Optimization**

```jsx
// ✅ Good: Implement request caching
const useCachedRequest = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const cache = useRef(new Map());
  
  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      if (cache.current.has(url)) {
        setData(cache.current.get(url));
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        // Cache the result
        cache.current.set(url, result);
        setData(result);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url, options]);
  
  return { data, loading };
};

// ✅ Good: Batch API requests
const useBatchRequests = (requests) => {
  const [results, setResults] = useState({});
  
  useEffect(() => {
    const fetchAll = async () => {
      const promises = requests.map(async ({ key, url }) => {
        const response = await fetch(url);
        return { key, data: await response.json() };
      });
      
      const results = await Promise.all(promises);
      const data = results.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});
      
      setResults(data);
    };
    
    fetchAll();
  }, [requests]);
  
  return results;
};
```

### **Image Optimization**

```jsx
// ✅ Good: Lazy load images
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={isInView ? src : ''}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      {...props}
    />
  );
};

// ✅ Good: Use responsive images
const ResponsiveImage = ({ src, sizes, ...props }) => (
  <img
    src={src}
    sizes={sizes}
    srcSet={`
      ${src}?w=300 300w,
      ${src}?w=600 600w,
      ${src}?w=900 900w
    `}
    loading="lazy"
    {...props}
  />
);
```

## 🔧 Development Tools

### **Performance Monitoring**

```jsx
// ✅ Good: Performance monitoring hook
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 16) { // Longer than one frame
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  });
};

// ✅ Good: Memory usage monitoring
const useMemoryMonitor = () => {
  useEffect(() => {
    if ('memory' in performance) {
      const interval = setInterval(() => {
        const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
        const usagePercent = (usedJSHeapSize / totalJSHeapSize) * 100;
        
        if (usagePercent > 80) {
          console.warn(`High memory usage: ${usagePercent.toFixed(1)}%`);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, []);
};
```

### **Development Optimizations**

```jsx
// ✅ Good: Conditional rendering in development
const DevTools = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="dev-tools">
      <PerformanceMonitor />
      <MemoryMonitor />
    </div>
  );
};

// ✅ Good: Debug logging
const debugLog = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};
```

## 📊 Performance Testing

### **Lighthouse Audits**

```bash
# Run Lighthouse audits
npx lighthouse https://your-app.com --output=json --output-path=./lighthouse-report.json

# Run Lighthouse CI
npm install -g @lhci/cli
lhci autorun
```

### **Bundle Analysis**

```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Check for duplicate dependencies
npx npm-check-duplicates

# Analyze dependencies
npx depcheck
```

### **Performance Testing Scripts**

```json
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "lighthouse": "npx lighthouse https://your-app.com --output=json",
    "performance": "npm run build && npm run lighthouse",
    "bundle-size": "npm run build && npx gzip-size build/static/js/*.js"
  }
}
```

## 🚀 Production Optimizations

### **Build Optimizations**

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log in production
          },
        },
      }),
    ],
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
```

### **Runtime Optimizations**

```jsx
// ✅ Good: Service Worker for caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// ✅ Good: Preload critical resources
const PreloadResources = () => (
  <>
    <link rel="preload" href="/critical.css" as="style" />
    <link rel="preload" href="/critical.js" as="script" />
    <link rel="dns-prefetch" href="//api.example.com" />
    <link rel="preconnect" href="//api.example.com" />
  </>
);
```

## 📈 Monitoring and Analytics

### **Performance Metrics**

```jsx
// ✅ Good: Track Core Web Vitals
const trackWebVitals = () => {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
};

// ✅ Good: Custom performance marks
const usePerformanceMarks = (componentName) => {
  useEffect(() => {
    performance.mark(`${componentName}-start`);
    
    return () => {
      performance.mark(`${componentName}-end`);
      performance.measure(
        `${componentName}-duration`,
        `${componentName}-start`,
        `${componentName}-end`
      );
    };
  });
};
```

## 🎯 Best Practices Summary

### **Do's**
- ✅ Use React.memo for expensive components
- ✅ Implement proper cleanup functions
- ✅ Lazy load non-critical components
- ✅ Optimize images and assets
- ✅ Use hardware-accelerated animations
- ✅ Implement effective caching strategies
- ✅ Monitor performance metrics
- ✅ Bundle splitting and tree shaking

### **Don'ts**
- ❌ Avoid unnecessary re-renders
- ❌ Don't create functions in render
- ❌ Avoid memory leaks
- ❌ Don't block the main thread
- ❌ Avoid large bundle sizes
- ❌ Don't ignore performance metrics
- ❌ Avoid synchronous operations in render

---

**🎯 Goal**: Implement these performance optimizations to ensure the application provides a fast, responsive, and efficient user experience across all devices and network conditions. 