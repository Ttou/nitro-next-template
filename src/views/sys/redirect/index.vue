<script setup lang="ts">
import { joinURL } from 'ufo'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'RedirectView',
})

const route = useRoute()
const router = useRouter()

const { params, query } = route
const path = params.path as string

router.replace({
  path: joinURL('/', path),
  query,
})
</script>

<template>
  <section />
</template>
