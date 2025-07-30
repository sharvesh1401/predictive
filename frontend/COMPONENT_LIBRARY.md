# 🎨 Component Library Documentation

## Overview

This document provides comprehensive documentation for the EV Routing Simulation Tool's component library. All components are designed to be **reusable**, **accessible**, **performant**, and **thematically consistent**.

## 🎯 Design Principles

### **Reusability**
- **Composable**: Components can be combined and nested
- **Configurable**: Extensive prop options for customization
- **Consistent API**: Similar patterns across all components
- **Type Safe**: Full TypeScript support with PropTypes

### **Accessibility**
- **ARIA Compliant**: Proper ARIA attributes and roles
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Semantic HTML and descriptions
- **Focus Management**: Clear focus indicators and management

### **Performance**
- **Memoized**: React.memo for optimal re-rendering
- **Lazy Loading**: Components load only when needed
- **Optimized Animations**: Hardware-accelerated animations
- **Bundle Splitting**: Tree-shakeable exports

### **User Experience**
- **Responsive**: Mobile-first design approach
- **Smooth Animations**: Framer Motion integration
- **Loading States**: Proper loading and error states
- **Error Handling**: Graceful error boundaries

## 🧩 Core Components

### **Button Component**

A highly versatile button component with multiple variants, sizes, and states.

```jsx
import { Button, PrimaryButton, LoadingButton } from '../components/ui/Button';

// Basic usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// With loading state
<LoadingButton variant="outline" size="lg">
  Processing...
</LoadingButton>

// With icon
<Button variant="ghost" icon={<Icon />} iconPosition="left">
  With Icon
</Button>
```

#### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `disabled` | `boolean` | `false` | Disables the button |
| `fullWidth` | `boolean` | `false` | Makes button full width |
| `icon` | `ReactNode` | - | Icon to display |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `animate` | `boolean` | `true` | Enables animations |

#### **Accessibility Features**
- Proper ARIA attributes (`aria-disabled`, `aria-busy`)
- Keyboard navigation support
- Focus management
- Screen reader announcements

### **Card Component**

A flexible card component with headers, content, and footers.

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outline' \| 'ghost'` | `'default'` | Visual style variant |
| `hoverable` | `boolean` | `false` | Adds hover effects |
| `clickable` | `boolean` | `false` | Makes card clickable |
| `loading` | `boolean` | `false` | Shows loading overlay |
| `disabled` | `boolean` | `false` | Disables interactions |

#### **Sub-Components**
- `CardHeader`: Container for title and description
- `CardTitle`: Main heading (configurable element)
- `CardDescription`: Supporting text
- `CardContent`: Main content area
- `CardFooter`: Action area with border

### **Slider Component**

An accessible slider component with range support and keyboard navigation.

```jsx
import { Slider, RangeSlider } from '../components/ui/Slider';

// Single value slider
<Slider
  min={0}
  max={100}
  value={50}
  onChange={handleChange}
  label="Battery Level"
  showValue
/>

// Range slider
<RangeSlider
  min={0}
  max={200}
  value={[25, 75]}
  onChange={handleRangeChange}
  label="Price Range"
  showValue
/>
```

#### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `value` | `number \| number[]` | - | Current value(s) |
| `step` | `number` | `1` | Step increment |
| `range` | `boolean` | `false` | Enable range mode |
| `label` | `string` | - | Accessible label |
| `showValue` | `boolean` | `false` | Display current value |
| `disabled` | `boolean` | `false` | Disables the slider |

#### **Accessibility Features**
- ARIA slider role with proper attributes
- Keyboard navigation (arrows, home, end, page up/down)
- Screen reader announcements
- Focus management for multiple thumbs

### **Input Component**

A comprehensive input component with validation states and icons.

```jsx
import { Input, EmailInput, PasswordInput } from '../components/ui/Input';

// Basic text input
<Input
  type="text"
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  required
/>

// Password input with toggle
<PasswordInput
  label="Password"
  value={password}
  onChange={handlePasswordChange}
  error="Password is required"
/>

// Input with icon
<Input
  type="search"
  icon={<SearchIcon />}
  placeholder="Search..."
  value={searchTerm}
  onChange={handleSearch}
/>
```

#### **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Input type |
| `label` | `string` | - | Input label |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `success` | `string` | - | Success message |
| `icon` | `ReactNode` | - | Icon to display |
| `showPasswordToggle` | `boolean` | `false` | Show password toggle |
| `required` | `boolean` | `false` | Required field |
| `disabled` | `boolean` | `false` | Disables the input |

