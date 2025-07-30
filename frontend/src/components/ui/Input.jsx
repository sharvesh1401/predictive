/**
 * Input Component
 * 
 * A highly reusable, accessible, and performant input component with
 * multiple variants, validation states, and proper ARIA attributes.
 * Supports icons, labels, descriptions, and various input types.
 * 
 * @component
 * @example
 * ```jsx
 * <Input
 *   type="text"
 *   label="Email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={handleEmailChange}
 *   required
 * />
 * 
 * <Input
 *   type="password"
 *   label="Password"
 *   icon={<LockIcon />}
 *   error="Password is required"
 *   showPasswordToggle
 * />
 * ```
 */

import React, { forwardRef, memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn, colors, spacing, borderRadius, typography, shadows, transitions } from '../../design-system';

// ============================================================================
// INPUT VARIANTS
// ============================================================================

const inputVariants = {
  default: {
    border: `1px solid ${colors.light.border.primary}`,
    backgroundColor: colors.light.bg.primary,
    color: colors.light.text.primary,
    '&:hover': {
      borderColor: colors.light.border.secondary,
    },
    '&:focus': {
      borderColor: colors.primary[600],
      boxShadow: `0 0 0 3px ${colors.primary[200]}`,
    },
    '&:disabled': {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[500],
      cursor: 'not-allowed',
    },
  },
  error: {
    border: `1px solid ${colors.error[500]}`,
    backgroundColor: colors.light.bg.primary,
    color: colors.light.text.primary,
    '&:hover': {
      borderColor: colors.error[600],
    },
    '&:focus': {
      borderColor: colors.error[600],
      boxShadow: `0 0 0 3px ${colors.error[200]}`,
    },
  },
  success: {
    border: `1px solid ${colors.success[500]}`,
    backgroundColor: colors.light.bg.primary,
    color: colors.light.text.primary,
    '&:hover': {
      borderColor: colors.success[600],
    },
    '&:focus': {
      borderColor: colors.success[600],
      boxShadow: `0 0 0 3px ${colors.success[200]}`,
    },
  },
};

// ============================================================================
// INPUT SIZES
// ============================================================================

const inputSizes = {
  sm: {
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.sm,
    borderRadius: borderRadius.md,
    minHeight: '32px',
  },
  md: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    borderRadius: borderRadius.lg,
    minHeight: '40px',
  },
  lg: {
    padding: `${spacing[4]} ${spacing[5]}`,
    fontSize: typography.fontSize.lg,
    borderRadius: borderRadius.xl,
    minHeight: '48px',
  },
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================

