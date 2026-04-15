/**
 * Affiliate Link Injection Engine
 * Auto-monetize content with affiliate links
 */

export function injectAffiliateLinks(content: string): string {
  const affiliateMappings = [
    {
      keyword: /Amazon/gi,
      link: '<a href="https://amazon.com/?tag=3000studios-20" class="text-yellow-400 hover:underline">Amazon</a>',
    },
    {
      keyword: /YouTube/gi,
      link: '<a href="https://youtube.com" class="text-yellow-400 hover:underline">YouTube</a>',
    },
  ];

  let processed = content;

  for (const mapping of affiliateMappings) {
    processed = processed.replace(mapping.keyword, mapping.link);
  }

  return processed;
}

export function trackAffiliateClick(link: string) {
  console.log(`Affiliate click tracked: ${link}`);
  // Send to analytics
}

