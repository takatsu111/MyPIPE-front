<template>
  <div class="mt-3">
    <v-card class="mt-5 mx-auto" max-width="600">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-row justify="center">
            <p cols="12" class="mt-3 display-1 grey--text">パスワード再設定</p>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-text-field
                v-model="email"
                label="メールアドレス"
                @keydown.enter="loginWithAuthModule"
              />
              <p class="caption mb-0" />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-btn
                block
                class="mr-4 blue white--text"
                @click="loginWithAuthModule"
              >
                パスワード再設定用のメールを送信する
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    }
  },
  methods: {
    async loginWithAuthModule() {
      if (!this.email) {
        this.$nuxt.$emit(
          'showMessage',
          'メールアドレスを正しく入力してください。'
        )
        return
      }

      const regex = RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      if (!regex.test(this.email)) {
        this.$nuxt.$emit(
          'showMessage',
          'メールアドレスを正しく入力してください。'
        )
      }

      try {
        const responseData = {
          email: this.email,
        }
        await this.$axios.$post(`/api/v1/remember`, responseData)
        this.email = ''
        this.$nuxt.$emit(
          'showMessage',
          'パスワード再設定用のメールを送信しました。'
        )
      } catch {
        this.$nuxt.$emit(
          'showMessage',
          'パスワード再設定用のメールを送信しました。'
        )
      }
    },
  },
}
</script>
