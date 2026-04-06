export interface JwtClaims {
  /**
   * 唯一标识
   */
  jti: string
  /**
   * 主题, 通常用于表示用户ID
   */
  sub: string
}

export interface JwtPayload {
  /**
   * 唯一标识
   */
  jti: string
  /**
   * 主题, 通常用于表示用户ID
   */
  sub: string
  /**
   * 签发时间
   */
  iat: number
  /**
   * 过期时间
   */
  exp: number
}
