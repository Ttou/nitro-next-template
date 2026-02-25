import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3000/openapi-json',
  output: './src/apis',
  plugins: [
    '@hey-api/sdk',
    '@hey-api/typescript',
    '@hey-api/client-axios',
  ],
})
