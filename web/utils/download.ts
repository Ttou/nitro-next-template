import type { AxiosResponse } from 'axios'

export function download(res: AxiosResponse) {
  const filename = decodeURIComponent(res.headers['content-disposition']?.split('=')[1])
  const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
