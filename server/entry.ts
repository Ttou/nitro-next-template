import { FastURL, toFetchHandler } from 'srvx/node'
import { app } from './app/main'

const SERVER_URLS = [
  '/api',
  '/scalar',
  '/swagger',
]

let fetchHandler: ReturnType<typeof toFetchHandler> | null = null

export default {
  async fetch(request: Request) {
    const { pathname } = new FastURL(request.url)

    if (SERVER_URLS.some(url => pathname.startsWith(url))) {
      if (!fetchHandler) {
        const instance = app.getHttpAdapter().getInstance()
        fetchHandler = toFetchHandler(instance)
      }
      return fetchHandler(request)
    }
    return undefined
  },
}
