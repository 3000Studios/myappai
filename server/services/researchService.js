function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function stripTags(value) {
  return decodeHtml(
    value
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

export async function searchWeb(query, limit = 4) {
  if (typeof query !== 'string' || !query.trim()) {
    return []
  }

  const response = await fetch(
    `https://duckduckgo.com/html/?q=${encodeURIComponent(query.trim())}`,
    {
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    }
  )

  if (!response.ok) {
    return []
  }

  const html = await response.text()
  const matches = [
    ...html.matchAll(
      /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g
    ),
  ]

  return matches.slice(0, limit).map((match) => ({
    url: decodeURIComponent(match[1]),
    title: stripTags(match[2]),
  }))
}
