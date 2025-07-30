import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Slider = React.forwardRef(({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  label,
  showValue = true,
  showRange = true,
  disabled = false,
  ...props
}, ref) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className={cn(
            "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          {...props}
        />
        
        {/* Custom slider track */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-2 bg-muted rounded-lg" />
          <motion.div
            className="h-2 bg-primary rounded-lg"
            style={{ width: `${percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Range and value display */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {showRange && <span>{min}</span>}
        {showValue && (
          <span className="text-primary font-medium">
            {value}{props.unit || ''}
          </span>
        )}
        {showRange && <span>{max}</span>}
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider; 