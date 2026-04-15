/**
 * AUTHORITATIVE BUTTON SYSTEM
 * Single source of truth for all button styling
 * Import this component - do not create custom buttons
 *
 * Usage:
 *   <Button variant="primary">Click Me</Button>
 *   <Button variant="secondary" size="lg">Action</Button>
 *   <Button as="link" href="/page">Navigate</Button>
 */

'use client';

import { brand } from '@/design/brand';
import * as React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'base' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold hover:from-cyan-300 hover:to-blue-400 active:from-cyan-500 active:to-blue-600 hover:scale-105 active:scale-95`,
  secondary: `border-2 border-cyan-400 text-cyan-400 font-bold hover:text-cyan-300 hover:border-cyan-300 hover:bg-white/10 active:bg-white/20`,
  ghost: `text-white font-bold hover:text-cyan-300 hover:bg-white/10 active:bg-white/20`,
  danger: `bg-red-600 text-white font-bold hover:bg-red-500 active:bg-red-700 hover:scale-105 active:scale-95`,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  base: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'base', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
    const combinedClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return <button ref={ref} className={combinedClass} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };

