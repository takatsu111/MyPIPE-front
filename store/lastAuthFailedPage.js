export const state = () => ({
  lastAuthFailedURL: '',
})

export const mutations = {
  set(state, url) {
    state.lastAuthFailedURL = url
  },
  reset(state) {
    state.lastAuthFailedURL = ''
  },
}
