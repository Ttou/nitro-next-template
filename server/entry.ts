import { FastURL, toFetchHandler } from 'srvx/node'
import { expressApp, initNestApp } from './app/main'

initNestApp()

const SERVER_URLS = [
  '/api',
  '/openapi',
]

export default {
  async fetch(request: Request) {
    const { pathname } = new FastURL(request.url)

    if (SERVER_URLS.some(url => pathname.startsWith(url))) {
      if (!expressApp) {
        return new Response('503 Service Unavailable', { status: 503 })
      }
      return toFetchHandler(expressApp)(request)
    }
    return undefined
  },
}
