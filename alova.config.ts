import { defineConfig } from '@alova/wormhole'
import { camelCase } from 'es-toolkit'

export default defineConfig({
  generator: [
    {
      input: 'http://localhost:3000/openapi-json',
      output: 'src/apis',
      handleApi: (apiDescriptor) => {
        return apiDescriptor
      },
    },
  ],
})
