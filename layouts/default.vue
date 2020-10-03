<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      :expandOnHover="expandOnHover"
      fixed
      app
    >
      <v-divider />
      <v-list nav>
        <v-list-item>
          <v-list-item-title class="title" height="64">
            Application
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-for="menu in menus" :key="menu.title" :to="menu.url">
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <header>
        <v-app-bar color="#06ACB5" dark>
          <v-toolbar-title color="white">MyPIPE</v-toolbar-title>
        </v-app-bar>
      </header>
      <Nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        { title: 'Index', icon: 'mdi-web', url: '/' },
        { title: 'Home', icon: 'mdi-home', url: '/home' },
        { title: 'Favorites', icon: 'mdi-heart', url: '/favorites' },
        { title: 'About', icon: 'mdi-information-variant', url: '/about' },
      ],
      clipped: false,
      drawer: true,
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