const Input = forwardRef(({
  // Props
  type = 'text',
  value,
  defaultValue,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  
  // Labels and descriptions
  label,
  description,
  error,
  success,
  hint,
  
  // Icons
  icon,
  iconPosition = 'left',
  showPasswordToggle = false,
  
  // Event handlers
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-labelledby': ariaLabelledby,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  
  // Styling
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  style,
  
  // Animation
  animate = true,
  
  // Other
  ...props
}, ref) => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const isDisabled = disabled || readOnly;
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasSuccess = !!success;
  const inputVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;
  const inputSize = inputSizes[size] || inputSizes.md;
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleFocus = useCallback((event) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);
  
  const handleBlur = useCallback((event) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);
  
  const handlePasswordToggle = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);
  
  // ============================================================================
  // ACCESSIBILITY ATTRIBUTES
  // ============================================================================
  
  const accessibilityProps = {
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    'aria-invalid': ariaInvalid !== undefined ? ariaInvalid : hasError,
    'aria-required': ariaRequired !== undefined ? ariaRequired : required,
    'aria-disabled': isDisabled,
    'aria-readonly': readOnly,
  };
  
  // ============================================================================
  // STYLES
  // ============================================================================
  
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };
  
  const inputStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: inputSize.padding,
    fontSize: inputSize.fontSize,
    fontWeight: typography.fontWeight.normal,
    borderRadius: inputSize.borderRadius,
    minHeight: inputSize.minHeight,
    width: '100%',
    border: 'none',
    outline: 'none',
    transition: `${transitions.duration[200]} ${transitions.easing.inOut}`,
    fontFamily: typography.fontFamily.sans,
    ...inputVariants[inputVariant],
  };
  
  const inputElementStyles = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    fontFamily: 'inherit',
    '&::placeholder': {
      color: colors.light.text.muted,
    },
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  const renderIcon = (iconComponent, position) => {
    if (!iconComponent) return null;
    
    return (
      <span
        className={cn('input-icon', `input-icon-${position}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.light.text.tertiary,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {iconComponent}
      </span>
    );
  };
  
  const renderStatusIcon = () => {
    if (hasError) {
      return (
        <AlertCircle
          size={16}
          color={colors.error[500]}
          aria-label="Error"
        />
      );
    }
    
    if (hasSuccess) {
      return (
        <CheckCircle
          size={16}
          color={colors.success[500]}
          aria-label="Success"
        />
      );
    }
    
    return null;
  };
  
  const renderPasswordToggle = () => {
    if (!showPasswordToggle || type !== 'password') return null;
    
    return (
      <button
        type="button"
        onClick={handlePasswordToggle}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: spacing[1],
          color: colors.light.text.tertiary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    );
  };
  
  const inputContent = (
    <div className={cn('input-container', className)} style={containerStyles}>
      {/* Label */}
      {label && (
        <label
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.light.text.primary,
          }}
        >
          {label}
          {required && (
            <span style={{ color: colors.error[500], marginLeft: spacing[1] }}>
              *
            </span>
          )}
        </label>
      )}
      
      {/* Input Field */}
      <div
        className={cn('input-wrapper')}
        style={inputStyles}
      >
        {/* Left Icon */}
        {renderIcon(icon, 'left')}
        
        {/* Input Element */}
        <input
          ref={ref}
          type={inputType}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={isDisabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onKeyPress={onKeyPress}
          style={inputElementStyles}
          {...accessibilityProps}
          {...props}
        />
        
        {/* Right Icon */}
        {renderIcon(icon, 'right')}
        
        {/* Status Icon */}
        {renderStatusIcon()}
        
        {/* Password Toggle */}
        {renderPasswordToggle()}
      </div>
      
      {/* Description */}
      {description && !hasError && !hasSuccess && (
        <p style={{ fontSize: typography.fontSize.xs, color: colors.light.text.tertiary }}>
          {description}
        </p>
      )}
      
      {/* Error Message */}
      {hasError && (
        <p style={{ fontSize: typography.fontSize.xs, color: colors.error[500] }}>
          {error}
        </p>
      )}
      
      {/* Success Message */}
      {hasSuccess && (
        <p style={{ fontSize: typography.fontSize.xs, color: colors.success[500] }}>
          {success}
        </p>
      )}
      
      {/* Hint */}
      {hint && (
        <p style={{ fontSize: typography.fontSize.xs, color: colors.light.text.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
  
  // ============================================================================
  // ANIMATED INPUT
  // ============================================================================
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {inputContent}
      </motion.div>
    );
  }
  
  return inputContent;
});

// ============================================================================
// DISPLAY NAME
// ============================================================================

Input.displayName = 'Input';

// ============================================================================
// PROP TYPES (for development)
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  Input.propTypes = {
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    pattern: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.string,
    hint: PropTypes.string,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    showPasswordToggle: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyPress: PropTypes.func,
    'aria-label': PropTypes.string,
    'aria-describedby': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-invalid': PropTypes.bool,
    'aria-required': PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'error', 'success']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    animate: PropTypes.bool,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default memo(Input);

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const TextInput = (props) => <Input type="text" {...props} />;
export const EmailInput = (props) => <Input type="email" {...props} />;
export const PasswordInput = (props) => <Input type="password" showPasswordToggle {...props} />;
export const NumberInput = (props) => <Input type="number" {...props} />;
export const TelInput = (props) => <Input type="tel" {...props} />;
export const UrlInput = (props) => <Input type="url" {...props} />;
export const SearchInput = (props) => <Input type="search" {...props} />;

export const SmallInput = (props) => <Input size="sm" {...props} />;
export const LargeInput = (props) => <Input size="lg" {...props} />;
export const FullWidthInput = (props) => <Input fullWidth {...props} />;
export const DisabledInput = (props) => <Input disabled {...props} />;
export const ReadOnlyInput = (props) => <Input readOnly {...props} />; 