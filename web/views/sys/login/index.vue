<script setup lang="ts">
import type { PlusColumn } from 'plus-pro-components'

import type { LoginReqDto } from '~web/apis/globals'
import { Icon } from '@iconify/vue'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { loginReqSchema } from '~shared/dtos'
import { ImageCaptcha } from '~web/components'
import { useUserStore } from '~web/store'
import { zodFormRules } from '~web/utils'

defineOptions({
  name: 'LoginView',
})

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const formRef = useTemplateRef('formRef')
const formModel = ref<LoginReqDto>({
  userName: '',
  password: '',
  captchaId: '',
  captchaValue: '',
})

/**
 * 登录表单校验
 *
 * 直接复用服务端 `loginReqSchema`（已含 trim），保证两端规则一致
 */
const formRules = zodFormRules(loginReqSchema())

const formColumns = computed<PlusColumn[]>(() => [
  {
    label: '账号',
    hasLabel: false,
    prop: 'userName',
    fieldProps: {
      placeholder: '请输入账号',
    },
  },
  {
    label: '密码',
    hasLabel: false,
    prop: 'password',
    fieldProps: {
      placeholder: '请输入密码',
      type: 'password',
      showPassword: true,
    },
  },
  {
    label: '验证码',
    hasLabel: false,
    prop: 'captchaValue',
  },
])

async function handleLogin() {
  loading.value = true

  try {
    await userStore.login(formModel.value)

    loading.value = false

    router.replace({
      path: '/',
      // TODO
    })
  }
  catch {
    loading.value = false
  }
}

async function handleEnter() {
  const valid = await formRef.value?.handleSubmit()

  if (valid) {
    handleLogin()
  }
}
</script>

<template>
  <div class="view">
    <div class="form">
      <div class="form-header">
        <Icon icon="ep:monitor" />
      </div>
      <plus-form
        ref="formRef"
        v-model="formModel"
        :columns="formColumns"
        :rules="formRules"
        size="large"
        @submit="handleLogin"
      >
        <template #plus-field-captchaValue>
          <ImageCaptcha
            v-model:captcha-id="formModel.captchaId"
            v-model:captcha-value="formModel.captchaValue"
            @enter="handleEnter"
          />
        </template>
        <template #footer="{ handleSubmit }">
          <div class="form-footer">
            <el-button class="login-btn" type="primary" :loading="loading" @click="handleSubmit">
              {{ '登录' }}
            </el-button>
          </div>
        </template>
      </plus-form>
    </div>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  .form {
    width: 400px;
    height: 300px;

    .form-header {
      font-size: 84px;
      color: var(--el-color-primary);
      text-align: center;
    }

    .form-footer {
      width: 100%;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