#### **Validation States**
- **Default**: Normal input styling
- **Error**: Red border and error message
- **Success**: Green border and success message
- **Disabled**: Grayed out and non-interactive

## 🎨 Design System

### **Colors**

```javascript
import { colors } from '../design-system';

// Primary colors (Purple)
colors.primary[50]   // Lightest
colors.primary[600]  // Default
colors.primary[900]  // Darkest

// Secondary colors (Blue)
colors.secondary[50]  // Lightest
colors.secondary[600] // Default
colors.secondary[900] // Darkest

// Semantic colors
colors.success[500]   // Green
colors.error[500]     // Red
colors.warning[500]   // Yellow
colors.info[500]      // Blue
```

### **Typography**

```javascript
import { typography } from '../design-system';

// Font sizes
typography.fontSize.xs    // 0.75rem (12px)
typography.fontSize.base  // 1rem (16px)
typography.fontSize.lg    // 1.125rem (18px)
typography.fontSize.xl    // 1.25rem (20px)

// Font weights
typography.fontWeight.normal   // 400
typography.fontWeight.medium   // 500
typography.fontWeight.semibold // 600
typography.fontWeight.bold     // 700
```

### **Spacing**

```javascript
import { spacing } from '../design-system';

spacing[1]  // 0.25rem (4px)
spacing[2]  // 0.5rem (8px)
spacing[4]  // 1rem (16px)
spacing[6]  // 1.5rem (24px)
spacing[8]  // 2rem (32px)
```

### **Border Radius**

```javascript
import { borderRadius } from '../design-system';

borderRadius.sm   // 0.125rem (2px)
borderRadius.md   // 0.375rem (6px)
borderRadius.lg   // 0.5rem (8px)
borderRadius.xl   // 0.75rem (12px)
borderRadius.full // 9999px (circular)
```

## 🔧 Utility Functions

### **Class Name Utility**

```javascript
import { cn } from '../design-system';

// Merge class names
cn('base-class', className, {
  'conditional-class': condition,
  'another-class': anotherCondition
});

// Example usage
<Button className={cn(
  'custom-button',
  variant === 'primary' && 'primary-styles',
  disabled && 'disabled-styles'
)}>
  Click me
</Button>
```

### **BEM Utility**

```javascript
import { bem } from '../design-system';

// Generate BEM class names
bem('card', 'header', 'large');     // 'card__header--large'
bem('button', 'icon');              // 'button__icon'
bem('input', '', 'error');          // 'input--error'
```

## 🎭 Animation System

### **Framer Motion Integration**

All components support smooth animations through Framer Motion:

```jsx
// Button with custom animations
<Button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  Animated Button
</Button>

// Card with entrance animation
<Card
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Animated Card
</Card>
```

### **Predefined Animations**

```javascript
import { animations } from '../design-system';

// Fade animations
animations.fadeIn
animations.fadeOut

// Slide animations
animations.slideInUp
animations.slideInDown
animations.slideInLeft
animations.slideInRight

// Scale animations
animations.scaleIn
animations.scaleOut

// Utility animations
animations.bounce
animations.pulse
animations.spin
```

## ♿ Accessibility Guidelines

### **General Principles**

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Attributes**: Provide proper ARIA labels and roles
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Focus Management**: Clear focus indicators and logical tab order
5. **Screen Reader Support**: Proper announcements and descriptions

### **Component-Specific Guidelines**

#### **Buttons**
- Use `aria-label` for icon-only buttons
- Include `aria-busy` for loading states
- Provide `aria-pressed` for toggle buttons

#### **Forms**
- Associate labels with inputs using `htmlFor`
- Use `aria-describedby` for help text
- Include `aria-invalid` for validation errors

#### **Sliders**
- Use `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Provide `aria-valuetext` for custom value descriptions
- Support keyboard navigation (arrows, home, end)

#### **Cards**
- Use proper heading hierarchy
- Include `aria-label` for clickable cards
- Provide `aria-expanded` for expandable cards

## 🚀 Performance Best Practices

### **Component Optimization**

1. **Memoization**: Use `React.memo` for expensive components
2. **Callback Optimization**: Use `useCallback` for event handlers
3. **State Management**: Minimize unnecessary re-renders
4. **Bundle Splitting**: Use dynamic imports for large components

### **Animation Performance**

1. **Hardware Acceleration**: Use `transform` and `opacity` properties
2. **Reduced Motion**: Respect user preferences
3. **Throttling**: Limit animation frequency
4. **Cleanup**: Properly clean up animation subscriptions

### **Example Optimized Component**

```jsx
import React, { memo, useCallback } from 'react';

