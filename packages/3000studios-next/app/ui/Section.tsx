import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`section-standard ${className}`}>
      <div className="container-standard flex flex-col items-center text-center">{children}</div>
    </section>
  );
}

