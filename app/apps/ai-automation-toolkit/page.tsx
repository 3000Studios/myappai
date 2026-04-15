import { AppLanding } from '../_components/AppLanding';

export default function Page() {
  return (
    <AppLanding
      title="AI Automation Toolkit"
      subtitle="End-to-end AI automations across content, support, and ops. Ship workflows once, run them forever."
      price="$497"
      compareAt="$997"
      productId="prod_ai_automation"
      heroBadge="Best Seller • Agency & SaaS"
      bulletPoints={[
        'Multi-agent workflows: content, customer support, analytics',
        'Prebuilt blueprints for onboarding, NPS, renewals, upsells',
        'API-ready: ChatGPT, Claude, Gemini, Groq, webhooks',
        'White-label handoff for client delivery',
        'Security-first: rate limits, audit logs, role control',
      ]}
      highlights={[
        'Speed: Stand up automations in hours, not weeks',
        'Revenue: Proven upsell + retention sequences included',
        'Scale: Cloud-native with queue/retry patterns',
      ]}
      audience={[
        'Agencies productizing AI services',
        'SaaS teams automating CS, renewal, upsell',
        'Creators spinning up AI assistants for their audience',
      ]}
      faq={[
        {
          q: 'Do I get templates?',
          a: 'Yes, workflow blueprints, prompts, and API payload examples are included.',
        },
        {
          q: 'Is it self-hosted?',
          a: 'You can run on your infra or use our cloud-first defaults.',
        },
        {
          q: 'How is access gated?',
          a: 'Purchase is required. Delivery and keys are provided post-checkout.',
        },
      ]}
    >
      <div className="p-6 rounded-2xl border border-amber-300/30 bg-white/5 backdrop-blur-xl shadow-2xl">
        <h2 className="text-xl font-bold text-amber-200 mb-3">Included launch kits</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-100/90">
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Support desk copilot + auto-reply
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Onboarding & renewal nudge flows
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Content pipeline: briefs → drafts → publish
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Lead capture + enrichment + routing
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Voice-to-action “Matrix” control hooks
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-amber-200/20">
            Audit + logging scaffolds for clients
          </div>
        </div>
      </div>
    </AppLanding>
  );
}

