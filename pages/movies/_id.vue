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
          :src="`http://d100q3wt0wdr5h.cloudfront.net/profile_images/${userPostedMovie.ID}/${userPostedMovie.ProfileImageName}`"
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
    <v-row>
      <v-col>
        <v-form v-model="valid" @submit.prevent="postComment">
          <v-text-field
            v-model="comment"
            name="comment"
            label="コメントを投稿"
            required
          ></v-text-field>
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
          <ServerErrorMessage
            v-show="postCommentError"
            message="コメントの投稿に失敗しました"
          />
        </v-form>
        <v-divider></v-divider>
        <v-list three-line>
          <template v-for="comment in comments">
            <v-list-item :key="comment.comment_id">
              <v-list-item-avatar>
                <v-img
                  v-if="comment.user_profile_image_name !== ''"
                  :src="`http://d100q3wt0wdr5h.cloudfront.net/profile_images/${comment.user_id}/${comment.user_profile_image_name}`"
                ></v-img>
                <v-icon v-else style="font-size: 40px"
                  >mdi-account-circle</v-icon
                >
              </v-list-item-avatar>

              <v-list-item-content>
                <div>
                  <div class="mb-5">
                    <span
                      class="d-inline-block px-2 py-1 rounded"
                      style="background-color: rgba(0, 0, 0, 0.15)"
                    >
                      {{ comment.user_name }}
                    </span>
                  </div>
                  <div>{{ comment.comment_body }}</div>
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
      movie: null,
      likeCount: null,
      userPostedMovie: null,
      comment: null,
      postCommentInProgress: false,
      postCommentError: false,
      liked: false,
    }
  },
  async mounted() {
    await this.getMovieAndComments()
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
    }
  },
  methods: {
    async getMovieAndComments() {
      const movieAndComments = JSON.parse(
        await this.$axios.$get(
          `/api/v1/movie-and-comments?movie_id=${this.movieId}`
        )
      )

      this.comments = movieAndComments.comments
      this.movie = movieAndComments.movie
      this.userPostedMovie = movieAndComments.posted_user
      this.likeCount = movieAndComments.movie_like_count

      this.options.sources[0].src = `http://d100q3wt0wdr5h.cloudfront.net/encoded/${this.movieId}/${this.movieId}_mypipe.m3u8`
      // this.options.liveui = true

      this.player = videojs(this.$refs.videoPlayer, this.options)
    },
    async postComment() {
      if (this.comment === null) {
        return
      }

      this.postCommentInProgress = true
      this.postCommentError = false

      const data = this
      const movieId = this.movieId
      const comment = this.comment
      const config = {
        headers: {
          Authorization: 'Bearer xxx',
        },
      }
      await this.$axios
        .$post(
          '/auth/api/v1/comments',
          {
            movie_id: movieId,
            comment_body: comment,
          },
          config
        )
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
