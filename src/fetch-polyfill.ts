import { ElMessage } from 'element-plus'
import { ofetch } from 'ofetch'

const $fetch = ofetch.create({
  onRequest: ({ options }) => {
    const userStore = useUserStore()

    if (userStore.token) {
      options.headers.set('authorization', `Bearer ${userStore.token}`)
    }
  },
  async onRequestError({ request, options, error }) {
    console.log('[fetch request error]', request, error)
  },
  async onResponse({ request, response, options }) {
    console.log('[fetch response]', request, response.status, response._data)

    if (!response._data.success) {
      if (response._data.code === 401) {
        const userStore = useUserStore()

        ElMessage.error({
          message: response._data.msg,
          onClose: () => {
            userStore.clear().then(() => {
              window.location.reload()
            })
          },
        })
      }
      else {
        ElMessage.error(response._data.msg)
      }
    }
    else {
      response._data = response._data.data
    }
  },
})

// @ts-ignore
globalThis.$fetch = $fetch
