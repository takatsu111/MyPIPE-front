export const state = () => ({
  loggedInUserId: null,
})

export const mutations = {
  set(state, userId) {
    state.loggedInUserId = userId
  },
}
