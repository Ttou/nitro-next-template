import axios from 'axios'
import { ElMessage } from 'element-plus'
import { isEmpty, omitBy } from 'es-toolkit/compat'

import { useUserStore } from '~web/store'

const ajax = axios.create({})

function omitEmpty(data: Record<string, any>) {
  return omitBy(data, v => v === null || v === undefined || v === '')
}

ajax.interceptors.request.use((req) => {
  const userStore = useUserStore()

  if (userStore.token) {
    req.headers!.Authorization = `Bearer ${userStore.token}`
  }

  if (!req.keepEmpty) {
    if (!isEmpty(req.params)) {
      req.params = omitEmpty(req.params)
    }
    if (!isEmpty(req.data)) {
      req.data = omitEmpty(req.data)
    }
  }

  return req
})

ajax.interceptors.response.use(
  (res) => {
    return res.data.data
  },
  (err) => {
    const res = err.response

    if (res.status === 422) {
      if (res.data.message) {
        ElMessage.error({
          message: res.data.message,
          duration: 1500,
        })
      }
      else {
        const file = new FileReader()
        file.readAsText(res.data)
        file.onload = () => {
          const res = JSON.parse(file.result as string)
          ElMessage.error({
            message: res.message,
            duration: 1500,
          })
        }
      }
    }
    else {
      ElMessage.error({
        message: res.data.message,
        duration: 1500,
        onClose: () => {
          if (res.status === 401 || res.data.status === 401) {
            const userStore = useUserStore()

            userStore.clear().then(() => {
              location.reload()
            })
          }
        },
      })
    }

    return Promise.reject(err)
  },
)

export { ajax }
