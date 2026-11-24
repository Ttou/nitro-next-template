import type { NodeRequest, NodeResponse } from '@nestjs/platform-node'

export interface IRequest extends NodeRequest {
  /** xlt-token 请求级共享状态，需在多次 createHttpContext 之间保持同一引用 */
  _xltState?: Record<string, unknown>
  /** basic-auth 中间件解析出的凭证 */
  auth?: { user: string, password: string }
}

export interface IResponse extends NodeResponse {}

export type INextFunction = (err?: Error) => void
