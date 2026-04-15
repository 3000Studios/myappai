function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

async function proxyToAdmin(request, env) {
  if (!env.ADMIN_API_ORIGIN) {
    return jsonResponse(
      {
        status: 'repo-local',
        message:
          'This worker can proxy to the local admin API when ADMIN_API_ORIGIN is configured. Use the Node server for write operations.',
      },
      501
    )
  }

  const url = new URL(request.url)
  const targetUrl = new URL(
    `${url.pathname}${url.search}`,
    env.ADMIN_API_ORIGIN
  )

  return fetch(targetUrl, request)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/health') {
        return jsonResponse({
          status: 'AI system online',
          app: env.APP_NAME ?? 'AI System Manager',
          mode: env.API_MODE ?? 'repo-local',
        })
      }

      return proxyToAdmin(request, env)
    }

    return jsonResponse({
      status: 'AI system online',
      app: env.APP_NAME ?? 'AI System Manager',
      siteOrigin: env.SITE_ORIGIN ?? null,
    })
  },
}
