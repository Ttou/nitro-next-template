import { joinURL } from 'ufo'

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
