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

const emit = defineEmits(['update:captchaValue', 'update:captchaId', 'enter'])

const imgSrc = ref('')

function handleInput(val: string) {
  emit('update:captchaValue', val)
}

async function refresh() {
  const data = await Apis.Captcha.image()

  imgSrc.value = data.captchaImage

  emit('update:captchaId', data.captchaId)
}

function handleEnter() {
  emit('enter')
}

refresh()
</script>

<template>
  <div class="image-captcha">
    <el-input
      :model-value="captchaValue"
      :placeholder="$t('common.validation.inputCaptcha')"
      @input="handleInput"
      @keyup.enter="handleEnter"
    />
    <img :src="imgSrc" :alt="$t('common.field.captcha')" style="cursor: pointer;" @click="refresh">
  </div>
</template>

<style scoped>
.image-captcha {
  display: flex;
  gap: 10px;
  width: 100%;
}
</style>
