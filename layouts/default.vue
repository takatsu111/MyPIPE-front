<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-divider />
      <v-list nav>
        <v-list-item>
          <v-list-item-title class="title" height="64">
            Application
          </v-list-item-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="drawer = !drawer">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-list-item-grout>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-web</v-icon>
            </v-list-item-icon>
            <v-list-item-title>動画一覧</v-list-item-title>
          </v-list-item>
          <v-list-item to="/mypage/movies">
            <v-list-item-icon>
              <v-icon>mdi-movie-open-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>動画を投稿</v-list-item-title>
          </v-list-item>
          <v-list-item to="/mypage/channels">
            <v-list-item-icon>
              <v-icon>mdi-playlist-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>登録チャンネル一覧</v-list-item-title>
          </v-list-item>
          <v-list-item to="/mypage/movie-lists">
            <v-list-item-icon>
              <v-icon>mdi-playlist-play</v-icon>
            </v-list-item-icon>
            <v-list-item-title>再生リスト一覧</v-list-item-title>
          </v-list-item>
        </v-list-item-grout>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#06ACB5" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title color="white"
        ><a href="/" style="color: white">MyPIPE</a></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <template v-if="isLoggedIn">
        <v-img
          max-height="50"
          max-width="50"
          contain
          src="https://imgsv.nikon-image.com/products/mirrorless/lineup/z_50/img/sample/pic_01_l.jpg"
          class="mr-5"
        ></v-img>
        <div class="mr-5">
          {{ user.user_name }}
        </div>
      </template>
      <template v-else>
        <v-btn nuxt link to="/login" text> ログイン </v-btn>
      </template>
      <span></span>
    </v-app-bar>

    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      user: {
        user_name: null,
      },
      menus: [{ title: 'Top', icon: 'mdi-web', url: '/' }],
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'home',
          title: 'Index',
          to: '/',
        },
        {
          icon: 'person',
          title: 'profile',
          to: '/profile',
        },
        {
          icon: 'list_alt',
          title: 'articles',
          to: '/articles',
        },
      ],
      miniVariant: false,
      expandOnHover: true,
      title: 'H-UENO',
    }
  },
  computed: {
    isLoggedIn() {
      return this.$auth.loggedIn
    },
  },
  watch: {
    async isLoggedIn() {
      if (this.isLoggedIn) {
        this.user = await this.$axios.$get(`http://localhost/auth/api/v1/user`)
      }
    },
  },
}
</script>

<style>
/* html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
} */
</style>
