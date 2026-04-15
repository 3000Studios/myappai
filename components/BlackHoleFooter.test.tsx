// src/components/BlackHoleFooter.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlackHoleFooter from './BlackHoleFooter';

describe('BlackHoleFooter', () => {
  it('renders the footer with the correct text', () => {
    render(<BlackHoleFooter />);
    const footerText = screen.getByText('3000 STUDIOS ∞');
    expect(footerText).toBeInTheDocument();
  });
});

