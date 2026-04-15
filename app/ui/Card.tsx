import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export default function Card({ children, className = '', gradient = false }: CardProps) {
  const baseStyles =
    'backdrop-blur-md rounded-xl p-6 border transition-all duration-300 flex flex-col items-center text-center';
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-white/5 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
    : 'bg-white/5 border-white/10 hover:border-white/20';

  return <div className={`${baseStyles} ${gradientStyles} ${className}`}>{children}</div>;
}

