/**
 * Button Component
 * 
 * A highly reusable, accessible, and performant button component with
 * multiple variants, sizes, and states. Supports loading states, icons,
 * and proper ARIA attributes.
 * 
 * @component
 * @example
 * ```jsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * <Button variant="outline" size="lg" loading>
 *   Loading...
 * </Button>
 * 
 * <Button variant="ghost" size="sm" icon={<Icon />}>
 *   With Icon
 * </Button>
 * ```
 */

import React, { forwardRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn, colors, spacing, borderRadius, typography, shadows, transitions } from '../../design-system';

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

const buttonVariants = {
  primary: {
    backgroundColor: colors.primary[600],
    color: colors.light.text.primary,
    border: `1px solid ${colors.primary[600]}`,
    boxShadow: shadows.base,
    '&:hover': {
      backgroundColor: colors.primary[700],
      borderColor: colors.primary[700],
      boxShadow: shadows.md,
    },
    '&:focus': {
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    '&:active': {
      backgroundColor: colors.primary[800],
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: colors.neutral[300],
      borderColor: colors.neutral[300],
      color: colors.neutral[500],
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  secondary: {
    backgroundColor: colors.secondary[600],
    color: colors.light.text.primary,
    border: `1px solid ${colors.secondary[600]}`,
    boxShadow: shadows.base,
    '&:hover': {
      backgroundColor: colors.secondary[700],
      borderColor: colors.secondary[700],
      boxShadow: shadows.md,
    },
    '&:focus': {
      boxShadow: `0 0 0 3px ${colors.secondary[200]}`,
    },
    '&:active': {
      backgroundColor: colors.secondary[800],
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: colors.neutral[300],
      borderColor: colors.neutral[300],
      color: colors.neutral[500],
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.primary[600],
    border: `1px solid ${colors.primary[600]}`,
    '&:hover': {
      backgroundColor: colors.primary[50],
      borderColor: colors.primary[700],
    },
    '&:focus': {
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    '&:active': {
      backgroundColor: colors.primary[100],
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      borderColor: colors.neutral[300],
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.primary[600],
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: colors.primary[50],
    },
    '&:focus': {
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    '&:active': {
      backgroundColor: colors.primary[100],
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
  },
  danger: {
    backgroundColor: colors.error[600],
    color: colors.light.text.primary,
    border: `1px solid ${colors.error[600]}`,
    boxShadow: shadows.base,
    '&:hover': {
      backgroundColor: colors.error[700],
      borderColor: colors.error[700],
      boxShadow: shadows.md,
    },
    '&:focus': {
      boxShadow: `0 0 0 3px ${colors.error[200]}`,
    },
    '&:active': {
      backgroundColor: colors.error[800],
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: colors.neutral[300],
      borderColor: colors.neutral[300],
      color: colors.neutral[500],
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  success: {
    backgroundColor: colors.success[600],
    color: colors.light.text.primary,
    border: `1px solid ${colors.success[600]}`,
    boxShadow: shadows.base,
    '&:hover': {
      backgroundColor: colors.success[700],
      borderColor: colors.success[700],
      boxShadow: shadows.md,
    },
    '&:focus': {
      boxShadow: `0 0 0 3px ${colors.success[200]}`,
    },
    '&:active': {
      backgroundColor: colors.success[800],
      transform: 'translateY(1px)',
    },
    '&:disabled': {
      backgroundColor: colors.neutral[300],
      borderColor: colors.neutral[300],
      color: colors.neutral[500],
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
};

// ============================================================================
// BUTTON SIZES
// ============================================================================

const buttonSizes = {
  sm: {
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.sm,
    borderRadius: borderRadius.md,
    minHeight: '32px',
    gap: spacing[2],
  },
  md: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    borderRadius: borderRadius.lg,
    minHeight: '40px',
    gap: spacing[3],
  },
  lg: {
    padding: `${spacing[4]} ${spacing[6]}`,
    fontSize: typography.fontSize.lg,
    borderRadius: borderRadius.xl,
    minHeight: '48px',
    gap: spacing[3],
  },
  xl: {
    padding: `${spacing[5]} ${spacing[8]}`,
    fontSize: typography.fontSize.xl,
    borderRadius: borderRadius['2xl'],
    minHeight: '56px',
    gap: spacing[4],
  },
};

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const Button = forwardRef(({
  // Props
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  
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
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.98 },
  
  // Other
  ...props
}, ref) => {
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const isDisabled = disabled || loading;
  const buttonVariant = buttonVariants[variant] || buttonVariants.primary;
  const buttonSize = buttonSizes[size] || buttonSizes.md;
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  
  // ============================================================================
  // ACCESSIBILITY ATTRIBUTES
  // ============================================================================
  
  const accessibilityProps = {
    'aria-disabled': isDisabled,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-expanded': ariaExpanded,
    'aria-pressed': ariaPressed,
    'aria-haspopup': ariaHasPopup,
    'aria-busy': loading,
    role: type === 'button' ? 'button' : undefined,
    tabIndex: isDisabled ? -1 : 0,
  };
  
  // ============================================================================
  // STYLES
  // ============================================================================
  
  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: buttonSize.gap,
    padding: buttonSize.padding,
    fontSize: buttonSize.fontSize,
    fontWeight: typography.fontWeight.medium,
    borderRadius: buttonSize.borderRadius,
    minHeight: buttonSize.minHeight,
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: `${transitions.duration[200]} ${transitions.easing.inOut}`,
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    ...buttonVariant,
    ...style,
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  const buttonContent = (
    <>
      {/* Loading Spinner */}
      {loading && (
        <Loader2 
          className="animate-spin" 
          size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
          aria-hidden="true"
        />
      )}
      
      {/* Left Icon */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {/* Content */}
      <span className="flex-shrink-0">
        {children}
      </span>
      
      {/* Right Icon */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );
  
  // ============================================================================
  // ANIMATED BUTTON
  // ============================================================================
  
  if (animate) {
    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn('button', className)}
        style={buttonStyles}
        disabled={isDisabled}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        whileHover={isDisabled ? {} : whileHover}
        whileTap={isDisabled ? {} : whileTap}
        whileFocus={{ scale: 1.02 }}
        {...accessibilityProps}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
  
  // ============================================================================
  // STATIC BUTTON
  // ============================================================================
  
  return (
    <button
      ref={ref}
      type={type}
      className={cn('button', className)}
      style={buttonStyles}
      disabled={isDisabled}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      {...accessibilityProps}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

// ============================================================================
// DISPLAY NAME
// ============================================================================

Button.displayName = 'Button';

// ============================================================================
// PROP TYPES (for development)
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  Button.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger', 'success']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
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

export default memo(Button);

// ============================================================================
// NAMED EXPORTS FOR CONVENIENCE
// ============================================================================

export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;

export const SmallButton = (props) => <Button size="sm" {...props} />;
export const LargeButton = (props) => <Button size="lg" {...props} />;
export const ExtraLargeButton = (props) => <Button size="xl" {...props} />;

export const LoadingButton = (props) => <Button loading {...props} />;
export const DisabledButton = (props) => <Button disabled {...props} />;
export const FullWidthButton = (props) => <Button fullWidth {...props} />; 