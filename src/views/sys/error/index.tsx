import { ElButton, ElResult } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import { type IStatus, STATUS_MAP } from './index.define'

export default defineComponent({
  name: 'ErrorView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const status = computed(() => {
      return (route.query.status ?? '404') as IStatus
    })

    const subTitle = computed(() => STATUS_MAP[status.value].title)

    const icon = computed(() => STATUS_MAP[status.value].icon)

    function handleClick() {
      router.replace('/')
    }

    return {
      status,
      subTitle,
      icon,
      handleClick,
    }
  },
  render() {
    return (
      <ElResult title={this.status} subTitle={this.subTitle} icon={this.icon}>
        {{
          extra: () => (
            <ElButton type="primary" onClick={this.handleClick}>
              返回首页
            </ElButton>
          ),
        }}
      </ElResult>
    )
  },
})
