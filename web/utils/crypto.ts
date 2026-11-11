const RSA_OAEP: RsaHashedImportParams = { name: 'RSA-OAEP', hash: 'SHA-256' }

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

/**
 * 使用服务端下发的公钥加密登录密码（RSA-OAEP-SHA256）
 */
export async function encryptPassword(password: string) {
  const { publicKey } = await Apis.Auth.getPublicKey()
  const key = await crypto.subtle.importKey(
    'spki',
    base64ToBytes(publicKey),
    RSA_OAEP,
    false,
    ['encrypt'],
  )

  const encrypted = await crypto.subtle.encrypt(
    RSA_OAEP,
    key,
    new TextEncoder().encode(password),
  )

  return bytesToBase64(new Uint8Array(encrypted))
}
