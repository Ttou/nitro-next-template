export const currentUserApi = {
  getInfo() {
    return $fetch('/api/current-user/info')
  },
  getProfile() {
    return $fetch('/api/current-user/profile')
  },
  updateProfile(data: UpdateCurrentUserProfileDto) {
    return $fetch('/api/current-user/updateProfile', { method: 'POST', body: data })
  },
  updatePassword(data: UpdateCurrentUserPasswordDto) {
    return $fetch('/api/current-user/updatePassword', { method: 'POST', body: data })
  },
}
