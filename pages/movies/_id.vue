<template>
  <v-container>
    <v-row style="max-width: 1000px" class="mx-auto">
      <v-col>
        <video
          ref="videoPlayer"
          class="video-js vjs-big-play-centered vjs-16-9 mb-8"
          style="margin: auto"
        ></video>
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
            <v-list-item :key="comment.id">
              <v-list-item-avatar>
                <v-img :src="comment.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ comment.name }}</v-list-item-title>
                <span>{{ comment.body }}</span>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="comment.id"></v-divider>
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
      comment: null,
      postCommentInProgress: false,
      postCommentError: false,
    }
  },
  async mounted() {
    this.comments = await this.$axios.$get(`/comments/${this.movieId}`)

    this.options.sources[0].src = `http://--------/encoded/${this.movieId}/${this.movieId}_mypipe.m3u8`

    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        console.log('onPlayerReady', this)
      }
    )
  },
  methods: {
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
          Authorization: 'Bearer xxxx',
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
          this.comment = null
          const postedComment = {
            avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            name: 'postCommentTest',
            body: comment,
          }
          data.items.unshift(postedComment)
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
