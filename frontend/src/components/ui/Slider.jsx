/**
 * Slider Component
 * 
 * A highly reusable, accessible, and performant slider component with
 * multiple variants, ranges, and proper ARIA attributes. Supports
 * keyboard navigation, touch gestures, and custom styling.
 * 
 * @component
 * @example
 * ```jsx
 * <Slider
 *   min={0}
 *   max={100}
 *   value={50}
 *   onChange={handleChange}
 *   label="Battery Level"
 * />
 * 
 * <Slider
 *   min={0}
 *   max={200}
 *   value={[25, 75]}
 *   onChange={handleRangeChange}
 *   range
 *   label="Price Range"
 *   showValue
 * />
 * ```
 */

import React, { forwardRef, memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn, colors, spacing, borderRadius, typography, shadows, transitions } from '../../design-system';

// ============================================================================
// SLIDER VARIANTS
// ============================================================================

const sliderVariants = {
  default: {
    track: {
      backgroundColor: colors.neutral[200],
      height: '6px',
      borderRadius: borderRadius.full,
    },
    filledTrack: {
      backgroundColor: colors.primary[600],
      height: '6px',
      borderRadius: borderRadius.full,
    },
    thumb: {
      backgroundColor: colors.primary[600],
      border: `2px solid ${colors.light.bg.primary}`,
      boxShadow: shadows.lg,
      width: '20px',
      height: '20px',
      borderRadius: borderRadius.full,
    },
  },
  accent: {
    track: {
      backgroundColor: colors.neutral[200],
      height: '8px',
      borderRadius: borderRadius.full,
    },
    filledTrack: {
      backgroundColor: colors.accent[600],
      height: '8px',
      borderRadius: borderRadius.full,
    },
    thumb: {
      backgroundColor: colors.accent[600],
      border: `2px solid ${colors.light.bg.primary}`,
      boxShadow: shadows.lg,
      width: '24px',
      height: '24px',
      borderRadius: borderRadius.full,
    },
  },
  large: {
    track: {
      backgroundColor: colors.neutral[200],
      height: '10px',
      borderRadius: borderRadius.full,
    },
    filledTrack: {
      backgroundColor: colors.primary[600],
      height: '10px',
      borderRadius: borderRadius.full,
    },
    thumb: {
      backgroundColor: colors.primary[600],
      border: `3px solid ${colors.light.bg.primary}`,
      boxShadow: shadows.xl,
      width: '28px',
      height: '28px',
      borderRadius: borderRadius.full,
    },
  },
};

// ============================================================================
// SLIDER COMPONENT
// ============================================================================

