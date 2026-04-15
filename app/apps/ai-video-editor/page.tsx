import { AppLanding } from '../_components/AppLanding';

export default function Page() {
  return (
    <AppLanding
      title="AI Video Editor & Shorts Generator"
      subtitle="Turn long-form into viral shorts automatically—hooks, captions, cuts, and exports for every platform."
      price="$147"
      compareAt="$297"
      productId="prod_video_ai_editor"
      heroBadge="Creator Growth • Viral Ready"
      bulletPoints={[
        'Auto-detect highlights + punchy hooks',
        'Styled captions with emojis, colors, brand kit',
        'Multi-platform exports: TikTok, Shorts, Reels',
        '500 videos/month included',
        'AI clip selection + silence trimming',
      ]}
      highlights={[
        'Speed: Batch process episodes in minutes',
        'Engagement: Hook library and CTA overlays',
        'Quality: 1080p/4K exports with brand-safe templates',
      ]}
      audience={[
        'Creators and podcasters repurposing long-form',
        'Agencies delivering short-form at scale',
        'Brands turning webinars into social clips',
      ]}
      faq={[
        { q: 'Do I get caption styles?', a: 'Yes—preset styles plus brand color input.' },
        { q: 'Is there a free tier?', a: 'No. Purchase required; access unlocks post-checkout.' },
        { q: 'Can I export in 4K?', a: 'Yes. 1080p and 4K supported.' },
      ]}
    >
      <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
        <h2 className="text-xl font-bold text-amber-200 mb-3">Clip factory kit</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-100/90">
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Hook detector + auto-cut
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            B-roll slots with stock suggestions
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            CTA overlays & end screens
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Silence trimming + jump cut smoothing
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Platform-safe aspect ratios
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Batch export queue
          </div>
        </div>
      </div>
    </AppLanding>
  );
}

