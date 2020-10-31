<template>
  <v-container>
    <v-row>
      <div class="mx-auto" style="width: 90%; max-width: 900px">
        <v-dialog v-model="createPlayListDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              <v-icon left>mdi-plus</v-icon>
              再生リストを追加
            </v-btn>
          </template>
          <v-card class="px-10 py-3" style="position: relative">
            <v-btn
              icon
              style="position: absolute; top: 5px; right: 5px"
              @click="createPlayListDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-form v-model="valid">
              <v-text-field
                v-model="newPlayListName"
                label="再生リスト名"
              ></v-text-field>
              <v-text-field
                v-model="newPlayListDescription"
                label="再生リストの説明"
              ></v-text-field>
              <v-btn @click="createPlayLists">作成</v-btn>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </v-row>
    <v-row
      v-for="playList in playLists"
      :key="playList.play_list_id"
      class="mt-10"
      justify="center"
    >
      <v-card
        height="180px"
        max-width="900px"
        width="90%"
        class="px-3"
        style="position: relative"
        elevation="3"
        link
        nuxt
        :to="`/mypage/movie-lists/${playList.play_list_id}`"
      >
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="pink"
          style="position: absolute; top: -20px; right: -20px"
          @click.prevent.stop="openDeleteDialog(playList.play_list_id)"
        >
          <v-icon dark> mdi-close </v-icon>
        </v-btn>
        <v-row>
          <v-col cols="4">
            <v-img
              v-if="playList.play_list_thumbnail_name === ''"
              :src="`https://d100q3wt0wdr5h.cloudfront.net/resized-thumbnails/thumbnails/${playList.play_list_first_movie_id}${playList.play_list_first_movie_thumbnail_name}`"
              width="100%"
              aspect-ratio="1.77"
              contain
            ></v-img>
            <v-img
              v-else
              :src="`https://d100q3wt0wdr5h.cloudfront.net/resized-thumbnails/thumbnails/${playList.play_list_thumbnail_movie_id}${playList.play_list_thumbnail_name}`"
              width="100%"
              aspect-ratio="1.77"
              contain
            ></v-img>
          </v-col>
          <v-col cols="8">
            <div class="mb-1" style="max-height: 1.5em">
              {{ playList.play_list_name }}
            </div>
            <div style="max-height: 6em; font-size: 0.9em; overflow: hidden">
              {{ playList.play_list_description }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-snackbar v-model="completeCreatePlayListNotification" timeout="3000"
      >再生リストの作成が完了しました</v-snackbar
    >
    <v-dialog v-model="confirmDeletePlayList" persistent max-width="300px">
      <v-card class="px-12 py-8">
        <div class="text-center mb-5">削除しますか？</div>
        <v-card-actions>
          <span style="display: inline-block" class="mx-auto">
            <v-btn text @click="deletePlayList"> はい </v-btn>
            <v-btn text @click="confirmDeletePlayList = false"> いいえ </v-btn>
          </span>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  middleware: ['checkLoggedIn'],
  data() {
    return {
      playLists: [],
      count: 0,
      createPlayListDialog: false,
      newPlayListName: null,
      newPlayListDescription: null,
      completeCreatePlayListNotification: false,
      confirmDeletePlayList: false,
      playListIdToDelete: null,
    }
  },
  async mounted() {
    await this.getPlayLists()
  },
  methods: {
    async getPlayLists() {
      const responseData = JSON.parse(
        await this.$axios.$get('/auth/api/v1/play-lists')
      )

      this.playLists = responseData.play_lists
      this.count = responseData.play_lists_count
    },
    async createPlayLists() {
      const requestData = {
        play_list_name: this.newPlayListName,
        play_list_description: this.newPlayListDescription,
      }

      const that = this

      await this.$axios
        .$post('/auth/api/v1/play-lists', requestData)
        .then((response) => {
          this.createPlayListDialog = false
          this.completeCreatePlayListNotification = true
        })
        .catch((error) => {
          console.log(error)
        })

      await that.getPlayLists()
    },
    openDeleteDialog(playListId) {
      this.playListIdToDelete = playListId
      this.confirmDeletePlayList = true
    },
    async deletePlayList() {
      try {
        await this.$axios.$delete(
          `/auth/api/v1/play-lists?play_list_id=${this.playListIdToDelete}`
        )
        this.confirmDeletePlayList = false
        await this.getPlayLists()
      } catch {
        console.log('Delete Failed.')
      }
    },
  },
}
</script>
