<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col sm="12" lg="6">
        <v-text-field
          v-model="keyWord"
          clearable
          solo
          label="検索"
          prepend-inner-icon="mdi-magnify"
        >
          <template v-slot:append>
            <v-btn color="primary" @click="pagination">検索</v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        v-for="movie in movies"
        :key="movie.movie_id"
        cols="12"
        xl="2"
        sm="4"
      >
        <v-card
          class="mx-auto mb-7"
          width="90%"
          link
          nuxt
          :to="'/movies/' + movie.movie_id"
        >
          <v-img
            :src="`http://---/thumbnails/${movie.movie_id}${movie.movie_thumbnail_name}`"
            width="100%"
            aspect-ratio="1.77"
            contain
          ></v-img>

          <v-card-text text--primary class="px-2">
            <IndexMovieName :movie-name="movie.movie_title" />
          </v-card-text>

          <v-card-actions @click.prevent>
            <v-list-item class="px-1" style="width: 100%">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  alt=""
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content style="min-width: 50%; max-width: 50%">
                <v-list-item-title
                  >{{
                    movie.user_name
                  }}eeeeeeeeeeeeekkkkkkkkkkkkk</v-list-item-title
                >
              </v-list-item-content>
              <v-spacer></v-spacer>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="#06ACB5"
                    v-bind="attrs"
                    x-large
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
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-show="paginationShow" justify="center">
      <v-col cols="12">
        <v-container class="max-width">
          <v-pagination
            v-model="page"
            class="my-4"
            :length="length"
            @input="pagination"
          ></v-pagination>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  asyncData({ query }) {
    return {
      page: query.page === undefined ? 1 : parseInt(query.page),
      keyWord: query.keyWord === undefined ? '' : query.keyWord,
    }
  },
  data() {
    return {
      paginationShow: false,
      page: null,
      perPage: 50,
      keyWord: '',
      movies: [],
      count: null,
      items: [{ text: '再生リストに追加', icon: 'mdi-playlist-play' }],
      show: false,
    }
  },
  computed: {
    length() {
      return this.count / this.perPage -
        Math.floor(this.count / this.perPage) ===
        0
        ? Math.floor(this.count / this.perPage)
        : Math.floor(this.count / this.perPage) + 1
    },
  },
  async mounted() {
    await this.getMovies()
    this.paginationShow = true
  },
  methods: {
    async getMovies() {
      const movies = JSON.parse(
        await this.$axios.$get(
          `http://localhost/api/v1/index-movies?page=${this.page}&keyWord=${this.keyWord}`
        )
      )

      this.movies = movies.movies
      this.count = movies.movie_count
    },
    async pagination() {
      window.scrollTo({
        top: 0,
      })
      this.paginationShow = false
      this.$router.push(`?page=${this.page}&keyWord=${this.keyWord}`)
      await this.getMovies()
      this.paginationShow = true
    },
  },
}
</script>
