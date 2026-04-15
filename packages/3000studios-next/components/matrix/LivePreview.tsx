'use client';

interface LivePreviewProps {
  preview?: string;
  diff?: string;
}

export default function LivePreview({ preview, diff }: LivePreviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gold mb-2">Live Preview</h3>
        <div className="bg-black/60 p-4 rounded border border-sapphire min-h-[100px]">
          <pre className="text-white whitespace-pre-wrap">{preview || 'No preview available.'}</pre>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gold mb-2">Diff</h3>
        <div className="bg-black/60 p-4 rounded border border-sapphire min-h-[100px]">
          <pre className="text-white whitespace-pre-wrap">{diff || 'No diff available.'}</pre>
        </div>
      </div>
    </div>
  );
}

