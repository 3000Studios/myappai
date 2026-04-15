// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import React from 'react';

export default function PlatinumButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'luxury-btn bg-gradient-to-br from-gold to-platinum text-black font-bold px-8 py-3 rounded-xl shadow-xl hover:scale-105 hover:shadow-gold/40 transition-all ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  );
}