const Slider = forwardRef(({
  // Props
  min = 0,
  max = 100,
  value,
  defaultValue,
  step = 1,
  range = false,
  disabled = false,
  readOnly = false,
  
  // Labels and descriptions
  label,
  description,
  showValue = false,
  valueLabel,
  valueFormatter,
  
  // Event handlers
  onChange,
  onValueChange,
  onValueCommit,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-labelledby': ariaLabelledby,
  
  // Styling
  variant = 'default',
  size = 'md',
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
  
  const [internalValue, setInternalValue] = useState(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return range ? [min, max] : min;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [focusedThumb, setFocusedThumb] = useState(null);
  const trackRef = useRef(null);
  const thumbRefs = useRef({});
  
  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const currentValue = value !== undefined ? value : internalValue;
  const isDisabled = disabled || readOnly;
  const sliderVariant = sliderVariants[variant] || sliderVariants.default;
  const values = Array.isArray(currentValue) ? currentValue : [currentValue];
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  const formatValue = useCallback((val) => {
    if (valueFormatter) return valueFormatter(val);
    if (valueLabel) return valueLabel(val);
    return val.toString();
  }, [valueFormatter, valueLabel]);
  
  const getPercentage = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);
  
  const getValueFromPercentage = useCallback((percentage) => {
    const rawValue = (percentage / 100) * (max - min) + min;
    return Math.round(rawValue / step) * step;
  }, [min, max, step]);
  
  const getValueFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return min;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return getValueFromPercentage(percentage);
  }, [min, getValueFromPercentage]);
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleTrackClick = useCallback((event) => {
    if (isDisabled) return;
    
    const newValue = getValueFromPosition(event.clientX);
    
    if (range) {
      const [minVal, maxVal] = values;
      const minDistance = Math.abs(newValue - minVal);
      const maxDistance = Math.abs(newValue - maxVal);
      
      const newValues = [...values];
      if (minDistance < maxDistance) {
        newValues[0] = Math.min(newValue, maxVal);
      } else {
        newValues[1] = Math.max(newValue, minVal);
      }
      
      setInternalValue(newValues);
      onChange?.(newValues);
      onValueChange?.(newValues);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
      onValueChange?.(newValue);
    }
  }, [isDisabled, getValueFromPosition, range, values, onChange, onValueChange]);
  
  const handleThumbMouseDown = useCallback((event, thumbIndex) => {
    if (isDisabled) return;
    
    event.preventDefault();
    setIsDragging(true);
    setFocusedThumb(thumbIndex);
    
    const handleMouseMove = (moveEvent) => {
      const newValue = getValueFromPosition(moveEvent.clientX);
      
      if (range) {
        const newValues = [...values];
        newValues[thumbIndex] = newValue;
        
        // Ensure min <= max
        if (thumbIndex === 0) {
          newValues[0] = Math.min(newValue, values[1]);
        } else {
          newValues[1] = Math.max(newValue, values[0]);
        }
        
        setInternalValue(newValues);
        onValueChange?.(newValues);
      } else {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setFocusedThumb(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (range) {
        onValueCommit?.(values);
      } else {
        onValueCommit?.(values[0]);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDisabled, getValueFromPosition, range, values, onValueChange, onValueCommit]);
  
  const handleKeyDown = useCallback((event, thumbIndex) => {
    if (isDisabled) return;
    
    const stepValue = event.shiftKey ? step * 10 : step;
    let newValue;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(min, values[thumbIndex] - stepValue);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(max, values[thumbIndex] + stepValue);
        break;
      case 'Home':
        event.preventDefault();
        newValue = min;
        break;
      case 'End':
        event.preventDefault();
        newValue = max;
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = Math.max(min, values[thumbIndex] - stepValue * 10);
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = Math.min(max, values[thumbIndex] + stepValue * 10);
        break;
      default:
        return;
    }
    
    if (range) {
      const newValues = [...values];
      newValues[thumbIndex] = newValue;
      
      // Ensure min <= max
      if (thumbIndex === 0) {
        newValues[0] = Math.min(newValue, values[1]);
      } else {
        newValues[1] = Math.max(newValue, values[0]);
      }
      
      setInternalValue(newValues);
      onChange?.(newValues);
      onValueChange?.(newValues);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
      onValueChange?.(newValue);
    }
  }, [isDisabled, step, min, max, range, values, onChange, onValueChange]);
  
  // ============================================================================
  // ACCESSIBILITY ATTRIBUTES
  // ============================================================================
  
  const getAccessibilityProps = (thumbIndex) => ({
    role: 'slider',
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': values[thumbIndex],
    'aria-valuetext': formatValue(values[thumbIndex]),
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    'aria-disabled': isDisabled,
    'aria-readonly': readOnly,
    tabIndex: isDisabled ? -1 : 0,
  });
  
  // ============================================================================
  // STYLES
  // ============================================================================
  
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    ...style,
  };
  
  const trackStyles = {
    position: 'relative',
    width: '100%',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    ...sliderVariant.track,
  };
  
  const getFilledTrackStyles = (start, end) => ({
    position: 'absolute',
    top: 0,
    left: `${start}%`,
    width: `${end - start}%`,
    ...sliderVariant.filledTrack,
  });
  
  const getThumbStyles = (percentage, thumbIndex) => ({
    position: 'absolute',
    top: '50%',
    left: `${percentage}%`,
    transform: 'translate(-50%, -50%)',
    cursor: isDisabled ? 'not-allowed' : 'grab',
    ...sliderVariant.thumb,
    ...(isDragging && focusedThumb === thumbIndex && {
      cursor: 'grabbing',
      transform: 'translate(-50%, -50%) scale(1.1)',
    }),
  });
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  const renderThumb = (thumbIndex) => {
    const percentage = getPercentage(values[thumbIndex]);
    const Component = animate ? motion.div : 'div';
    
    return (
      <Component
        key={thumbIndex}
        ref={(el) => (thumbRefs.current[thumbIndex] = el)}
        className={cn('slider-thumb')}
        style={getThumbStyles(percentage, thumbIndex)}
        onMouseDown={(e) => handleThumbMouseDown(e, thumbIndex)}
        onKeyDown={(e) => handleKeyDown(e, thumbIndex)}
        onFocus={() => setFocusedThumb(thumbIndex)}
        onBlur={() => setFocusedThumb(null)}
        {...getAccessibilityProps(thumbIndex)}
        {...(animate && {
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.95 },
        })}
      />
    );
  };
  
  const renderValue = () => {
    if (!showValue) return null;
    
    return (
      <div style={{ textAlign: 'center', fontSize: typography.fontSize.sm }}>
        {range ? (
          <span>
            {formatValue(values[0])} - {formatValue(values[1])}
          </span>
        ) : (
          <span>{formatValue(values[0])}</span>
        )}
      </div>
    );
  };
  
  const sliderContent = (
    <div className={cn('slider-container', className)} style={containerStyles}>
      {/* Label */}
      {label && (
        <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
          {label}
        </label>
      )}
      
      {/* Slider Track */}
      <div
        ref={trackRef}
        className={cn('slider-track')}
        style={trackStyles}
        onClick={handleTrackClick}
        role="presentation"
      >
        {/* Filled Track */}
        {range ? (
          <div
            className="slider-filled-track"
            style={getFilledTrackStyles(
              getPercentage(values[0]),
              getPercentage(values[1])
            )}
          />
        ) : (
          <div
            className="slider-filled-track"
            style={getFilledTrackStyles(0, getPercentage(values[0]))}
          />
        )}
        
        {/* Thumbs */}
        {values.map((_, index) => renderThumb(index))}
      </div>
      
      {/* Description */}
      {description && (
        <p style={{ fontSize: typography.fontSize.xs, color: colors.light.text.tertiary }}>
          {description}
        </p>
      )}
      
      {/* Value Display */}
      {renderValue()}
    </div>
  );
  
  return sliderContent;
});

// ============================================================================
// DISPLAY NAME
// ============================================================================

Slider.displayName = 'Slider';

// ============================================================================
// PROP TYPES (for development)
// ============================================================================

if (process.env.NODE_ENV === 'development') {
  Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    step: PropTypes.number,
    range: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    label: PropTypes.string,
    description: PropTypes.string,
    showValue: PropTypes.bool,
    valueLabel: PropTypes.func,
    valueFormatter: PropTypes.func,
    onChange: PropTypes.func,
    onValueChange: PropTypes.func,
    onValueCommit: PropTypes.func,
    'aria-label': PropTypes.string,
    'aria-describedby': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    variant: PropTypes.oneOf(['default', 'accent', 'large']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    style: PropTypes.object,
    animate: PropTypes.bool,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export default memo(Slider);

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export const RangeSlider = (props) => <Slider range {...props} />;
export const AccentSlider = (props) => <Slider variant="accent" {...props} />;
export const LargeSlider = (props) => <Slider variant="large" {...props} />;
export const DisabledSlider = (props) => <Slider disabled {...props} />;
export const ReadOnlySlider = (props) => <Slider readOnly {...props} />;
export const ValueSlider = (props) => <Slider showValue {...props} />; 