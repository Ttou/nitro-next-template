import { joinURL } from 'ufo'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'RedirectView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const { params, query } = route
    const path = params.path as string

    router.replace({
      path: joinURL('/', path),
      query,
    })
  },
  render() {
    return <section></section>
  },
})
