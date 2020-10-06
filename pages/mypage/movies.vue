<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-btn depressed color="#06ACB5" dark @click="newDialog = true">
            動画を投稿する
          </v-btn>
          <v-dialog v-model="newDialog" width="1000px">
            <v-card>
              <v-icon large @click="newDialog = false"> mdi-close </v-icon>
              <v-form
                ref="form"
                v-model="valid"
                class="px-15 py-5"
                lazy-validation
              >
                <v-file-input
                  v-model="newMovieFile"
                  accept="video/*"
                  label="動画を選択"
                  name="newMovie"
                ></v-file-input>
                <v-file-input
                  v-model="newMovieThumbnail"
                  accept="image/*"
                  label="サムネイルを選択"
                  name="newThumbnail"
                  @change="previewNewMovieThumbnail"
                ></v-file-input>
                <v-img
                  width="160px"
                  :height="newMovieThumbnailUrl === null ? 0 : '90px'"
                  :src="newMovieThumbnailUrl"
                  class="mb-4"
                  contain
                ></v-img>

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
    >
      <template v-slot:item.thumbnail="{ item }">
        <p style="display: none">{{ item.thumbnail }}</p>
        <v-img
          width="200px"
          height="120px"
          :src="item.thumbnail"
          contain
        ></v-img>
      </template>
      <template v-slot:item.progress="{ item }">
        <template v-if="item.progress === 0">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="20"
            :width="2"
            class="mr-2"
          ></v-progress-circular>
          <span>Processing</span>
        </template>
        <template v-if="item.progress === 1">
          <v-icon>mdi-check</v-icon>
          <span>Complete</span>
        </template>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          class="mr-2"
          color="primary"
          @click="openEditModal(item.id, item.title, item.description)"
        >
          編集
        </v-btn>
        <v-btn color="error"> 削除 </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" width="1000px">
      <v-card>
        <v-icon large @click="editDialog = false"> mdi-close </v-icon>
        <v-form ref="form" v-model="valid" class="px-15 py-5" lazy-validation>
          <v-text-field
            v-model="editMovieTitle"
            label="タイトル"
            required
            clearable
            name="editMovieTitle"
          ></v-text-field>

          <v-textarea
            v-model="editMovieDescription"
            label="概要"
            required
            clearable
            name="editMovieDescription"
          ></v-textarea>

          <v-file-input
            v-model="editMovieThumbnail"
            accept="image/*"
            label="サムネイルを選択"
            name="newThumbnail"
            @change="previewEditMovieThumbnail"
          ></v-file-input>
          <v-img
            width="340px"
            :height="editMovieThumbnailUrl === null ? 0 : auto"
            :src="editMovieThumbnailUrl"
            class="mb-4"
          ></v-img>

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
  </div>
</template>
<script>
export default {
  data() {
    return {
      newMovieTitle: null,
      newMovieDescription: null,
      newMovieFile: null,
      newMovieThumbnail: null,
      newMovieThumbnailUrl: null,
      newDialog: false,
      newDialogButtonEnable: true,
      editMovieId: null,
      editMovieTitle: null,
      editMovieDescription: null,
      editMovieThumbnail: null,
      editDialog: false,
      editDialogButtonEnable: true,
      headers: [
        { text: 'サムネイル', value: 'thumbnail' },
        {
          text: 'タイトル',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: '概要', value: 'description' },
        { text: '操作', value: 'action' },
        { text: '進行状況', value: 'progress' },
        { text: '投稿日', value: 'postedDay' },
      ],
      movies: [],
    }
  },
  async mounted() {
    const movies = await this.$axios.$get('/mymovies')
    console.log(movies)
    this.movies = movies
  },
  created() {
    const data = this
    const countup = function () {
      data.$axios.$get('/mymovies').then((res) => {
        data.movies = res
      })
    }
    setInterval(countup, 5000)
  },
  methods: {
    openEditModal(id, title, description) {
      this.editMovieId = id
      this.editMovieTitle = title
      this.editMovieDescription = description
      this.editDialog = true
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
    async uploadNewMovie() {
      this.newDialogButtonEnable = false
      const formData = new FormData()
      formData.append('upload_movie', this.newMovieFile)
      formData.append('upload_thumbnail', this.newMovieThumbnail)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }

      const data = this
      await this.$axios
        .$post('/mymovies', formData, config)
        .then(function (response) {
          console.log(response)
          data.newDialog = false
          data.editDialog = true
          data.editMovieId = response.id
          data.editMovieTitle = response.title
          data.editMovieDescription = response.description
        })
        .catch(function (error) {
          console.log(error)
        })

      this.newDialogButtonEnable = true
    },
    async editMovieInfo() {
      this.editDialogButtonEnable = false
      const formData = new FormData()
      formData.append('movie_id', this.editMovieId)
      formData.append('movie_title', this.editMovieTitle)
      formData.append('movie_description', this.editMovieThumbnail)
      formData.append('movie_thumbnail', this.editMovieThumbnail)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
      const data = this
      await this.$axios
        .$put('/mymovies', formData, config)
        .then(function (response) {
          console.log(response)
          data.editDialog = false
        })
        .catch(function (error) {
          console.log(error)
        })
      this.editDialogButtonEnable = true
    },
  },
}
</script>
