import { t } from '~web/i18n'

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
    title: t('sys.error.forbidden'),
    icon: 'error',
  },
  404: {
    title: t('sys.error.notFound'),
    icon: 'error',
  },
  500: {
    title: t('sys.error.serverError'),
    icon: 'error',
  },
}
