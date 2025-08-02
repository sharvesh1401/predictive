/**
 * Card Component
 * 
 * A highly reusable, accessible, and performant card component with
 * multiple variants, hover effects, and proper semantic structure.
 * Supports headers, content, footers, and various styling options.
 * 
 * @component
 * @example
 * ```jsx
 * <Card variant="default" elevation="md">
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * 
 * <Card variant="elevated" hoverable>
 *   <CardContent>
 *     <h3>Interactive Card</h3>
 *     <p>This card has hover effects</p>
 *   </CardContent>
 * </Card>
 * ```
 */

import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { cn, colors, spacing, borderRadius, shadows, transitions } from '../../design-system';

// ============================================================================
// CARD VARIANTS
// ============================================================================

const cardVariants = {
  default: {
    backgroundColor: colors.light.bg.card,
    border: `1px solid ${colors.light.border.primary}`,
    boxShadow: shadows.base,
  },
  elevated: {
    backgroundColor: colors.light.bg.card,
    border: 'none',
    boxShadow: shadows.lg,
  },
  outline: {
    backgroundColor: 'transparent',
    border: `1px solid ${colors.light.border.primary}`,
    boxShadow: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
  interactive: {
    backgroundColor: colors.light.bg.card,
    border: `1px solid ${colors.light.border.primary}`,
    boxShadow: shadows.base,
    cursor: 'pointer',
    transition: `${transitions.duration[200]} ${transitions.easing.inOut}`,
    '&:hover': {
      borderColor: colors.primary[300],
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
  },
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

const Card = forwardRef(({
  // Props
  children,
  variant = 'default',
  elevation = 'base',
  hoverable = false,
  clickable = false,
  loading = false,
  disabled = false,
  
  // Event handlers
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-expanded': ariaExpanded,
  'aria-pressed': ariaPressed,
  'aria-haspopup': ariaHasPopup,
  
  // Styling
  className,
  style,
  
  // Animation
  animate = true,
  whileHover = hoverable ? { y: -4, scale: 1.02 } : {},
  whileTap = clickable ? { scale: 0.98 } : {},
  
  // Other
  ...props
}, ref) => {
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const isInteractive = clickable || hoverable;
  const isDisabled = disabled || loading;
  const cardVariant = isInteractive ? cardVariants.interactive : cardVariants[variant] || cardVariants.default;
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleClick = (event) => {
    if (isDisabled || !clickable) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    if (isDisabled || !clickable) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event);
    }
  };
  
  // ============================================================================
  // ACCESSIBILITY ATTRIBUTES
  // ============================================================================
  
  const accessibilityProps = {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'aria-haspopup': ariaHasPopup,
    'aria-disabled': isDisabled,
    role: (clickable || hoverable) ? 'button' : undefined,
    tabIndex: (clickable || hoverable) && !isDisabled ? 0 : undefined,
  };
  
  // ============================================================================
  // STYLES
  // ============================================================================
  
  const cardStyles = {
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    position: 'relative',
    overflow: 'hidden',
    ...cardVariant,
    ...style,
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  const cardContent = (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: borderRadius.xl,
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: `2px solid ${colors.neutral[300]}`,
              borderTop: `2px solid ${colors.primary[600]}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
            aria-label="Loading"
          />
        </div>
      )}
      
      {/* Content */}
      {children}
    </>
  );
  
  // ============================================================================
  // ANIMATED CARD
  // ============================================================================
  
  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={cn('card', className)}
        style={cardStyles}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        whileHover={isDisabled ? {} : whileHover}
        whileTap={isDisabled ? {} : whileTap}
        whileFocus={clickable ? { scale: 1.02 } : {}}
        {...accessibilityProps}
        {...props}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  // ============================================================================
  // STATIC CARD
  // ============================================================================
  
  return (
    <div
      ref={ref}
      className={cn('card', className)}
      style={cardStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      {...accessibilityProps}
      {...props}
    >
      {cardContent}
    </div>
  );
});

// ============================================================================
// CARD HEADER COMPONENT
// ============================================================================

const CardHeader = forwardRef(({
  children,
  className,
  style,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('card-header', className)}
      style={{
        marginBottom: spacing[4],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// ============================================================================
// CARD TITLE COMPONENT
// ============================================================================

const CardTitle = forwardRef(({
  children,
  className,
  style,
  as: Component = 'h3',
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn('card-title', className)}
      style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: colors.light.text.primary,
        margin: 0,
        marginBottom: spacing[2],
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

// ============================================================================
// CARD DESCRIPTION COMPONENT
// ============================================================================

const CardDescription = forwardRef(({
  children,
  className,
  style,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn('card-description', className)}
      style={{
        fontSize: '0.875rem',
        color: colors.light.text.tertiary,
        margin: 0,
        lineHeight: 1.5,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

// ============================================================================
// CARD CONTENT COMPONENT
// ============================================================================

const CardContent = forwardRef(({
  children,
  className,
  style,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('card-content', className)}
      style={{
        marginBottom: spacing[4],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

// ============================================================================
// CARD FOOTER COMPONENT
// ============================================================================

const CardFooter = forwardRef(({
  children,
  className,
  style,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('card-footer', className)}
      style={{
        marginTop: 'auto',
        paddingTop: spacing[4],
        borderTop: `1px solid ${colors.light.border.primary}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

// ============================================================================
// DISPLAY NAME
// ============================================================================

Card.displayName = 'Card';

// ============================================================================
// PROP TYPES (for development)
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  Card.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['default', 'elevated', 'outline', 'ghost']),
    elevation: PropTypes.oneOf(['none', 'sm', 'base', 'md', 'lg', 'xl']),
    hoverable: PropTypes.bool,
    clickable: PropTypes.bool,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    'aria-label': PropTypes.string,
    'aria-describedby': PropTypes.string,
    'aria-expanded': PropTypes.bool,
    'aria-pressed': PropTypes.bool,
    'aria-haspopup': PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    animate: PropTypes.bool,
    whileHover: PropTypes.object,
    whileTap: PropTypes.object,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default memo(Card);

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const ElevatedCard = (props) => <Card variant="elevated" {...props} />;
export const OutlineCard = (props) => <Card variant="outline" {...props} />;
export const GhostCard = (props) => <Card variant="ghost" {...props} />;
export const InteractiveCard = (props) => <Card variant="interactive" {...props} />;
export const HoverableCard = (props) => <Card hoverable {...props} />;
export const ClickableCard = (props) => <Card clickable {...props} />;
export const LoadingCard = (props) => <Card loading {...props} />; 