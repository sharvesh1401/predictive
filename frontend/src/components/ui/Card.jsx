import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({
  children,
  className,
  variant = "default",
  hover = false,
  ...props
}, ref) => {
  const variants = {
    default: "bg-card border border-border",
    elevated: "bg-card/80 backdrop-blur-sm border border-border shadow-lg",
    ghost: "bg-transparent border-none"
  };

  const classes = cn(
    "rounded-2xl p-6",
    variants[variant],
    hover && "hover:shadow-lg transition-all duration-300",
    className
  );

  const Component = hover ? motion.div : 'div';

  return (
    <Component
      ref={ref}
      className={classes}
      whileHover={hover ? { y: -2 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

const CardHeader = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold text-foreground", className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 