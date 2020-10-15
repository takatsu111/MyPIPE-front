export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.headers.Authorization = window.localStorage.getItem(
      'auth._token.local'
    )
  })
  $axios.onError((error) => {
    if (error.response.status === 401) {
      redirect('/login')
    }
  })
}
