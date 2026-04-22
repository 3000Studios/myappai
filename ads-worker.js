/**
 * Cloudflare Worker to serve ads.txt and Hello World
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/ads.txt') {
      const adsTxtContent = 'google.com, pub-5800977493749262, DIRECT, f08c47fec0942fa0'

      return new Response(adsTxtContent, {
        headers: {
          'content-type': 'text/plain; charset=utf-8'
        }
      })
    }

    console.info({ message: 'Hello World Worker received a request!' })
    return new Response('Hello World!')
  }
}
