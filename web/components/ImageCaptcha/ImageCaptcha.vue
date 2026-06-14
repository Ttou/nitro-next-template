<script setup lang="ts">
import { ref } from 'vue'
import { string } from 'vue-types'

defineOptions({
  name: 'ImageCaptcha',
})

defineProps({
  captchaValue: string().def(''),
  captchaId: string().def(''),
})

const emit = defineEmits(['update:captchaValue', 'update:captchaId'])

const imgSrc = ref('')

function handleInput(val: string) {
  emit('update:captchaValue', val)
}

async function refresh() {
  const data = await Apis.Captcha.image()

  imgSrc.value = data.captchaImage

  emit('update:captchaId', data.captchaId)
}

refresh()
</script>

<template>
  <div class="image-captcha">
    <el-input :model-value="captchaValue" placeholder="请输入验证码" @input="handleInput" />
    <img :src="imgSrc" alt="验证码" style="cursor: pointer;" @click="refresh">
  </div>
</template>

<style scoped>
.image-captcha {
  display: flex;
  gap: 10px;
  width: 100%;
}
</style>
