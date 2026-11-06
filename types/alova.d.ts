declare global {
  interface RequestInit {
    /**
     * 是否保留空值（params/data 中的 null、undefined、空字符串）
     */
    keepEmpty?: boolean

    /**
     * 响应数据类型，blob 时返回原始 Response 以便读取文件流
     */
    responseType?: 'json' | 'text' | 'blob'
  }
}

export {}
