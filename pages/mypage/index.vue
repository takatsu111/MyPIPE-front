<template>
  <v-container>
    <v-row class="mx-auto" style="max-width: 1200px">
      <v-col cols="12" sm="6" class="mt-4">
        <div
          class="mx-auto mb-5 text-center"
          style="
            background-color: #f0f0f0;
            width: 280px;
            height: 200px;
            padding: 50px 0;
          "
        >
          <v-img
            v-if="profileImageURL"
            class="mx-auto mb-10"
            width="100px"
            height="100px"
            style="border-radius: 50%"
            contain
            :src="profileImageURL"
          >
          </v-img>
          <v-icon v-else class="mb-auto" style="font-size: 100px"
            >mdi-account-circle</v-icon
          >
        </div>
        <div class="text-center">
          <input
            ref="upload"
            style="display: none"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            @change="upload"
          />
          <v-btn @click="selectFile">プロフィール画像を変更</v-btn>
          <v-dialog v-model="openProfileImageModal" max-width="900px">
            <v-sheet>
              <vue-cropper
                ref="cropper"
                :guides="true"
                :view-mode="2"
                :auto-crop-area="0.5"
                :min-container-width="200"
                :min-container-height="300"
                :background="true"
                :rotatable="false"
                :img-style="{ width: '200px', height: '200px' }"
                :aspect-ratio="1 / 1"
                drag-mode="crop"
                :src="file"
                alt="Source Image"
                @cropstart="cropImage"
                @cropend="cropImage"
                @ready="cropImage"
                @zoom="cropImage"
              >
              </vue-cropper>
              <div class="py-10">
                <div class="text-center">
                  プロフィール画像に使う領域を選択してください
                </div>
                <v-img
                  class="mx-auto"
                  style="border-radius: 50%"
                  width="100px"
                  height="100px"
                  contain
                  :src="cropImgToShow"
                ></v-img>
                <v-btn class="d-block mx-auto mt-10" @click="uploadProfileImage"
                  >決定</v-btn
                >
              </div>
            </v-sheet>
          </v-dialog>
        </div>
      </v-col>
      <v-col cols="12" sm="6">
        <div class="mb-10" width="100%">
          <v-text-field
            v-model="name"
            v-validate="'required'"
            label="名前"
          ></v-text-field>
          <div v-for="error in errors.name" :key="error" class="mb-5">
            {{ error }}
          </div>
          <v-btn @click="changeName">名前を変更</v-btn>
        </div>
        <div class="mb-10" width="100%">
          <v-text-field v-model="email" label="メールアドレス"></v-text-field>
          <div v-for="error in errors.email" :key="error" class="mb-5">
            {{ error }}
          </div>
          <v-btn @click="changeEmail">メールアドレスを変更</v-btn>
        </div>
        <div class="mb-10" width="100%">
          <v-text-field
            v-model="newPassword"
            type="password"
            label="新しいパスワード"
          ></v-text-field>
          <div v-for="error in errors.newPassword" :key="error" class="mb-5">
            {{ error }}
          </div>
          <v-text-field
            v-model="confirmNewPassword"
            type="password"
            label="新しいパスワード(確認用)"
          ></v-text-field>
          <div
            v-for="error in errors.confirmNewPassword"
            :key="error"
            class="mb-5"
          >
            {{ error }}
          </div>
          <v-btn @click="changePassword">パスワードを変更</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  middleware: ['checkLoggedIn'],
  components: { VueCropper },
  data() {
    return {
      id: null,
      name: '',
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      imgBeforeCrop: null,
      cropImgToShow: null,
      cropImg: null,
      uploadImg: null,
      openProfileImageModal: false,
      profileImageName: '',
      errors: {
        name: [],
        email: [],
        newPassword: [],
        confirmNewPassword: [],
      },
    }
  },
  computed: {
    profileImageURL() {
      if (this.profileImageName) {
        return `http://d100q3wt0wdr5h.cloudfront.net/profile_images/${this.id}/${this.profileImageName}`
      }
      return ''
    },
  },
  async mounted() {
    await this.getUserData()
  },
  methods: {
    async getUserData() {
      const userData = await this.$axios.$get(`/auth/api/v1/user`)
      this.id = userData.user_id
      this.name = userData.user_name
      this.email = userData.user_email
      this.profileImageName = userData.user_profile_image_name
    },
    selectFile() {
      this.$refs.upload.click()
    },
    upload() {
      this.cropImgToShow = null
      this.openProfileImageModal = true
      const file = this.$refs.upload.files[0]

      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imgBeforeCrop = event.target.result
          this.$refs.cropper.replace(event.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }

      this.$refs.upload.value = ''
    },
    cropImage() {
      this.cropImgToShow = this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    uploadProfileImage() {
      const self = this
      this.$refs.cropper.getCroppedCanvas().toBlob(async (blob) => {
        const requestBody = new FormData()

        const profileImageFile = new File(
          [blob],
          `profileImage.${blob.type.split('/')[1]}`
        )
        requestBody.append('profileImage', profileImageFile)

        try {
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
          await self.$axios.$put(
            '/auth/api/v1/profile-image',
            requestBody,
            config
          )
          self.openProfileImageModal = false
          this.$nuxt.$emit(
            'showMessage',
            'プロフィール画像の変更が完了しました。'
          )
          this.$nuxt.$emit('getUserData')
        } catch (error) {
          this.$nuxt.$emit(
            'showMessage',
            'プロフィール画像の変更に失敗しました。再度試してください。'
          )
          console.log(error)
        }
        self.getUserData()
      })
    },
    async changeName() {
      this.errors.name = []
      if (this.name.length === 0) {
        this.errors.name.push('名前は必須です。')
        return
      }
      const requestData = {
        user_name: this.name,
      }
      try {
        await this.$axios.$put('/auth/api/v1/user-name', requestData)
        this.$nuxt.$emit('showMessage', '名前の変更が完了しました。')
        this.$nuxt.$emit('getUserData')
      } catch (error) {
        this.$nuxt.$emit(
          'showMessage',
          '名前の変更に失敗しました。再度試してください。'
        )
        console.log(error)
      }
    },
    changeEmail() {
      this.errors.email = []
      if (this.email.length === 0) {
        this.errors.email.push('メールアドレスは必須です。')
        return
      }

      const regex = RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      if (!regex.test(this.email)) {
        this.errors.email.push('メールアドレスを正しく入力してください。')
      }
    },
    async changePassword() {
      this.errors.newPassword = []
      this.errors.confirmNewPassword = []
      const newPasswordRegex = RegExp(/^[0-9a-zA-Z]*$/)
      if (
        !newPasswordRegex.test(this.newPassword) ||
        !(this.newPassword.length >= 8 && this.newPassword.length <= 20)
      ) {
        this.errors.newPassword.push(
          'パスワードは8文字以上20文字以下の半角英数字にしてください。'
        )
      }

      if (this.confirmNewPassword !== this.newPassword) {
        this.errors.confirmNewPassword.push('新しいパスワードと異なります。')
      }

      const requestData = {
        password: this.newPassword,
      }
      try {
        await this.$axios.$put('/auth/api/v1/password', requestData)
        this.$nuxt.$emit('showMessage', 'パスワードの変更が完了しました。')
        this.$nuxt.$emit('getUserData')
        this.newPassword = ''
        this.confirmNewPassword = ''
      } catch (error) {
        this.$nuxt.$emit(
          'showMessage',
          'パスワードの変更に失敗しました。再度試してください。'
        )
        console.log(error)
      }
    },
  },
}
</script>
<style>
.cropper-crop-box,
.cropper-view-box {
  border-radius: 50% !important;
}

.cropper-view-box {
  box-shadow: 0 0 0 1px #39f !important;
  outline: 0 !important;
}
</style>
