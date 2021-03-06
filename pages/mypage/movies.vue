<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-btn depressed color="#06ACB5" dark @click="newDialog = true">
            動画を投稿する(サンプル動画あり)
          </v-btn>
          <p>
            ※動画のタイトルが未設定、または進行状況が「Complete」でない場合は、動画を公開できません。
          </p>
          <v-dialog v-model="newDialog" width="1000px" persistent>
            <v-card>
              <v-icon large @click="closeNewDialog"> mdi-close </v-icon>
              <v-form
                ref="form"
                v-model="valid"
                class="px-15 py-5"
                lazy-validation
                @submit.prevent
              >
                <v-file-input
                  ref="movieFileInput"
                  v-model="newMovieFile"
                  accept="video/*"
                  label="動画を選択"
                  name="newMovie"
                  hint="対応形式：.mp4/.mov<br>サイズ：1GBまで"
                  persistent-hint
                  @change="validateMovieFile"
                >
                  <template v-slot:message="{ message, key }">
                    <div :key="key" v-html="message"></div>
                  </template>
                </v-file-input>
                <p
                  v-for="movieFileError in movieFileErrors"
                  :key="movieFileError"
                  class="pl-10"
                  style="font-size: 14px; color: red"
                >
                  {{ movieFileError }}
                </p>
                <v-file-input
                  ref="newThumbnailFileInput"
                  v-model="newMovieThumbnail"
                  accept="image/*"
                  label="サムネイルを選択"
                  name="newThumbnail"
                  hint="対応形式：.jpg/.png/.bmp/.gif<br>サイズ：2MBまで"
                  persistent-hint
                  @change="validateNewThumbnailFile"
                >
                  <template v-slot:message="{ message, key }">
                    <div :key="key" v-html="message"></div>
                  </template>
                </v-file-input>
                <p
                  v-for="newThumbnailFileError in newThumbnailFileErrors"
                  :key="newThumbnailFileError"
                  class="pl-10"
                  style="font-size: 14px; color: red"
                >
                  {{ newThumbnailFileError }}
                </p>
                <v-img
                  width="160px"
                  :height="newMovieThumbnailUrl === null ? 0 : '90px'"
                  :src="newMovieThumbnailUrl"
                  class="mb-4"
                  contain
                ></v-img>
                <p>
                  <a
                    href="https://mymovies-sample-movies-public.s3-ap-northeast-1.amazonaws.com/sample-movies/water_fall.zip"
                    >サンプル動画1</a
                  >
                </p>
                <p>
                  <a
                    href="https://mymovies-sample-movies-public.s3-ap-northeast-1.amazonaws.com/sample-movies/social_icons.zip"
                    >サンプル動画2</a
                  >
                </p>
                <p>
                  <a
                    href="https://mymovies-sample-movies-public.s3-ap-northeast-1.amazonaws.com/sample-movies/hand.zip"
                    >サンプル動画3</a
                  >
                </p>
                <v-btn v-if="newDialogButtonEnable" @click="uploadNewMovie">
                  投稿する
                </v-btn>
                <v-progress-circular
                  v-else
                  indeterminate
                  color="primary"
                  :size="20"
                  :width="2"
                  class="mr-2"
                ></v-progress-circular>
              </v-form>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="movies"
      :items-per-page="5"
      class="elevation-1"
      mobile-breakpoint="900"
    >
      <template v-slot:item.thumbnail="{ item }">
        <v-img
          v-if="item.movie_thumbnail_status !== 0"
          width="200px"
          height="120px"
          :src="
            `${$store.state.resourcesURL.resourcesURL}/resized-thumbnails/thumbnails/` +
            item.movie_id +
            item.movie_thumbnail_name +
            '?cacheKey=' +
            cacheKey
          "
          contain
        ></v-img>
        <v-img
          v-else
          width="200px"
          height="120px"
          :src="require('@/assets/image/thumbnail_processing.png')"
        ></v-img>
        <v-btn
          width="200px"
          class="mb-5"
          @click="
            openChangeThumbnailDialog(
              item.movie_id,
              item.movie_name,
              item.movie_description,
              item.movie_public,
              item.movie_status
            )
          "
          >サムネイルを変更する</v-btn
        >
      </template>
      <template v-slot:item.movie_description="{ item }">
        <div class="mb-0" style="display: flex; align-items: flex-start">
          <v-btn
            icon
            @click="
              openChangeTitleDialog(
                item.movie_id,
                item.movie_name,
                item.movie_description,
                item.movie_public,
                item.movie_status
              )
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <template v-if="item.movie_name">
            <span
              style="
                padding: 7px 0;
                line-height: 1.5em;
                max-height: calc(7.5em + 7px);
              "
            >
              {{ item.movie_name }}
            </span>
          </template>
          <template v-else>
            <span style="color: lightslategray; padding: 7px 0">
              タイトルを設定
            </span>
          </template>
        </div>
        <div style="display: flex; align-items: flex-start">
          <v-btn
            icon
            @click="
              openChangeDescriptionDialog(
                item.movie_id,
                item.movie_name,
                item.movie_description,
                item.movie_public,
                item.movie_status
              )
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <template v-if="item.movie_description">
            <!-- prettier-ignore -->
            <span
              style="
                padding: 7px 0;
                line-height: 1.5em;
                max-height: calc(7.5em + 7px);
                overflow: hidden;
                white-space: pre-line;
                text-align: left
              "
            >{{ item.movie_description }}</span>
          </template>
          <template v-else>
            <span style="color: lightslategray; padding: 7px 0"
              >概要を設定</span
            >
          </template>
        </div>
      </template>
      <template v-slot:item.movie_status="{ item }">
        <template v-if="item.movie_status === 0">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="20"
            :width="2"
            class="mr-2"
          ></v-progress-circular>
          <span>Processing</span>
        </template>
        <template v-if="item.movie_status === 1">
          <v-icon color="green">mdi-check</v-icon>
          <span>Complete</span>
        </template>
        <template v-if="item.movie_status === 2">
          <v-icon color="red">mdi-close</v-icon>
          <span>Error</span>
        </template>
      </template>
      <template v-slot:item.movie_public="{ item }">
        <template v-if="item.movie_public === 0">
          <v-chip dark> 非公開 </v-chip>
          <v-btn
            :disabled="item.movie_status !== 1 || !item.movie_name"
            @click="
              openChangePublicDialog(
                item.movie_id,
                item.movie_name,
                item.movie_description,
                item.movie_public,
                item.movie_status
              )
            "
          >
            公開する
          </v-btn>
        </template>
        <template v-else>
          <v-chip color="#06ACB5" dark> 公開 </v-chip>
          <v-btn
            @click="
              openChangePublicDialog(
                item.movie_id,
                item.movie_name,
                item.movie_description,
                item.movie_public,
                item.movie_status
              )
            "
          >
            非公開にする
          </v-btn>
        </template>
      </template>
      <template v-slot:item.movie_id="{ item }">
        <v-btn icon @click="openDeleteMovieModal(item.movie_id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" width="1000px" persistent>
      <v-card>
        <v-icon large @click="editDialog = false"> mdi-close </v-icon>
        <v-form ref="form" v-model="valid" class="px-15 py-5" lazy-validation>
          <v-text-field
            v-model="editMovieTitle"
            label="タイトル"
            required
            clearable
            name="editMovieTitle"
            counter="200"
            hint="200文字まで"
            persistent-hint
          ></v-text-field>

          <p v-if="newMovieTitleError" style="font-size: 14px; color: red">
            {{ newMovieTitleError }}
          </p>

          <v-textarea
            v-model="editMovieDescription"
            label="概要"
            required
            clearable
            name="editMovieDescription"
          ></v-textarea>

          <v-btn v-if="editDialogButtonEnable" @click="editMovieInfo">
            編集完了
          </v-btn>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
            :size="20"
            :width="2"
            class="mr-2"
          ></v-progress-circular>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editTitleDialog" width="1000px" persistent>
      <v-card>
        <v-icon large @click="editTitleDialog = false"> mdi-close </v-icon>
        <v-form
          ref="form"
          v-model="valid"
          class="px-8 py-5"
          lazy-validation
          @submit.prevent
        >
          <v-text-field
            v-model="editMovieTitle"
            label="タイトル"
            counter="200"
            hint="200文字まで"
            persistent-hint
            required
            clearable
          ></v-text-field>
          <p v-if="editMovieTitleError" style="font-size: 14px; color: red">
            {{ editMovieTitleError }}
          </p>
          <v-btn v-if="editDialogButtonEnable" @click="editMovieInfo">
            編集完了
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDescriptionDialog" width="1000px" persistent>
      <v-card>
        <v-icon large @click="editDescriptionDialog = false">
          mdi-close
        </v-icon>
        <v-form
          ref="form"
          v-model="valid"
          class="px-8 py-5"
          lazy-validation
          @submit.prevent
        >
          <v-textarea
            v-model="editMovieDescription"
            label="概要"
            required
            clearable
          ></v-textarea>
          <v-btn v-if="editDialogButtonEnable" @click="editMovieInfo">
            編集完了
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editPublicDialog" max-width="400px" persistent>
      <v-card>
        <v-icon large @click="editPublicDialog = false"> mdi-close </v-icon>
        <v-form
          ref="form"
          v-model="valid"
          class="px-15 py-5"
          lazy-validation
          @submit.prevent
        >
          <template v-if="editMoviePublic === 0">
            <div class="mb-5">動画を非公開にしますか?</div>
            <v-btn v-if="editDialogButtonEnable" @click="editMovieInfo">
              非公開にする
            </v-btn>
          </template>
          <template v-if="editMoviePublic === 1">
            <div>動画を公開しますか?</div>
            <v-btn v-if="editDialogButtonEnable" @click="editMovieInfo">
              公開する
            </v-btn>
          </template>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editMovieThumbnailDialog" width="1000px" persistent>
      <v-card>
        <v-icon large @click="editMovieThumbnailDialog = false">
          mdi-close
        </v-icon>
        <v-form
          ref="form"
          v-model="valid"
          class="px-15 py-5"
          lazy-validation
          @submit.prevent
        >
          <v-file-input
            ref="editThumbnailFileInput"
            v-model="editMovieThumbnail"
            accept="image/*"
            label="サムネイルを選択"
            name="editThumbnail"
            hint="対応形式：.jpg/.png/.bmp/.gif<br>サイズ：2MBまで"
            persistent-hint
            @change="validateEditThumbnailFile"
          >
            <template v-slot:message="{ message, key }">
              <div :key="key" v-html="message"></div>
            </template>
          </v-file-input>
          <p
            v-for="editThumbnailFileError in editThumbnailFileErrors"
            :key="editThumbnailFileError"
            class="pl-10"
            style="font-size: 14px; color: red"
          >
            {{ editThumbnailFileError }}
          </p>
          <v-img
            width="160px"
            :height="editMovieThumbnailUrl === null ? 0 : '90px'"
            :src="editMovieThumbnailUrl"
            class="mb-4"
            contain
          ></v-img>

          <v-btn v-if="editDialogButtonEnable" @click="uploadEditThumbnail">
            変更する
          </v-btn>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
            :size="20"
            :width="2"
            class="mr-2"
          ></v-progress-circular>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteModal" persistent max-width="500px">
      <v-card class="px-12 py-8">
        <div class="text-center mb-5">動画を削除しますか？</div>
        <v-card-actions>
          <span style="display: inline-block" class="mx-auto">
            <v-btn text @click="deleteMovie"> はい </v-btn>
            <v-btn text @click="closeDeleteMovieModal"> いいえ </v-btn>
          </span>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorMessageDialogOpen" max-width="800px" persistent>
      <v-card class="pa-5 text-center">
        <div class="mb-5">
          {{ errorMessage }}
        </div>
        <v-btn class="mx-auto" @click="errorMessageDialogOpen = false"
          >戻る</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  middleware: ['checkLoggedIn'],
  data() {
    return {
      errorMessageDialogOpen: false,
      errorMessage: null,
      newMovieTitle: null,
      newMovieDescription: null,
      newMovieFile: null,
      newMovieThumbnail: null,
      newMovieThumbnailUrl: null,
      newDialog: false,
      newDialogButtonEnable: true,
      newMovieTitleError: null,
      editMovieId: null,
      editMovieTitle: null,
      editMovieDescription: null,
      editMoviePublic: null,
      editMovieThumbnailDialog: false,
      editMovieThumbnail: null,
      editDialog: false,
      editTitleDialog: false,
      editDescriptionDialog: false,
      editPublicDialog: false,
      editStatus: null,
      editDialogButtonEnable: true,
      editMovieTitleError: null,
      cacheKey: new Date(),
      deleteMovieId: null,
      showDeleteModal: false,
      headers: [
        { text: 'サムネイル', value: 'thumbnail' },
        {
          text: 'タイトル/概要',
          value: 'movie_description',
          sortable: false,
          align: 'end',
        },
        { text: '進行状況', value: 'movie_status' },
        { text: '公開/非公開', value: 'movie_public' },
        { text: '投稿日', value: 'movie_created_at' },
        { text: '削除', value: 'movie_id' },
      ],
      movies: [],
      movieFileErrors: [],
      newThumbnailFileErrors: [],
      editThumbnailFileErrors: [],
    }
  },
  async mounted() {
    await this.getMovies()
  },
  created() {
    const data = this
    const get = function () {
      if (data.$route.path === '/mypage/movies') {
        data.getMovies()
      }
    }
    setInterval(get, 5000)
  },
  methods: {
    async getMovies() {
      const movies = await this.$axios.$get('/auth/api/v1/movies', {
        progress: false,
      })
      this.movies = JSON.parse(movies)
    },
    refreshCacheKey() {
      this.cacheKey = new Date()
    },
    openEditModal(id, title, description) {
      this.editMovieId = id
      this.editMovieTitle = title
      this.editMovieDescription = description
      this.editDialog = true
    },
    openChangeTitleDialog(id, title, description, publicStatus, status) {
      this.editMovieId = id
      this.editMovieDescription = description
      this.editMovieTitle = title
      this.editMoviePublic = publicStatus
      this.editMovieStatus = status
      this.editTitleDialog = true
    },
    openChangeDescriptionDialog(id, title, description, publicStatus, status) {
      this.editMovieId = id
      this.editMovieDescription = description
      this.editMovieTitle = title
      this.editMoviePublic = publicStatus
      this.editMovieStatus = status
      this.editDescriptionDialog = true
    },
    openChangeThumbnailDialog(id, title, description, publicStatus, status) {
      this.editMovieId = id
      this.editMovieDescription = description
      this.editMovieTitle = title
      this.editMoviePublic = publicStatus
      this.editMovieStatus = status
      this.editMovieThumbnailDialog = true
    },
    openChangePublicDialog(id, title, description, publicStatus, status) {
      if (title === '' || status !== 1) {
        this.errorMessage =
          'タイトルが未設定または進捗状況が「Complete」ではない動画は公開できません。'
        this.errorMessageDialogOpen = true
        return
      }
      this.editMovieId = id
      this.editMovieDescription = description
      this.editMovieTitle = title
      if (publicStatus === 0) {
        this.editMoviePublic = 1
      }
      if (publicStatus === 1) {
        this.editMoviePublic = 0
      }

      this.editMovieStatus = status
      this.editPublicDialog = true
    },
    openDeleteMovieModal(movieId) {
      this.deleteMovieId = movieId
      this.showDeleteModal = true
    },
    closeDeleteMovieModal() {
      this.deleteMovieId = null
      this.showDeleteModal = false
    },
    closeNewDialog() {
      this.resetMoviePostDialog()
      this.newDialog = false
    },
    validateMovieFile(event) {
      this.movieFileErrors = []
      const file = event
      if (file === undefined) {
        this.movieFileErrors.push('動画ファイルは必須です。')
        return
      }

      if (file.type !== 'video/mp4' && file.type !== 'video/quicktime') {
        this.movieFileErrors.push('ファイルの形式が間違っています。')
        return
      }

      if (file.size > 1000000000) {
        this.movieFileErrors.push('ファイルサイズは1GBまでです。')
      }
    },
    validateNewThumbnailFile(event) {
      this.newThumbnailFileErrors = []
      const file = event
      if (file === undefined) {
        this.newThumbnailFileErrors.push('サムネイルは必須です。')
        this.newMovieThumbnailUrl = null
        return
      }

      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/gif' &&
        file.type !== 'image/png' &&
        file.type !== 'image/bmp'
      ) {
        this.newThumbnailFileErrors.push('ファイルの形式が間違っています。')
        return
      }

      if (file.size > 2000000) {
        this.newThumbnailFileErrors.push('ファイルサイズは2MBまでです。')
      }

      this.previewNewMovieThumbnail()
    },
    validateEditThumbnailFile(event) {
      this.editThumbnailFileErrors = []
      const file = event
      if (file === undefined) {
        this.editThumbnailFileErrors.push('サムネイルは必須です。')
        this.editMovieThumbnailUrl = null
        return
      }

      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/gif' &&
        file.type !== 'image/png' &&
        file.type !== 'image/bmp'
      ) {
        this.editThumbnailFileErrors.push('ファイルの形式が間違っています。')
        return
      }

      if (file.size > 2000000) {
        this.editThumbnailFileErrors.push('ファイルサイズは2MBまでです。')
      }

      this.previewEditMovieThumbnail()
    },
    previewNewMovieThumbnail() {
      if (
        this.newMovieThumbnail !== null &&
        this.newMovieThumbnail !== undefined
      ) {
        this.newMovieThumbnailUrl = URL.createObjectURL(this.newMovieThumbnail)
      } else {
        this.newMovieThumbnailUrl = null
      }
    },
    previewEditMovieThumbnail() {
      if (
        this.editMovieThumbnail !== null &&
        this.editMovieThumbnail !== undefined
      ) {
        this.editMovieThumbnailUrl = URL.createObjectURL(
          this.editMovieThumbnail
        )
      } else {
        this.editMovieThumbnailUrl = null
      }
    },
    async uploadNewMovie() {
      if (
        this.movieFileErrors.length !== 0 ||
        this.newThumbnailFileErrors.length !== 0
      ) {
        this.$nuxt.$emit('showMessage', 'ファイルが正しくありません。')
        return
      }

      const formData = new FormData()
      if (!this.newMovieFile || !this.newMovieThumbnail) {
        this.$nuxt.$emit('showMessage', 'ファイルを選択してください。')
        return
      }

      this.newDialogButtonEnable = false

      formData.append('uploadMovie', this.newMovieFile)
      formData.append('uploadThumbnail', this.newMovieThumbnail)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent.loaded)
          console.log(
            Math.floor((progressEvent.loaded * 100) / progressEvent.total) + '%'
          )
        },
      }

      const data = this
      await this.$axios
        .$post('/auth/api/v1/movie', formData, config)
        .then(function (response) {
          const jsonResponseData = JSON.parse(response)
          data.newDialog = false
          data.editDialog = true
          data.editMovieId = jsonResponseData.id
          data.editMovieTitle = jsonResponseData.title
          data.editMovieDescription = jsonResponseData.description
          data.editMoviePublic = 0
          data.editMovieStatus = 0
          data.getMovies()
          data.$nuxt.$emit('showMessage', '変更が完了しました。')
          data.resetMoviePostDialog()
        })
        .catch(function () {
          data.$nuxt.$emit(
            'showMessage',
            '変更に失敗しました。再度試してください。'
          )
        })

      this.newDialogButtonEnable = true
    },
    async uploadEditThumbnail() {
      if (this.editThumbnailFileErrors.length !== 0) {
        this.$nuxt.$emit('showMessage', 'ファイルが正しくありません。')
        return
      }
      if (!this.editMovieThumbnail) {
        this.$nuxt.$emit('showMessage', 'ファイルを選択してください。')
        return
      }

      this.editDialogButtonEnable = false
      const formData = new FormData()
      formData.append('uploadThumbnail', this.editMovieThumbnail)
      formData.append('movie_id', this.editMovieId)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent.loaded)
          console.log(
            Math.floor((progressEvent.loaded * 100) / progressEvent.total) + '%'
          )
        },
      }

      const data = this
      await this.$axios
        .$put('/auth/api/v1/thumbnail', formData, config)
        .then(function (response) {
          data.getMovies()
          data.resetEditThumbnailDialog()
        })
        .catch(function (error) {
          console.log(error)
        })
      this.editMovieThumbnailDialog = false
      this.editDialogButtonEnable = true
    },
    async editMovieInfo() {
      this.editDialogButtonEnable = false
      const requestData = {
        movie_id: this.editMovieId,
        display_name: this.editMovieTitle,
        description: this.editMovieDescription,
        public: this.editMoviePublic,
      }
      const data = this
      await this.$axios
        .$put('/auth/api/v1/movie', requestData)
        .then(function (response) {
          data.editDialog = false
          data.editTitleDialog = false
          data.editDescriptionDialog = false
          data.editPublicDialog = false
          data.getMovies()
        })
        .catch(function (error) {
          console.log(error)
        })
      this.editDialogButtonEnable = true
    },
    async deleteMovie() {
      try {
        await this.$axios.$delete(
          `/auth/api/v1/movie?movie_id=${this.deleteMovieId}`
        )
        this.$nuxt.$emit('showMessage', '動画の削除が完了しました')
        this.deleteMovieId = null
        this.getMovies()
        this.closeDeleteMovieModal()
      } catch {
        this.$nuxt.$emit(
          'showMessage',
          '動画の削除に失敗しました。再度試してください。'
        )
        this.deleteMovieId = null
        this.closeDeleteMovieModal()
      }
    },
    resetMoviePostDialog() {
      this.$refs.movieFileInput.reset()
      this.movieFileErrors = []
      this.$refs.newThumbnailFileInput.reset()
      this.newThumbnailFileErrors = []
      this.newMovieThumbnailUrl = null
    },
    resetEditThumbnailDialog() {
      this.$ref.editThumbnailFileInput.reset()
      this.editThumbnailFileErrors = []
      this.editMovieThumbnailUrl = null
    },
  },
}
</script>

<style lang="scss">
// サムネイル
table
  > tbody
  > tr.v-data-table__mobile-table-row
  > td.v-data-table__mobile-row:first-child {
  height: 200px !important;
}

// タイトル・概要
table > tbody > tr > td:nth-child(2) {
  width: 40% !important;
}

table
  > tbody
  > tr.v-data-table__mobile-table-row
  > td.v-data-table__mobile-row:nth-child(2) {
  height: 200px !important;
  width: 100% !important;
}

table
  > tbody
  > tr.v-data-table__mobile-table-row
  > td.v-data-table__mobile-row:nth-child(2)
  > div:nth-child(2) {
  width: 60% !important;
  max-height: 200px !important;
}

//進捗
table > tbody > tr > td:nth-child(3) {
  min-width: 160px !important;
}
</style>
