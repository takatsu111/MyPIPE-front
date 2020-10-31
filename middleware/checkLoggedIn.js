export default function ({ store, redirect }) {
  const data = store.$auth.loggedIn
  if (!data) {
    redirect('/login')
  }

  const isTokenExists = store.$auth.getToken('local')
  if (isTokenExists) {
    const token = isTokenExists.split(' ')[1]
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const tokenExp = JSON.parse(decodeURIComponent(escape(window.atob(base64))))
      .exp
    const nowTimestamp = new Date().getTime() / 1000
    if (tokenExp < nowTimestamp) {
      redirect('/login')
    }
  }
}
