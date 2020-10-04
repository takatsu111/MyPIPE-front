<template>
  <v-container>
    <v-row no-gutters>
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        cols="12"
        xl="3"
        lg="4"
        md="6"
      >
        <v-card
          class="mx-auto mb-7"
          width="200"
          link
          nuxt
          :to="'/movies/' + movie.id"
        >
          <v-img :src="movie.thumbNail" width="200px" height="auto"></v-img>

          <v-card-text text--primary
            ><div class="text--primary">
              {{ movie.name }}
            </div></v-card-text
          >

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="#06ACB5"
                  v-bind="attrs"
                  x-small
                  @click.stop.prevent
                  v-on="on"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item v-for="(item, i) in items" :key="i" link>
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      items: [
        { text: 'Real-Time', icon: 'mdi-clock' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' },
      ],
      show: false,
    }
  },
  async mounted() {
    this.movies = await this.$axios.$get('/movies')
  },
  methods: {
    clicked() {
      console.log('clicked')
    },
  },
}
</script>

<style>
/* .container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
} */
</style>
