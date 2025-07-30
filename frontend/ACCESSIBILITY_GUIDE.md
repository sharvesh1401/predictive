# ♿ Accessibility Guide

## Overview

This guide provides comprehensive accessibility standards and best practices for the EV Routing Simulation Tool, ensuring the application is usable by people with diverse abilities and assistive technologies.

## 🎯 Accessibility Principles

### **WCAG 2.1 AA Compliance**
- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: User interface components must be operable
- **Understandable**: Information and operation of user interface must be understandable
- **Robust**: Content must be robust enough to be interpreted by assistive technologies

### **Core Requirements**
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Descriptive text for images and non-text content

## 🧩 Component Accessibility

### **Button Component**

```jsx
// ✅ Good: Accessible button with proper ARIA attributes
<Button
  aria-label="Submit form"
  aria-describedby="submit-help"
  aria-pressed={isPressed}
  onClick={handleSubmit}
>
  Submit
</Button>

// ✅ Good: Icon button with descriptive label
<Button
  aria-label="Close dialog"
  icon={<XIcon />}
  onClick={handleClose}
/>

// ✅ Good: Loading state with proper announcements
<Button
  aria-busy={true}
  aria-live="polite"
  loading
>
  Processing...
</Button>
```

#### **Accessibility Features**
- **ARIA Attributes**: `aria-label`, `aria-describedby`, `aria-pressed`, `aria-busy`
- **Keyboard Support**: Enter and Space key activation
- **Focus Management**: Clear focus indicators
- **Screen Reader**: Proper announcements for state changes

### **Input Component**

```jsx
// ✅ Good: Input with proper labeling and validation
<Input
  id="email-input"
  type="email"
  label="Email Address"
  aria-describedby="email-error email-help"
  aria-invalid={hasError}
  aria-required={true}
  error={errorMessage}
  hint="We'll never share your email"
/>

// ✅ Good: Password input with toggle
<Input
  type="password"
  label="Password"
  aria-describedby="password-requirements"
  showPasswordToggle
  aria-label="Password field with show/hide toggle"
/>
```

#### **Accessibility Features**
- **Label Association**: Proper `htmlFor` and `id` pairing
- **Error Handling**: `aria-invalid` and error descriptions
- **Help Text**: `aria-describedby` for additional information
- **Required Fields**: `aria-required` and visual indicators

### **Slider Component**

```jsx
// ✅ Good: Accessible slider with proper ARIA attributes
<Slider
  min={0}
  max={100}
  value={50}
  aria-label="Volume level"
  aria-valuetext="50 percent"
  onChange={handleVolumeChange}
/>

// ✅ Good: Range slider with descriptive labels
<RangeSlider
  min={0}
  max={200}
  value={[25, 75]}
  aria-label="Price range"
  aria-valuetext="25 to 75 dollars"
  onChange={handlePriceChange}
/>
```

#### **Accessibility Features**
- **ARIA Slider Role**: Proper role and attributes
- **Keyboard Navigation**: Arrow keys, Home, End, Page Up/Down
- **Value Announcements**: `aria-valuetext` for custom descriptions
- **Multiple Thumbs**: Proper focus management for range sliders

### **Card Component**

```jsx
// ✅ Good: Accessible card with proper structure
<Card
  aria-labelledby="card-title"
  aria-describedby="card-description"
>
  <CardHeader>
    <CardTitle id="card-title">Card Title</CardTitle>
    <CardDescription id="card-description">
      Card description
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>

// ✅ Good: Interactive card with proper role
<Card
  role="button"
  tabIndex={0}
  aria-pressed={isSelected}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  <CardContent>
    <h3>Clickable Card</h3>
    <p>Press Enter or Space to select</p>
  </CardContent>
</Card>
```

#### **Accessibility Features**
- **Semantic Structure**: Proper heading hierarchy
- **Interactive Elements**: Role and keyboard support
- **State Management**: `aria-pressed` for toggle states
- **Focus Management**: Logical tab order

## 🎨 Visual Accessibility

### **Color Contrast**