const OptimizedButton = memo(({ onClick, children, ...props }) => {
  const handleClick = useCallback((event) => {
    onClick?.(event);
  }, [onClick]);

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
});

OptimizedButton.displayName = 'OptimizedButton';
```

## 🧪 Testing Guidelines

### **Component Testing**

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit form' })).toBeInTheDocument();
  });
});
```

### **Accessibility Testing**

```jsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📱 Responsive Design

### **Breakpoints**

```javascript
import { breakpoints } from '../design-system';

breakpoints.sm   // 640px
breakpoints.md   // 768px
breakpoints.lg   // 1024px
breakpoints.xl   // 1280px
breakpoints['2xl'] // 1536px
```

### **Responsive Utilities**

```javascript
import { responsive } from '../design-system';

const responsiveStyles = responsive({
  base: { fontSize: '16px' },
  md: { fontSize: '18px' },
  lg: { fontSize: '20px' }
});
```

## 🎨 Theming

### **Dark Mode Support**

All components support dark mode through CSS custom properties:

```css
/* Light mode (default) */
:root {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
  --border-primary: #e2e8f0;
}

/* Dark mode */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  --border-primary: #334155;
}
```

### **Custom Themes**

```javascript
import { createTheme } from '../design-system';

const customTheme = createTheme({
  colors: {
    primary: {
      600: '#your-color',
    },
  },
  spacing: {
    4: '1.5rem',
  },
});
```

## 📚 Usage Examples

### **Form with Validation**

```jsx
import { Input, Button, Card } from '../components/ui';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>Send us a message</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={errors.name}
            required
          />
          <Input
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={errors.email}
            required
          />
          <Input
            type="textarea"
            label="Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            error={errors.message}
            required
          />
          <Button type="submit" fullWidth>
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

### **Settings Panel**

```jsx
import { Card, Slider, Button } from '../components/ui';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    volume: 50,
    brightness: 75,
    notifications: true
  });

  return (
    <div className="settings-panel">
      <Card>
        <CardHeader>
          <CardTitle>Audio Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            label="Volume"
            min={0}
            max={100}
            value={settings.volume}
            onChange={(value) => setSettings({...settings, volume: value})}
            showValue
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            label="Brightness"
            min={0}
            max={100}
            value={settings.brightness}
            onChange={(value) => setSettings({...settings, brightness: value})}
            showValue
          />
        </CardContent>
      </Card>
    </div>
  );
};
```

## 🔄 Migration Guide

### **From Legacy Components**

If migrating from older components, follow these steps:

1. **Update Imports**: Use new component paths
2. **Update Props**: Map old props to new API
3. **Test Functionality**: Ensure all features work
4. **Update Styling**: Use new design system tokens
5. **Verify Accessibility**: Check ARIA attributes

### **Example Migration**

```jsx
// Old component
<OldButton 
  className="btn btn-primary"
  onClick={handleClick}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Submit'}
</OldButton>

// New component
<Button
  variant="primary"
  onClick={handleClick}
  loading={isLoading}
>
  Submit
</Button>
```

## 🤝 Contributing

### **Adding New Components**

1. **Create Component**: Follow existing patterns
2. **Add Documentation**: Include JSDoc comments
3. **Write Tests**: Ensure good test coverage
4. **Update Examples**: Add to this documentation
5. **Accessibility Review**: Verify ARIA compliance

### **Component Template**

```jsx
/**
 * ComponentName Component
 * 
 * Brief description of the component's purpose and functionality.
 * 
 * @component
 * @example
 * ```jsx
 * <ComponentName prop="value">
 *   Content
 * </ComponentName>
 * ```
 */

import React, { forwardRef, memo } from 'react';
import { cn } from '../../design-system';

const ComponentName = forwardRef(({
  // Props
  children,
  // ... other props
  
  // Styling
  className,
  style,
  
  // Other
  ...props
}, ref) => {
  // Component logic
  
  return (
    <div
      ref={ref}
      className={cn('component-name', className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';

export default memo(ComponentName);
```

---

**🎯 Goal**: This component library provides a solid foundation for building accessible, performant, and beautiful user interfaces while maintaining consistency and reusability across the entire application. 