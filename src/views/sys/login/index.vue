<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { PlusColumn } from 'plus-pro-components'
import type { LoginReqDto } from '~web/apis'

import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ImageCaptcha } from '~web/components'
import { useUserStore } from '~web/store'

defineOptions({
  name: 'LoginView',
})

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const formModel = ref<LoginReqDto>({
  userName: '',
  password: '',
  captchaId: '',
  captchaValue: '',
})

const formRules = ref<FormRules<LoginReqDto>>({
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

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
</script>

<template>
  <div class="view">
    <div class="form">
      <div class="form-header">
        <Icon icon="ep:monitor" />
      </div>
      <plus-form
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
          />
        </template>
        <template #footer="{ handleSubmit }">
          <div class="form-footer">
            <el-button class="login-btn" type="primary" @click="handleSubmit">
              登录
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
