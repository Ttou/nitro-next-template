import type { INextFunction, IRequest, IResponse } from '~server/interfaces'

export function html() {
  return function (req: IRequest, res: IResponse, next: INextFunction) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    next()
  }
}
