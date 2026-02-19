import { ElInput } from 'element-plus'
import { defineComponent, ref } from 'vue'

import { stringProp } from 'vue-ts-types'
import styles from './ImageCaptcha.module.css'

export default defineComponent({
  name: 'ImageCaptcha',
  props: {
    captchaValue: stringProp().withDefault(''),
    captchaId: stringProp().withDefault(''),
  },
  emits: ['update:captchaValue', 'update:captchaId'],
  setup(_, { emit }) {
    const imgSrc = ref('')

    async function refresh() {
      const data = await captchaApi.image()

      imgSrc.value = data.captchaImage

      emit('update:captchaId', data.captchaId)
    }

    refresh()

    return {
      imgSrc,
      refresh,
    }
  },
  render() {
    return (
      <div class={styles.imageCaptcha}>
        <ElInput modelValue={this.captchaValue} placeholder="请输入验证码" onInput={e => this.$emit('update:captchaValue', e)} />
        <img src={this.imgSrc} onClick={this.refresh} style={{ cursor: 'pointer' }} />
      </div>
    )
  },
})
