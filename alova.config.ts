import { defineConfig } from '@alova/wormhole'

export default defineConfig({
  generator: [
    {
      input: 'http://localhost:3000/openapi-json',
      output: 'src/api',
      handleApi: (apiDescriptor) => {
        const [controllerName, handlerName] = apiDescriptor.operationId!.split('_')
        apiDescriptor.tags = [controllerName!.replace('Controller', '')]
        apiDescriptor.operationId = handlerName

        return apiDescriptor
      },
    },
  ],
})
