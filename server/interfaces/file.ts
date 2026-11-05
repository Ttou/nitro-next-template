/**
 * multer 磁盘存储模式下的上传文件
 */
export interface IUploadedFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
}