```css
/* ✅ Good: High contrast colors */
:root {
  --text-primary: #0f172a;      /* Dark text on light background */
  --text-secondary: #334155;    /* Secondary text */
  --background-primary: #ffffff; /* Light background */
  --accent-primary: #7c3aed;    /* High contrast accent */
}

/* ✅ Good: Focus indicators */
.button:focus {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
}

/* ✅ Good: Error states with sufficient contrast */
.input--error {
  border-color: #dc2626;        /* Red with high contrast */
  color: #dc2626;
}
```

### **Focus Management**

```jsx
// ✅ Good: Custom focus management
const useFocusManagement = () => {
  const focusRef = useRef(null);
  
  const focusFirstElement = useCallback(() => {
    const firstFocusable = focusRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, []);
  
  const trapFocus = useCallback((event) => {
    const focusableElements = focusRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements?.length) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, []);
  
  return { focusRef, focusFirstElement, trapFocus };
};
```

### **Reduced Motion**

```jsx
// ✅ Good: Respect user motion preferences
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// ✅ Good: Conditional animations
const AnimatedComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? {} : { duration: 0.3 }}
    >
      Content
    </motion.div>
  );
};
```

## 🗣️ Screen Reader Support

### **ARIA Labels and Descriptions**

```jsx
// ✅ Good: Descriptive ARIA labels
<Button aria-label="Close notification dialog">
  <XIcon />
</Button>

<Input
  aria-label="Search for routes"
  aria-describedby="search-help"
  placeholder="Enter destination..."
/>

// ✅ Good: Dynamic ARIA labels
const [count, setCount] = useState(0);

<Button
  aria-label={`Add item (${count} items currently selected)`}
  onClick={handleAdd}
>
  Add Item
</Button>

// ✅ Good: Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {notification && <p>{notification}</p>}
</div>
```

### **Semantic HTML**

```jsx
// ✅ Good: Proper heading hierarchy
<Card>
  <CardHeader>
    <CardTitle as="h2">Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    <h3>Subsection</h3>
    <p>Content...</p>
  </CardContent>
</Card>

// ✅ Good: Landmark regions
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    {/* Navigation content */}
  </nav>
</header>

<main role="main">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
    {/* Section content */}
  </section>
</main>

<footer role="contentinfo">
  {/* Footer content */}
</footer>
```

### **Form Accessibility**

```jsx
// ✅ Good: Accessible form with proper structure
const AccessibleForm = () => {
  const [errors, setErrors] = useState({});
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Personal Information</legend>
        
        <Input
          id="name"
          label="Full Name"
          required
          aria-describedby="name-error"
          aria-invalid={!!errors.name}
          error={errors.name}
        />
        
        <Input
          id="email"
          type="email"
          label="Email Address"
          required
          aria-describedby="email-error email-help"
          aria-invalid={!!errors.email}
          error={errors.email}
          hint="We'll never share your email"
        />
      </fieldset>
      
      <Button type="submit" aria-describedby="submit-help">
        Submit Form
      </Button>
      
      <div id="submit-help" className="sr-only">
        Press Enter to submit the form
      </div>
    </form>
  );
};
```

## ⌨️ Keyboard Navigation

### **Custom Keyboard Handlers**

```jsx
// ✅ Good: Keyboard event handling
const useKeyboardNavigation = (onEnter, onEscape) => {
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onEnter?.(event);
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.(event);
        break;
      case 'Tab':
        // Handle tab navigation
        break;
    }
  }, [onEnter, onEscape]);
  
  return handleKeyDown;
};

// ✅ Good: Skip links for keyboard users
const SkipLink = () => (
  <a
    href="#main-content"
    className="skip-link"
    style={{
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: '#000',
      color: '#fff',
      padding: '8px',
      textDecoration: 'none',
      zIndex: 1000,
    }}
  >
    Skip to main content
  </a>
);
```

### **Focus Indicators**

```css
/* ✅ Good: Visible focus indicators */
*:focus {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
}

/* ✅ Good: Custom focus styles for specific components */
.button:focus {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
}

/* ✅ Good: Focus styles for different states */
.input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

/* ✅ Good: High contrast focus for dark mode */
[data-theme="dark"] *:focus {
  outline-color: #fbbf24;
}
```

## 🎭 Animation and Motion

### **Reduced Motion Support**

