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
    <v-row>
      <v-col cols="12" xl="2" sm="4">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-sort</v-icon>
              並べ替え
            </v-btn>
          </template>
          <v-list>
            <v-list-item link @click="orderMoviesByPostedDay('desc')">
              <v-list-item-title>投稿日(新しい順)</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="orderMoviesByPostedDay('asc')">
              <v-list-item-title>投稿日(古い順)</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <template v-if="getMoviesComplete">
      <v-row>
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
              :src="`http://d100q3wt0wdr5h.cloudfront.net/thumbnails/${movie.movie_id}${movie.movie_thumbnail_name}`"
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
                  <v-list-item-title>{{ movie.user_name }}</v-list-item-title>
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
                    <v-list-item
                      v-for="(item, i) in items"
                      :key="i"
                      link
                      @click="openAddPlayListMovieDialog(movie.movie_id)"
                    >
                      <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.text"
                        ></v-list-item-title>
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
      <v-dialog
        v-model="playListDialog"
        width="100%"
        max-width="500px"
        style="background: white; position: relative"
        scrollable
      >
        <v-card style="background: white; position: relative" height="100%">
          <v-card-title>再生リストに追加</v-card-title>
          <v-divider></v-divider>
          <v-btn
            icon
            style="position: absolute; right: 10px; top: 10px"
            @click="closeAddPlayListMovieDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-list width="=100%" max-width="100%">
            <v-list-item
              v-for="playList in playLists"
              :key="playList.play_list_id"
              style="width: 100%"
            >
              <v-list-item-content>
                <v-list-item-title>{{
                  playList.play_list_name
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  v-if="playList.play_list_movies.length == 0"
                  color="primary"
                  :disabled="playListMovieModifing"
                  :loading="playListMovieModifing"
                  @click="addPlayListMovie(playList.play_list_id)"
                  >再生リストに追加する</v-btn
                >
                <v-btn
                  v-else
                  color="error"
                  :disabled="playListMovieModifing"
                  :loading="playListMovieModifing"
                  @click="
                    deletePlayListMovie(
                      playList.play_list_id,
                      playList.play_list_movies[0].movie_id
                    )
                  "
                  >再生リストから削除する</v-btn
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </template>
    <template v-else>
      <v-row justify="center">
        <v-progress-circular
          :size="70"
          indeterminate
          color="green"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-container>
</template>

<script>
export default {
  asyncData({ query }) {
    return {
      page: query.page === undefined ? 1 : parseInt(query.page),
      keyWord: query.keyWord === undefined ? '' : query.keyWord,
      moviesOrderByPostedDay: query.order === undefined ? 'asc' : query.order,
    }
  },
  data() {
    return {
      getMoviesComplete: true,
      paginationShow: false,
      page: 1,
      perPage: 24,
      keyWord: '',
      movies: [],
      count: null,
      items: [{ text: '再生リストに追加', icon: 'mdi-playlist-play' }],
      show: false,
      playListDialog: false,
      playLists: [],
      playListMovieModifing: false,
      menuClickedMovieId: null,
      moviesOrderByPostedDay: 'asc',
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
      this.getMoviesComplete = false
      const movies = JSON.parse(
        await this.$axios.$get(
          `http://localhost/api/v1/index-movies?page=${this.page}&keyWord=${this.keyWord}&order=${this.moviesOrderByPostedDay}`
        )
      )

      this.movies = movies.movies
      this.count = movies.movie_count

      this.getMoviesComplete = true
    },
    async orderMoviesByPostedDay(order) {
      this.moviesOrderByPostedDay = order
      await this.pagination()
    },
    async pagination() {
      this.$router.push(
        `?page=${this.page}&keyWord=${this.keyWord}&order=${this.moviesOrderByPostedDay}`
      )
      await this.getMovies()
      window.scrollTo({
        top: 0,
      })
    },
    async getPlayLists(movieId) {
      const responseData = JSON.parse(
        await this.$axios.$get(
          `http://localhost/auth/api/v1/play-lists/${movieId}`
        )
      )

      this.playLists = responseData.play_lists
    },
    async openAddPlayListMovieDialog(movieId) {
      this.playListDialog = true
      this.menuClickedMovieId = movieId
      await this.getPlayLists(movieId)
    },
    closeAddPlayListMovieDialog() {
      this.playListDialog = false
      this.playLists = []
    },
    async addPlayListMovie(playListId) {
      this.playListMovieModifing = true

      const movieId = this.menuClickedMovieId
      const params = {
        play_list_id: playListId,
        movie_id: movieId,
      }
      await this.$axios
        .$post(`http://localhost/auth/api/v1/play-list-items`, params)
        .then(() => {
          this.getPlayLists(movieId)
        })
        .catch((err) => {
          console.log(err)
        })
      this.playListMovieModifing = false
    },
    async deletePlayListMovie(playListId, movieId) {
      this.playListMovieModifing = true
      await this.$axios
        .$delete(
          `http://localhost/auth/api/v1/play-list-items?play_list_id=${playListId}&movie_id=${movieId}`
        )
        .then(() => {
          console.log('OK')
          this.getPlayLists(movieId)
        })
        .catch((err) => {
          console.log(err)
        })
      this.playListMovieModifing = false
    },
  },
}
</script>
