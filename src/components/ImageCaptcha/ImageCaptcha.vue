<script setup lang="ts">
import { ref } from 'vue'
import { stringProp } from 'vue-ts-types'
import { captchaApi } from '~web/apis'

defineOptions({
  name: 'ImageCaptcha',
})

defineProps({
  captchaValue: stringProp().withDefault(''),
  captchaId: stringProp().withDefault(''),
})

const emit = defineEmits(['update:captchaValue', 'update:captchaId'])

const imgSrc = ref('')

function handleInput(val: string) {
  emit('update:captchaValue', val)
}

async function refresh() {
  const data = await captchaApi.image()

  imgSrc.value = data.captchaImage

  emit('update:captchaId', data.captchaId)
}

refresh()
</script>

<template>
  <div class="imageCaptcha">
    <el-input :model-value="captchaValue" placeholder="请输入验证码" @input="handleInput" />
    <img :src="imgSrc" alt="验证码" style="cursor: pointer;" @click="refresh">
  </div>
</template>

<style scoped>
.imageCaptcha {
  display: flex;
  gap: 10px;
  width: 100%;
}
</style>
