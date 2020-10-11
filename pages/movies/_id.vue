<template>
  <v-container style="max-width: 1000px">
    <v-row>
      <v-col>
        <h2 v-if="movie !== null">
          {{ movie.DisplayName }}
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <video
          ref="videoPlayer"
          class="video-js vjs-big-play-centered vjs-16-9"
        ></video>
      </v-col>
    </v-row>
    <v-row v-if="movie !== null" style="min-height: 3em">
      <v-col>
        <v-img
          width="100px"
          height="100px"
          class="mx-auto"
          src="https://imgsv.nikon-image.com/products/mirrorless/lineup/z_50/img/sample/pic_01_l.jpg"
        ></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="movie !== null" class="text-center">
        <h2>{{ userPostedMovie.DisplayName }}aaaaa</h2>
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
                  src="https://imgsv.nikon-image.com/products/mirrorless/lineup/z_50/img/sample/pic_01_l.jpg"
                ></v-img>
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
      userPostedMovie: null,
      comment: null,
      postCommentInProgress: false,
      postCommentError: false,
    }
  },
  async mounted() {
    await this.getMovieAndComments()
  },
  methods: {
    async getMovieAndComments() {
      const movieAndComments = JSON.parse(
        await this.$axios.$get(
          `http://localhost/auth/api/v1/movie-and-comments?movie_id=${this.movieId}`
        )
      )

      this.comments = movieAndComments.comments
      this.movie = movieAndComments.movie
      this.userPostedMovie = movieAndComments.posted_user

      this.options.sources[0].src = `http://--------/encoded/${this.movieId}/${this.movieId}_mypipe.m3u8`

      this.player = videojs(
        this.$refs.videoPlayer,
        this.options,
        function onPlayerReady() {
          console.log('onPlayerReady', this)
        }
      )
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
          'http://localhost/auth/api/v1/comments',
          {
            movie_id: movieId,
            comment_body: comment,
          },
          config
        )
        .then((res) => {
          data.getMovieAndComments()
          data.comment = null
        })
        .catch((error) => {
          console.log(error)
          this.postCommentError = true
        })

      this.postCommentInProgress = false
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
