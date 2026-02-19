export const captchaApi = {
  image() {
    return $fetch('/api/captcha/image', { method: 'GET' })
  },
}
