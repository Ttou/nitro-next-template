<script setup lang="ts">
import { computed } from 'vue'
import { LangEnum } from '~shared/enums'
import { useAppStore } from '~web/store'

defineOptions({
  name: 'LangSelect',
})

const appStore = useAppStore()

const locale = computed(() => appStore.locale)

const langOptions = LangEnum.toList()

function handleChange(val: any) {
  appStore.setLocale(val)
}
</script>

<template>
  <el-select
    class="lang-select"
    :model-value="locale"
    size="small"
    :filterable="false"
    :options="langOptions"
    @change="handleChange"
  />
</template>

<style scoped>
.lang-select {
  width: 100px;
}
</style>
