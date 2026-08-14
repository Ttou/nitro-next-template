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
}
run()
