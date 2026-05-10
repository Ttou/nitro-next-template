import { exec, spawn } from 'node:child_process'
import { platform } from 'node:os'
import { env, exit } from 'node:process'

async function run() {
  const isWindows = platform() === 'win32'
  const isPowerShell = env.PSModulePath !== undefined

  if (isWindows && isPowerShell) {
    await new Promise<void>((resolve) => {
      exec('chcp 65001', () => resolve())
    })
  }

  const child = spawn('cross-env APP_ENV=dev vite', [], {
    stdio: 'inherit',
    shell: true,
  })

  child.on('error', (err) => {
    console.error('Failed to start dev server:', err)
    exit(1)
  })
}

run()
