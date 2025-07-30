import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const buttonVariants = {
  primary: "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/25",
  secondary: "bg-accent hover:bg-accent/80 text-foreground",
  outline: "bg-card/50 backdrop-blur-sm border border-border text-foreground hover:bg-card/70",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
};

const sizeVariants = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg"
};

const Button = React.forwardRef(({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  onClick,
  type = "button",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const classes = cn(
    baseClasses,
    buttonVariants[variant],
    sizeVariants[size],
    className
  );

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className={cn("w-4 h-4", size === "lg" && "w-5 h-5", size === "xl" && "w-6 h-6")} />
      )}
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
      {Icon && iconPosition === "right" && (
        <Icon className={cn("w-4 h-4", size === "lg" && "w-5 h-5", size === "xl" && "w-6 h-6")} />
      )}
    </>
  );

  return (
    <motion.button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button; 