// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

import dynamic from 'next/dynamic';

const VideoBackground = dynamic(() => import('./VideoBackground'), {
  ssr: false,
});

export default function VideoBackgroundWrapper() {
  return <VideoBackground />;
}

