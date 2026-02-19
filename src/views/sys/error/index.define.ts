export type IStatus = '403' | '404' | '500'

type IStatusMap = Record<
  IStatus,
  {
    title: string
    icon: 'error' | 'success' | 'warning' | 'info'
  }
>

export const STATUS_MAP: IStatusMap = {
  403: {
    title: '权限不够',
    icon: 'error',
  },
  404: {
    title: '页面不存在',
    icon: 'error',
  },
  500: {
    title: '服务器异常',
    icon: 'error',
  },
}
