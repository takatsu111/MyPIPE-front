<template>
  <v-container>
    <v-row class="mx-auto" style="max-width: 1200px">
      <v-col cols="12" sm="6" class="mt-4">
        <div
          class="mx-auto mb-5"
          style="
            background-color: #f0f0f0;
            width: 280px;
            height: 200px;
            padding: 50px 0;
          "
        >
          <v-img
            class="mx-auto mb-10"
            width="100px"
            height="100px"
            style="border-radius: 50%"
            contain
            src="https://imgsv.nikon-image.com/products/mirrorless/lineup/z_50/img/sample/pic_01_l.jpg"
          >
          </v-img>
        </div>
        <div class="text-center">
          <input
            ref="upload"
            style="display: none"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            @change="upload"
          />
          <v-btn @click="clicked">プロフィール画像を変更</v-btn>
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
          <div class="mb-5" v-for="error in errors.name" :key="error">
            {{ error }}
          </div>
          <v-btn @click="changeName">名前を変更</v-btn>
        </div>
        <div class="mb-10" width="100%">
          <v-text-field v-model="email" label="メールアドレス"></v-text-field>
          <div class="mb-5" v-for="error in errors.email" :key="error">
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
  components: { VueCropper },
  data() {
    return {
      name: '',
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      imgBeforeCrop: null,
      cropImgToShow: null,
      cropImg: null,
      uploadImg: null,
      openProfileImageModal: false,
      errors: {
        name: [],
        email: [],
        newPassword: [],
        confirmNewPassword: [],
      },
    }
  },
  async mounted() {
    const userData = await this.$axios.$get(`http://localhost/auth/api/v1/user`)
    this.name = userData.user_name
    this.email = userData.user_email
  },
  methods: {
    clicked() {
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
    async uploadProfileImage() {
      let data = null
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        this.cropImg = blob
        data = new FormData()
        data.append('profileImage', blob, blob.type)
      })

      try {
        await this.$axios.$post('http://localhost/profile-image', data)
      } catch (error) {
        console.log(error)
      }
    },
    changeName() {
      this.errors.name = []
      if (this.name.length === 0) {
        this.errors.name.push('名前は必須です。')
      }

      // if (this.errors.name.length !== 0) {
      //   return
      // }
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

      // if (this.errors.email.length !== 0) {
      //   return
      // }
    },
    changePassword() {
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
