import { AppLanding } from '../_components/AppLanding';

export default function Page() {
  return (
    <AppLanding
      title="AI Content Writer Pro"
      subtitle="SEO-grade, brand-safe longform, social, and email—on autopilot. 100K words/month included."
      price="$97"
      compareAt="$197"
      productId="prod_content_ai_writer"
      heroBadge="Fast ROI • Marketers"
      bulletPoints={[
        '50+ ready-made templates (blog, social, email, ads)',
        'Tone + brand voice controls with guardrails',
        'Built-in SEO scoring and outline assist',
        'Plagiarism + originality checks',
        'Batch mode for campaigns and content calendars',
      ]}
      highlights={[
        'SEO wins: SERP-focused briefs + schema hints',
        'Brand safety: tone locks and anti-drift prompts',
        'Ops: batch generation + export (PDF/DOCX/HTML)',
      ]}
      audience={[
        'Content teams and agencies',
        'Solo creators needing scale',
        'Ecom and SaaS marketers shipping weekly',
      ]}
      faq={[
        { q: 'Do I need API keys?', a: 'No—managed for you. Bring-your-own-key optional.' },
        { q: 'Can I export?', a: 'Yes: PDF, DOCX, HTML.' },
        { q: 'Is access free?', a: 'No. Purchase is required; access unlocks post-checkout.' },
      ]}
    >
      <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
        <h2 className="text-xl font-bold text-amber-200 mb-3">Campaign accelerators</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-100/90">
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Blog outlines → drafts → meta → schema
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Social packs per platform + hooks
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Email sequences for launches and onboarding
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            CTA and headline multivariate options
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Brand voice snapshots for teams
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Calendar exports to CMS
          </div>
        </div>
      </div>
    </AppLanding>
  );
}

