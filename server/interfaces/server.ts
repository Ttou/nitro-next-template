import type { NodeRequest, NodeResponse } from '@nestjs/platform-node'

export interface IRequest extends NodeRequest {}

export interface IResponse extends NodeResponse {}

export type INextFunction = (err?: Error) => void
