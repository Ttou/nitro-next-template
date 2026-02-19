export const authApi = {
  login(data: LoginDto) {
    return $fetch('/api/auth/login', { method: 'POST', body: data })
  },
  logout() {
    return $fetch('/api/auth/logout', { method: 'POST' })
  },
}
