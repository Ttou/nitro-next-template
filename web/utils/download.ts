export async function download(res: Blob | Response) {
  // 接口类型声明为 Blob，fetch 适配器实际返回原始 Response
  let headers: Headers | undefined
  let blob = res as Blob

  if (res instanceof Response) {
    headers = res.headers
    blob = await res.blob()
  }

  const filename = decodeURIComponent(headers?.get('content-disposition')?.split('=')[1] ?? '')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
