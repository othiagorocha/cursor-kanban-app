import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Loader2Icon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  to?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    to,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-10 rounded-md px-4 text-sm",
      lg: "h-12 rounded-md px-6 text-base",
    };

    const styles = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (to) {
      return (
        <Link
          to={to}
          className={styles}
        >
          {isLoading && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          {!isLoading && leftIcon && (
            <span className="mr-2">{leftIcon}</span>
          )}
          {children}
          {!isLoading && rightIcon && (
            <span className="ml-2">{rightIcon}</span>
          )}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={styles}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
); 