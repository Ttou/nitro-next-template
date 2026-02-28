import { FastURL, toFetchHandler } from 'srvx/node'
import { serverApp, initNestApp } from './app/main'

initNestApp()

const SERVER_URLS = [
  '/api',
  '/bull',
  '/dev',
  '/openapi',
]

export default {
  async fetch(request: Request) {
    const { pathname } = new FastURL(request.url)

    if (SERVER_URLS.some(url => pathname.startsWith(url))) {
      if (!serverApp) {
        return new Response('503 Service Unavailable', { status: 503 })
      }
      return toFetchHandler(serverApp)(request)
    }
    return undefined
  },
}
