import { generateKeyPairSync } from 'node:crypto'
import { createHMAC, createSHA256 } from 'hash-wasm'

async function run() {
  const hashFunc = createSHA256()
  const hmac = await createHMAC(hashFunc, 'jwt')

  const keys = ['2026-08']

  const secrets = keys.map((data) => {
    hmac.init()
    hmac.update(data)
    return hmac.digest()
  })

  console.log('secrets:', secrets)

  // 登录密码加密密钥对，配置到环境变量 AUTH_RSA_PUBLIC_KEY / AUTH_RSA_PRIVATE_KEY
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })

  console.log('AUTH_RSA_PUBLIC_KEY:', publicKey)
  console.log('AUTH_RSA_PRIVATE_KEY:', privateKey)
}
run()
