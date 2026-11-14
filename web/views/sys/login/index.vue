<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { PlusColumn } from 'plus-pro-components'

import type { LoginReqDto } from '~web/apis/globals'
import { Icon } from '@iconify/vue'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { ImageCaptcha } from '~web/components'
import { t } from '~web/i18n'
import { useUserStore } from '~web/store'

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

const formRules = ref<FormRules<LoginReqDto>>({
  userName: [
    {
      required: true,
      message: t('common.validation.inputAccount'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('common.validation.inputPassword'),
      trigger: 'blur',
    },
  ],
  captchaValue: [
    {
      required: true,
      message: t('common.validation.inputCaptcha'),
      trigger: 'blur',
    },
  ],
})

const formColumns = computed<PlusColumn[]>(() => [
  {
    label: t('common.field.account'),
    hasLabel: false,
    prop: 'userName',
    fieldProps: {
      placeholder: t('common.validation.inputAccount'),
    },
  },
  {
    label: t('common.field.password'),
    hasLabel: false,
    prop: 'password',
    fieldProps: {
      placeholder: t('common.validation.inputPassword'),
      type: 'password',
      showPassword: true,
    },
  },
  {
    label: t('common.field.captcha'),
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
              {{ $t('common.button.login') }}
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
