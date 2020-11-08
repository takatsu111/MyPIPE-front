<template>
  <v-app>
    <v-snackbar v-model="messageShown" timeout="4000">
      {{ showMessageText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="messageShown = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
            MENU
          </v-list-item-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="drawer = !drawer">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>

        <v-list-item-grout>
          <v-list-item to="/" @click="drawer = !drawer">
            <v-list-item-icon>
              <v-icon>mdi-web</v-icon>
            </v-list-item-icon>
            <v-list-item-title>動画一覧</v-list-item-title>
          </v-list-item>
          <v-list-item to="/mypage/movies" @click="drawer = !drawer">
            <v-list-item-icon>
              <v-icon>mdi-movie-open-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>動画を投稿</v-list-item-title>
          </v-list-item>
          <v-list-item to="/mypage/movie-lists" @click="drawer = !drawer">
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
        ><a href="/" style="color: white">MyMovies</a></v-toolbar-title
      >
      <v-spacer></v-spacer>
      <template v-if="isLoggedIn">
        <v-img
          v-if="user.user_profile_image_name !== ''"
          max-width="50px"
          max-height="50px"
          class="mr-3"
          style="border-radius: 50%"
          :src="`${$store.state.resourcesURL.resourcesURL}/profile_images/${user.user_id}/${user.user_profile_image_name}`"
        ></v-img>
        <v-icon v-else class="mr-3" style="font-size: 40px"
          >mdi-account-circle</v-icon
        >
        <v-btn nuxt link to="/mypage" text
          ><span
            style="width: 60px; overflow: hidden; text-transform: none"
            class="text-center"
            >MyPage</span
          ></v-btn
        >
        <v-btn text @click="logout">ログアウト</v-btn>
      </template>
      <template v-else>
        <v-btn nuxt link to="/login" text> ログイン </v-btn>
        <v-btn nuxt link to="/new" text> 新規登録 </v-btn>
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
      messageShown: false,
      showMessageText: '',
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
        await this.getUserData()
      }
    },
  },
  async created() {
    this.setListener()
    if (this.isLoggedIn) {
      await this.getUserData()
    }
  },
  methods: {
    async getUserData() {
      this.user = await this.$axios.$get(`/auth/api/v1/user`)
    },
    setListener() {
      this.$nuxt.$on('showMessage', this.showMessage)
      this.$nuxt.$on('getUserData', this.getUserData)
    },
    showMessage(message) {
      this.messageShown = false
      const self = this
      this.$nextTick(() => {
        self.messageShown = true
        self.showMessageText = message
      })
    },
    logout() {
      this.$auth.logout()
      this.showMessage('ログアウトが完了しました。')
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
