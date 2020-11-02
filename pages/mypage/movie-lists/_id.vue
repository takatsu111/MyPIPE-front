<template>
  <v-container>
    <v-row justify="center">
      <v-sheet
        v-if="playList != null"
        width="90%"
        max-width="900px"
        min-height="280px"
        class="mb-5"
      >
        <v-row>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
            <v-img
              v-if="
                playList.play_list_thumbnail_name === '' &&
                playList.play_list_first_movie_id === 0
              "
              :src="require('@/assets/image/no_thumbnail.png')"
              width="100%"
              aspect-ratio="1.77"
              contain
            ></v-img>
            <v-img
              v-else-if="playList.play_list_thumbnail_name !== ''"
              :src="`https://d100q3wt0wdr5h.cloudfront.net/resized-thumbnails/thumbnails/${playList.play_list_thumbnail_movie_id}${playList.play_list_thumbnail_name}`"
              width="100%"
              aspect-ratio="1.77"
              position="left center"
              contain
            ></v-img>
            <v-img
              v-else
              :src="`https://d100q3wt0wdr5h.cloudfront.net/resized-thumbnails/thumbnails/${playList.play_list_first_movie_id}${playList.play_list_first_movie_thumbnail_name}`"
              width="100%"
              aspect-ratio="1.77"
              position="left center"
              contain
            ></v-img>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
            <div class="mb-4" style="display: flex; align-items: flex-start">
              <v-icon @click="editPlayListTitleDialog = true"
                >mdi-pencil</v-icon
              >
              <span>{{ playList.play_list_name }}</span>
            </div>
            <v-dialog
              v-model="editPlayListTitleDialog"
              persistent
              max-width="900px"
            >
              <v-card class="px-10 py-3" style="position: relative">
                <v-btn
                  icon
                  style="position: absolute; top: 5px; right: 5px"
                  @click="closeEditPlayListDialog"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-form v-model="valid">
                  <v-text-field
                    v-model="newPlayListName"
                    label="再生リスト名"
                  ></v-text-field>
                  <v-btn @click="updatePlayListName">更新</v-btn>
                </v-form>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="editPlayListDescriptionDialog"
              persistent
              max-width="900px"
            >
              <v-card class="px-10 py-3" style="position: relative">
                <v-btn
                  icon
                  style="position: absolute; top: 5px; right: 5px"
                  @click="closeEditPlayListDialog"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-form v-model="valid">
                  <v-textarea
                    v-model="newPlayListDescription"
                    label="再生リストの説明"
                  ></v-textarea>
                  <v-btn @click="updatePlayListDescription">更新</v-btn>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- prettier-ignore -->
            <div style="font-size: 0.9em; white-space: pre-line; display: flex; align-items: flex-start"><v-icon @click="editPlayListDescriptionDialog = true"
              >mdi-pencil</v-icon
            >{{ playList.play_list_description }}</div>
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
        @click="editOrder"
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
        style="min-height: 160px"
      >
        <v-sheet
          width="90%"
          max-width="900px"
          class="mx-auto px-4"
          style="background: #f2f2f2"
        >
          <v-row style="height: 100%">
            <v-col
              cols="4"
              xs="4"
              sm="4"
              md="4"
              lg="4"
              xl="4"
              class="py-1"
              style="height: 100%"
            >
              <nuxt-link
                :to="`/movies/${playListMovie.movie_id}?play-list-id=${playList.play_list_id}`"
              >
                <v-img
                  :src="`https://d100q3wt0wdr5h.cloudfront.net/resized-thumbnails/thumbnails/${playListMovie.movie_id}${playListMovie.movie_thumbnail_name}`"
                  width="100%"
                  height="100%"
                  aspect-ratio="1.77"
                  class="thumbnail-img"
                  position="left center"
                  contain
                ></v-img>
              </nuxt-link>
            </v-col>
            <v-col
              cols="8"
              xs="8"
              sm="8"
              md="8"
              lg="8"
              xl="8"
              class="pb-10"
              style="height: 100%; position: relative"
            >
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    style="position: absolute; top: 0; right: 0"
                    v-on="on"
                  >
                    <v-icon> mdi-menu </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    style="cursor: pointer"
                    @click="
                      openDeletePlayListMovieDialog(playListMovie.movie_id)
                    "
                  >
                    <v-list-item-title>再生リストから削除</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    style="cursor: pointer"
                    @click="setPlayListThumbnail(playListMovie.movie_id)"
                  >
                    <v-list-item-title
                      >再生リストのサムネイルに設定</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
              <div
                style="
                  width: 90%;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                "
              >
                <nuxt-link
                  style="color: black"
                  :to="`/movies/${playListMovie.movie_id}?play-list-id=${playList.play_list_id}`"
                  >{{ playListMovie.movie_title }}</nuxt-link
                >
              </div>
              <!-- prettier-ignore -->
              <div style="font-size: 0.9em; max-height: 4.5em; overflow: hidden; white-space: pre-line"><nuxt-link style="color: black" :to="`/movies/${playListMovie.movie_id}?play-list-id=${playList.play_list_id}`">{{ playListMovie.movie_description }}</nuxt-link></div>
              <v-btn
                class="draggable-button"
                style="position: absolute; bottom: 5px; right: 10px"
              >
                <v-icon> mdi-arrow-up-down-bold </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </draggable>
    <v-dialog
      v-model="confirmDeletePlayListMovies"
      persistent
      max-width="500px"
    >
      <v-card class="px-12 py-8">
        <div class="text-center mb-5">再生リストから削除しますか？</div>
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
  middleware: ['checkLoggedIn'],
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
      editPlayListTitleDialog: false,
      editPlayListDescriptionDialog: false,
      newPlayListName: '',
      newPlayListDescription: '',
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
          `/auth/api/v1/play-list-items/${this.playListId}`
        )
      )
      if (responseData !== null) {
        this.playListMovies = responseData.play_list_movies
        this.initialplaylistMovies = this.playListMovies
        this.playList = responseData.play_list
        this.newPlayListName = this.playList.play_list_name
        this.newPlayListDescription = this.playList.play_list_description
      }
    },
    closeEditPlayListDialog() {
      this.editPlayListTitleDialog = false
      this.editPlayListDescriptionDialog = false
      this.newPlayListName = this.playList.play_list_name
      this.newPlayListDescription = this.playList.play_list_description
    },
    async updatePlayListName() {
      const requestData = {
        play_list_id: this.playListId,
        play_list_name: this.newPlayListName,
        play_list_description: this.playList.play_list_description,
        play_list_thumbnail_movie_id: this.playList
          .play_list_thumbnail_movie_id,
      }
      try {
        await this.$axios.$put(`/auth/api/v1/play-lists`, requestData)
        this.playList.play_list_name = this.newPlayListName
        this.newPlayListName = this.playList.play_list_name
        this.newPlayListDescription = this.playList.play_list_description
        this.closeEditPlayListDialog()
        this.$nuxt.$emit('showMessage', '変更が完了しました。')
      } catch {
        this.$nuxt.$emit(
          'showMessage',
          '変更に失敗しました。再度試してください。'
        )
      }
    },
    async updatePlayListDescription() {
      const requestData = {
        play_list_id: this.playListId,
        play_list_name: this.playList.play_list_name,
        play_list_description: this.newPlayListDescription,
        play_list_thumbnail_movie_id: this.playList
          .play_list_thumbnail_movie_id,
      }
      try {
        await this.$axios.$put(`/auth/api/v1/play-lists`, requestData)
        this.playList.play_list_description = this.newPlayListDescription
        this.newPlayListName = this.playList.play_list_name
        this.newPlayListDescription = this.playList.play_list_description
        this.closeEditPlayListDialog()
        this.$nuxt.$emit('showMessage', '変更が完了しました。')
      } catch {
        this.$nuxt.$emit(
          'showMessage',
          '変更に失敗しました。再度試してください。'
        )
      }
    },
    async setPlayListThumbnail(movieId) {
      const requestData = {
        play_list_id: this.playListId,
        play_list_name: this.playList.play_list_name,
        play_list_description: this.playList.play_list_description,
        play_list_thumbnail_movie_id: movieId,
      }
      try {
        await this.$axios.$put(`/auth/api/v1/play-lists`, requestData)
        const responseData = JSON.parse(
          await this.$axios.$get(
            `/auth/api/v1/play-list-items/${this.playListId}`
          )
        )
        if (responseData !== null) {
          this.playList.play_list_thumbnail_movie_id =
            responseData.play_list.play_list_thumbnail_movie_id
          this.playList.play_list_thumbnail_name =
            responseData.play_list.play_list_thumbnail_name
        }
        this.closeEditPlayListDialog()
        this.$nuxt.$emit('showMessage', 'サムネイルの設定が完了しました。')
      } catch {
        this.$nuxt.$emit(
          'showMessage',
          'サムネイルの設定に失敗しました。再度試してください。'
        )
      }
    },
    updatePlayListMoviesOrder() {
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
          `/auth/api/v1/play-list-items?play_list_id=${this.playListId}&movie_id=${this.deleteMovieId}`
        )
        .then(() => {
          this.getPlayListMovies()
          this.confirmDeletePlayListMovies = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async editOrder() {
      const playListMovieOrder = []

      for (let i = 0; i < this.playListMovies.length; i++) {
        playListMovieOrder.push({
          play_list_movie_id: this.playListMovies[i].movie_id,
          play_lise_movie_order: i + 1,
        })
      }

      const data = {
        play_list_id: this.playListId,
        play_list_movie_id_and_order: playListMovieOrder,
      }
      await this.$axios.$put(`/auth/api/v1/play-list-items`, data)
      this.initialplaylistMovies = this.playListMovies
      this.playListMoviesOrderChanged = false
    },
  },
}
</script>
