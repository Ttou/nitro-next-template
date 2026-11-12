import { generateKeyPairSync } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHMAC, createSHA256 } from 'hash-wasm'

// 与 resource/.env.deploy、package.json 一起作为部署产物源；build:server 会把整个 secrets/ 目录复制到 .server/
const PUBLIC_KEY_FILE = 'resource/secrets/auth-rsa-public.pem'
const PRIVATE_KEY_FILE = 'resource/secrets/auth-rsa-private.pem'
const JWT_KEYS_FILE = 'resource/secrets/jwt-keys.json'

// kid 需与 server/configs/configuration.ts 中 createJwtStrategyConfig 的 activeKid 一致
const JWT_KIDS = ['2026-08']

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicKeyPath = resolve(rootDir, PUBLIC_KEY_FILE)
const privateKeyPath = resolve(rootDir, PRIVATE_KEY_FILE)
const jwtKeysPath = resolve(rootDir, JWT_KEYS_FILE)

async function run() {
  await mkdir(dirname(jwtKeysPath), { recursive: true })

  // 登录密码加密密钥对，写入 resource/secrets/ 供服务端与构建产物按文件路径读取
  if (existsSync(publicKeyPath) || existsSync(privateKeyPath)) {
    console.log('RSA 密钥文件已存在，未覆盖：')
    console.log(`  ${PUBLIC_KEY_FILE}`)
    console.log(`  ${PRIVATE_KEY_FILE}`)
  }
  else {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    })

    await writeFile(publicKeyPath, publicKey, { encoding: 'utf8', mode: 0o644 })
    await writeFile(privateKeyPath, privateKey, { encoding: 'utf8', mode: 0o600 })

    console.log('登录 RSA 密钥对已写入：')
    console.log(`  ${PUBLIC_KEY_FILE}`)
    console.log(`  ${PRIVATE_KEY_FILE}`)
  }

  // JWT 签名密钥，写入 resource/secrets/jwt-keys.json 供 createJwtStrategyConfig 读取
  if (existsSync(jwtKeysPath)) {
    console.log('JWT keys 已存在，未覆盖：')
    console.log(`  ${JWT_KEYS_FILE}`)
  }
  else {
    const hmac = await createHMAC(createSHA256(), 'jwt')
    const keys = JWT_KIDS.map((kid) => {
      hmac.init()
      hmac.update(kid)
      return {
        kid,
        algorithm: 'HS256',
        secret: hmac.digest(),
      }
    })

    await writeFile(jwtKeysPath, `${JSON.stringify(keys, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })

    console.log('JWT keys 已写入：')
    console.log(`  ${JWT_KEYS_FILE}`)
  }

  console.log('dev 直接读取 resource/secrets/；build:server 会把整个目录复制到 .server/secrets/ 供 prod 使用')
  console.log('resource/secrets/ 下的文件包含私钥，请勿提交到公开仓库')
  console.log('如需重新生成，请先手动删除对应文件')
}
run()
