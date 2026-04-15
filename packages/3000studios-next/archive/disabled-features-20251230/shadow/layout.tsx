// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

import { ReactNode } from "react";

export default function ShadowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shadow-system">
      <div className="shadow-background fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black -z-10" />
      {children}
    </div>
  );
}

