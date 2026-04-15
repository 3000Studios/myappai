'use client';

import { useState } from 'react';

export default function PreviewFrame() {
  const [content, setContent] = useState<string>('');

  return (
    <div className="preview-frame">
      <h2 className="title">Preview</h2>
      <textarea
        className="text-area"
        placeholder="Code or config preview appears here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}