```jsx
// ✅ Good: Respect user motion preferences
const useMotionPreferences = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersReducedData, setPrefersReducedData] = useState(false);
  
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataQuery = window.matchMedia('(prefers-reduced-data: reduce)');
    
    setPrefersReducedMotion(motionQuery.matches);
    setPrefersReducedData(dataQuery.matches);
    
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    const handleDataChange = (e) => setPrefersReducedData(e.matches);
    
    motionQuery.addEventListener('change', handleMotionChange);
    dataQuery.addEventListener('change', handleDataChange);
    
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      dataQuery.removeEventListener('change', handleDataChange);
    };
  }, []);
  
  return { prefersReducedMotion, prefersReducedData };
};
```

### **Accessible Animations**

```jsx
// ✅ Good: Pause animations on user preference
const AccessibleAnimation = () => {
  const { prefersReducedMotion } = useMotionPreferences();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { 
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity }
      }}
      aria-label="Animated element"
    >
      Content
    </motion.div>
  );
};
```

## 🧪 Testing Accessibility

### **Automated Testing**

```jsx
// ✅ Good: Jest-axe integration
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard accessible', () => {
    render(<MyComponent />);
    const element = screen.getByRole('button');
    element.focus();
    expect(element).toHaveFocus();
  });
});
```

### **Manual Testing Checklist**

```markdown
## Keyboard Navigation
- [ ] All interactive elements are reachable via Tab
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible and clear
- [ ] Escape key closes modals and dropdowns
- [ ] Enter/Space activates buttons and links

## Screen Reader Testing
- [ ] All content is announced properly
- [ ] Form labels are associated correctly
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced
- [ ] Headings follow proper hierarchy

## Visual Accessibility
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is readable without color alone
- [ ] Focus indicators are visible
- [ ] Animations can be disabled
- [ ] Text can be resized up to 200%

## Mobile Accessibility
- [ ] Touch targets are at least 44x44px
- [ ] Gestures have keyboard alternatives
- [ ] Content is readable in portrait and landscape
- [ ] VoiceOver/TalkBack works properly
```

### **Accessibility Testing Tools**

```bash
# Install testing tools
npm install --save-dev jest-axe @testing-library/jest-dom

# Run accessibility tests
npm test -- --testPathPattern=accessibility

# Run Lighthouse accessibility audit
npx lighthouse https://your-app.com --only-categories=accessibility

# Run axe-core in browser console
axe.run()
```

## 📱 Mobile Accessibility

### **Touch Targets**

```css
/* ✅ Good: Minimum touch target size */
.button,
.input,
.select {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* ✅ Good: Spacing between touch targets */
.touch-targets {
  gap: 8px; /* Minimum spacing between interactive elements */
}
```

### **Gesture Alternatives**

```jsx
// ✅ Good: Provide keyboard alternatives for gestures
const SwipeableCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSwipe = useCallback((direction) => {
    if (direction === 'up') {
      setIsExpanded(true);
    }
  }, []);
  
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsExpanded(true);
    }
  }, []);
  
  return (
    <div
      onSwipe={handleSwipe}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isExpanded}
      aria-label="Expandable card, press up arrow to expand"
    >
      {/* Card content */}
    </div>
  );
};
```

## 🎯 Best Practices Summary

### **Do's**
- ✅ Use semantic HTML elements
- ✅ Provide proper ARIA attributes
- ✅ Ensure keyboard navigation
- ✅ Maintain color contrast ratios
- ✅ Test with screen readers
- ✅ Respect motion preferences
- ✅ Provide alternative text
- ✅ Use proper heading hierarchy

### **Don'ts**
- ❌ Don't rely on color alone for information
- ❌ Don't create custom focus indicators without proper styling
- ❌ Don't use generic ARIA roles when semantic elements exist
- ❌ Don't ignore keyboard-only users
- ❌ Don't create inaccessible animations
- ❌ Don't use images of text
- ❌ Don't create mouse-only interactions

## 🔧 Development Tools

### **Accessibility Extensions**
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in accessibility auditing
- **Color Contrast Analyzer**: Check color contrast ratios

### **Screen Reader Testing**
- **NVDA** (Windows): Free screen reader
- **JAWS** (Windows): Professional screen reader
- **VoiceOver** (macOS): Built-in screen reader
- **TalkBack** (Android): Built-in screen reader

---

**🎯 Goal**: Ensure the application is accessible to all users, regardless of their abilities or assistive technologies, while maintaining a high-quality user experience for everyone. 