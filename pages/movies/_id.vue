<template>
  <v-container style="max-width: 1000px">
    <v-row>
      <v-col>
        <h2 v-if="movie !== null">
          {{ movie.DisplayName }}
        </h2>
      </v-col>
    </v-row>
    <v-row class="px-3 py-0">
      <v-spacer></v-spacer>
      <v-btn v-if="liked" icon @click="evaluate('bad')">
        <v-icon color="red">mdi-heart</v-icon>
        <span>{{ likeCount }}</span>
      </v-btn>
      <v-btn v-else icon @click="evaluate('good')">
        <v-icon color="red">mdi-heart-outline</v-icon>
        <span>{{ likeCount }}</span>
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <video
          ref="videoPlayer"
          class="video-js vjs-big-play-centered vjs-16-9"
          controls
        ></video>
      </v-col>
    </v-row>
    <v-row v-if="movie !== null" style="min-height: 3em">
      <v-col cols="12">
        <v-img
          v-if="userPostedMovie.ProfileImageName !== ''"
          width="50px"
          height="50px"
          class="mx-auto"
          style="border-radius: 50%"
          :src="`${$store.state.resourcesURL.resourcesURL}/profile_images/${userPostedMovie.ID}/${userPostedMovie.ProfileImageName}`"
        ></v-img>
        <v-icon v-else style="font-size: 40px">mdi-account-circle</v-icon>
      </v-col>
      <v-col v-if="movie !== null" cols="12" class="text-center">
        <h2>{{ userPostedMovie.Name }}</h2>
      </v-col>
    </v-row>
    <v-row class="mb-10">
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>動画の説明を見る</v-expansion-panel-header>
          <v-expansion-panel-content v-if="movie !== null">
            {{ movie.Description }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-card v-if="this.playListMovies.length !== 0">
      <v-card-title>
        <div
          class="title font-weight-light"
          style="
            max-width: 80%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            position: relative;
          "
        >
          <v-icon large left> mdi-playlist-play </v-icon>
          {{ playList.play_list_name }}
        </div>
        <v-spacer></v-spacer>
        <v-icon v-if="autoPlay" large @click="stopAutoPlay"> mdi-pause </v-icon>
        <v-icon v-else large @click="startAutoPlay"> mdi-play </v-icon>
      </v-card-title>
      <div style="max-height: 350px; overflow: scroll; width: 100%">
        <v-row
          v-for="playListMovie in this.playListMovies"
          :key="playListMovie.movie_id"
          style="height: 140px; cursor: pointer"
          :class="{
            'watching-movie':
              Number($route.params.id) === playListMovie.movie_id,
          }"
          @click="selectMovie(playListMovie.movie_id)"
        >
          <v-col cols="4" style="height: 100%">
            <v-img
              :src="`${$store.state.resourcesURL.resourcesURL}/resized-thumbnails/thumbnails/${playListMovie.movie_id}${playListMovie.movie_thumbnail_name}`"
              width="90%"
              height="100%"
              aspect-ratio="1.77"
              class="thumbnail-img"
              position="center"
              contain
            ></v-img>
          </v-col>
          <v-col cols="8" style="height: 100%">
            <div
              class="mb-2"
              style="line-height: 1.5em; max-height: 4.5em; overflow: hidden"
            >
              {{ playListMovie.movie_title }}
            </div>
            <div
              class="mb-2"
              style="line-height: 1.5em; max-height: 4.5em; overflow: hidden"
            >
              {{ playListMovie.movie_description }}
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <v-row>
      <v-col>
        <v-form v-model="valid" @submit.prevent="postComment">
          <v-textarea
            v-model="comment"
            filled
            name="comment"
            label="コメントを入力"
          ></v-textarea>
          <v-btn
            v-show="postCommentInProgress"
            width="120px"
            type="submit"
            class="mb-8"
            disabled
          >
            <v-progress-circular
              indeterminate
              color="primary"
              :size="20"
              :width="2"
            ></v-progress-circular>
          </v-btn>
          <v-btn
            v-show="!postCommentInProgress"
            width="120px"
            type="submit"
            class="mr-4 mb-8"
            >投稿</v-btn
          >
        </v-form>
        <v-divider></v-divider>
        <v-list three-line>
          <template v-for="comment in comments">
            <v-list-item :key="comment.comment_id">
              <v-list-item-avatar>
                <v-img
                  v-if="comment.user_profile_image_name !== ''"
                  :src="`${$store.state.resourcesURL.resourcesURL}/profile_images/${comment.user_id}/${comment.user_profile_image_name}`"
                ></v-img>
                <v-icon v-else style="font-size: 40px"
                  >mdi-account-circle</v-icon
                >
              </v-list-item-avatar>

              <v-list-item-content style="position: relative">
                <v-btn
                  v-if="
                    comment.user_id ===
                    $store.state.loggedInUserId.loggedInUserId
                  "
                  icon
                  style="position: absolute; right: 0; top: 0"
                  @click="confirmDeleteComment(comment.comment_id)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-dialog
                  v-model="openDeleteCommentDialog"
                  persistent
                  max-width="300px"
                >
                  <v-card class="px-12 py-8">
                    <div class="text-center mb-5">コメントを削除しますか？</div>
                    <v-card-actions>
                      <span style="display: inline-block" class="mx-auto">
                        <v-btn text @click="deleteComment"> はい </v-btn>
                        <v-btn text @click="closeConfirmDeleteComment">
                          いいえ
                        </v-btn>
                      </span>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <div>
                  <div class="mb-2">
                    <span
                      class="d-inline-block px-2 py-1 rounded"
                      style="background-color: rgba(0, 0, 0, 0.15)"
                    >
                      {{ comment.user_name }}
                    </span>
                  </div>
                  <div style="white-space: pre-line">
                    {{ comment.comment_body }}
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="comment.comment_id"></v-divider>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import videojs from 'video.js'
export default {
  middleware: ['getLoggedInUserId'],
  props: {
    options: {
      type: Object,
      default() {
        return {
          autoplay: true,
          controls: true,
          sources: [
            {
              src: '',
              type: 'application/x-mpegURL',
            },
          ],
        }
      },
    },
  },
  asyncData(context) {
    return { movieId: parseInt(context.params.id) }
  },
  data() {
    return {
      player: null,
      comments: [],
      openDeleteCommentDialog: false,
      commentIdToDelete: null,
      movie: null,
      likeCount: null,
      userPostedMovie: null,
      comment: '',
      postCommentInProgress: false,
      postCommentError: false,
      liked: false,
      playListMovies: [],
      playList: null,
      nextMovieId: null,
      movieEnded: false,
      autoPlay: true,
    }
  },
  async mounted() {
    const isPublic = await this.getMovieAndComments()
    if (!isPublic) {
      return
    }
    if (this.$auth.loggedIn) {
      const token = this.$store.$auth.getToken('local')
      const base64Url = token.substr(7).split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const userId = JSON.parse(decodeURIComponent(escape(window.atob(base64))))
        .id
      const evaluated = await this.$axios.$get(
        `/evaluated?user_id=${userId}&movie_id=${this.movieId}`
      )
      if (evaluated.evaluated === 'true') {
        this.liked = true
      } else {
        this.liked = false
      }
      if (this.$route.query['play-list-id'] !== undefined) {
        await this.getPlayListMovies(this.$route.query['play-list-id'])
      }
    }
    this.getNextMovie()
  },
  methods: {
    async getMovieAndComments() {
      const movieAndComments = JSON.parse(
        await this.$axios.$get(
          `/api/v1/movie-and-comments?movie_id=${this.movieId}`
        )
      )

      this.movie = movieAndComments.movie
      if (this.movie.Public !== 1) {
        this.$router.push(`/`)
        this.$nuxt.$emit('showMessage', '動画は再生できません。')
        return false
      }
      this.comments = movieAndComments.comments
      this.userPostedMovie = movieAndComments.posted_user
      this.likeCount = movieAndComments.movie_like_count

      this.options.sources[0].src = `${this.$store.state.resourcesURL.resourcesURL}/encoded/${this.movieId}/${this.movieId}_mypipe.m3u8`

      if (this.$refs.videoPlayer === undefined) {
        location.reload()
        return
      }
      const self = this
      this.player = videojs(this.$refs.videoPlayer, this.options).ready(
        function () {
          const player = this
          player.on('ended', function () {
            self.movieEnded = true
            self.openNextMovie()
          })
        }
      )
    },
    confirmDeleteComment(commentId) {
      this.commentIdToDelete = commentId
      this.openDeleteCommentDialog = true
    },
    closeConfirmDeleteComment() {
      this.commentIdToDelete = null
      this.openDeleteCommentDialog = false
    },
    async deleteComment() {
      try {
        await this.$axios.$delete(
          `/auth/api/v1/comments?comment_id=${this.commentIdToDelete}`
        )
        this.closeConfirmDeleteComment()
        this.$nuxt.$emit('showMessage', 'コメントを削除しました。')
        await this.getMovieAndComments()
      } catch {
        this.closeConfirmDeleteComment()
        this.$nuxt.$emit('showMessage', 'コメントの削除が失敗しました。')
      }
    },
    async getPlayListMovies(playListId) {
      const responseData = JSON.parse(
        await this.$axios.$get(`/auth/api/v1/play-list-items/${playListId}`)
      )
      if (responseData !== null) {
        this.playListMovies = responseData.play_list_movies
        this.initialplaylistMovies = this.playListMovies
        this.playList = responseData.play_list
      }
    },
    getNextMovie() {
      if (this.playListMovies.length !== 0) {
        const nowMovieId = Number(this.$route.params.id)
        for (let i = 0; i < this.playListMovies.length; i++) {
          if (
            nowMovieId === this.playListMovies[i].movie_id &&
            this.playListMovies[i + 1] !== undefined
          ) {
            this.nextMovieId = this.playListMovies[i + 1].movie_id
            break
          }
        }
      }
    },
    stopAutoPlay() {
      this.autoPlay = false
      this.$nuxt.$emit('showMessage', '自動再生を停止しました。')
    },
    startAutoPlay() {
      this.autoPlay = true
      this.$nuxt.$emit('showMessage', '自動再生を再開しました。')
      if (this.movieEnded) {
        this.openNextMovie()
      }
    },
    openNextMovie() {
      if (this.nextMovieId && this.autoPlay) {
        this.$router.push(
          `/movies/${this.nextMovieId}?play-list-id=${this.$route.query['play-list-id']}`
        )
      }
    },
    selectMovie(movieId) {
      this.$router.push(
        `/movies/${movieId}?play-list-id=${this.$route.query['play-list-id']}`
      )
    },
    async postComment() {
      if (this.comment === '') {
        return
      }

      this.postCommentInProgress = true
      this.postCommentError = false

      const data = this
      const movieId = this.movieId
      const comment = this.comment
      await this.$axios
        .$post('/auth/api/v1/comments', {
          movie_id: movieId,
          comment_body: comment,
        })
        .then((res) => {
          data.getMovieAndComments()
          data.comment = null
          data.$nuxt.$emit('showMessage', 'コメントの投稿が完了しました。')
        })
        .catch(() => {
          data.$nuxt.$emit('showMessage', 'コメントの投稿に失敗しました。')
        })

      this.postCommentInProgress = false
    },
    async evaluate(evaluate) {
      const self = this
      const requestData = {
        movie_id: this.movie.ID,
        evaluate,
      }
      await this.$axios
        .$post('/auth/api/v1/evaluates', requestData)
        .then(() => {
          if (evaluate === 'good') {
            this.likeCount += 1
            this.liked = true
          } else {
            this.likeCount -= 1
            this.liked = false
          }
        })
        .catch(() => {
          self.$nuxt.$emit('showMessage', '動画の評価に失敗しました。')
        })
    },
  },
}
</script>

<style scoped lang="scss">
.watching-movie {
  background: #f2f2f2;
}
</style>
