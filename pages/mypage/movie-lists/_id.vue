<template>
  <v-container>
    <v-row justify="center">
      <v-sheet
        v-if="playList != null"
        width="90%"
        max-width="900px"
        max-height="280px"
        class="mb-5"
      >
        <v-row>
          <v-col cols="6">
            <v-img
              src="https://www.pakutaso.com/shared/img/thumb/gamerIMGL9105_TP_V.jpg"
              width="100%"
              aspect-ratio="1.77"
              position="left center"
              contain
            ></v-img>
          </v-col>
          <v-col cols="6">
            <div class="mb-4">{{ playList.play_list_name }}</div>
            <!-- prettier-ignore -->
            <div style="font-size: 0.9em; white-space: pre-line">{{ playList.play_list_description }}</div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-row>
    <v-toolbar dense width="90%" max-width="900px" class="mx-auto elevation-0">
      <v-spacer></v-spacer>
      <v-btn
        class="mr-3"
        color="primary"
        :disabled="!playListMoviesOrderChanged"
        >並び順を決定</v-btn
      >
      <v-btn
        :disabled="!playListMoviesOrderChanged"
        @click="resetPlayListMoviesOrder"
        >並び順を元に戻す</v-btn
      >
    </v-toolbar>
    <draggable
      v-model="playListMovies"
      tag="v-row"
      class="mb-15"
      :options="{ handle: '.draggable-button' }"
      @update="updatePlayListMoviesOrder"
    >
      <v-col
        v-for="playListMovie in playListMovies"
        :key="playListMovie.movie_id"
        cols="12"
        class="py-0"
        style="height: 160px"
      >
        <v-sheet
          width="90%"
          height="100%"
          max-width="900px"
          class="mx-auto px-4"
          style="background: #f2f2f2; position: relative"
        >
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="pink"
            style="position: absolute; top: 8px; right: 0"
            @click="openDeletePlayListMovieDialog(playListMovie.movie_id)"
          >
            <v-icon dark> mdi-close </v-icon>
          </v-btn>
          <v-row style="height: 100%">
            <v-col cols="4" class="py-1" style="height: 100%">
              <v-img
                src="https://www.pakutaso.com/shared/img/thumb/gamerIMGL9105_TP_V.jpg"
                width="100%"
                height="100%"
                aspect-ratio="1.77"
                class="thumbnail-img"
                position="left center"
                contain
              ></v-img>
            </v-col>
            <v-col cols="8" style="height: 100%">
              <div>{{ playListMovie.movie_title }}</div>
              <!-- prettier-ignore -->
              <div style="font-size: 0.9em; max-height: 4.5em; overflow: hidden; white-space: pre-line">{{ playListMovie.movie_description }}</div>
            </v-col>
          </v-row>
          <v-btn
            class="draggable-button"
            style="position: absolute; bottom: 10px; right: 10px"
          >
            <v-icon> mdi-arrow-up-down-bold </v-icon>
          </v-btn>
        </v-sheet>
      </v-col>
    </draggable>
    <v-dialog
      v-model="confirmDeletePlayListMovies"
      persistent
      max-width="300px"
    >
      <v-card class="px-12 py-8">
        <div class="text-center mb-5">削除しますか？</div>
        <v-card-actions>
          <span style="display: inline-block" class="mx-auto">
            <v-btn text @click="deletePlayListMovie"> はい </v-btn>
            <v-btn text @click="confirmDeletePlayListMovies = false">
              いいえ
            </v-btn>
          </span>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  asyncData(context) {
    return {
      playListId: parseInt(context.params.id, 10),
    }
  },
  data() {
    return {
      playListMovies: [],
      initialplaylistMovies: [],
      playList: null,
      playListId: null,
      deleteMovieId: null,
      playListMoviesOrderChanged: false,
      confirmDeletePlayListMovies: false,
    }
  },
  async mounted() {
    await this.getPlayListMovies()
  },
  methods: {
    async getPlayListMovies() {
      const responseData = JSON.parse(
        await this.$axios.$get(
          `http://localhost/auth/api/v1/play-list-items/${this.playListId}`
        )
      )
      if (responseData !== null) {
        this.playListMovies = responseData.play_list_movies
        this.initialplaylistMovies = this.playListMovies
        this.playList = responseData.play_list
      }
    },
    updatePlayListMoviesOrder() {
      this.playListMovies = this.playListMovies.map((value, index, array) => {
        value.order = index + 1
        return value
      })

      for (const i in this.playListMovies) {
        if (
          this.playListMovies[i].order !== this.initialplaylistMovies[i].order
        ) {
          this.playListMoviesOrderChanged = true
          break
        }
        this.playListMoviesOrderChanged = false
      }
    },
    resetPlayListMoviesOrder() {
      this.playListMovies = this.initialplaylistMovies
      this.playListMoviesOrderChanged = false
    },
    openDeletePlayListMovieDialog(movieId) {
      this.deleteMovieId = movieId
      this.confirmDeletePlayListMovies = true
    },
    async deletePlayListMovie() {
      await this.$axios
        .$delete(
          `http://localhost/auth/api/v1/play-list-items?play_list_id=${this.playListId}&movie_id=${this.deleteMovieId}`
        )
        .then(() => {
          this.getPlayListMovies()
          this.confirmDeletePlayListMovies = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
