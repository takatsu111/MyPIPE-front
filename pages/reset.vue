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
                v-model="password"
                type="password"
                label="パスワード"
                @keydown.enter="registerWithEnterKey"
              />
              <p
                v-for="password_error in password_errors"
                :key="password_error"
                class="mb-0"
                style="font-size: 14px; color: red"
              >
                {{ password_error }}
              </p>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-text-field
                v-model="password_confirm"
                type="password"
                label="パスワード(再度入力してください)"
                @keydown.enter="registerWithEnterKey"
              />
              <p
                v-for="password_confirm_error in password_confirm_errors"
                :key="password_confirm_error"
                class="mb-0"
                style="font-size: 14px; color: red"
              >
                {{ password_confirm_error }}
              </p>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-btn block class="mr-4 blue white--text" @click="register">
                パスワード再設定
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
      password: '',
      password_confirm: '',
      password_errors: [],
      password_confirm_errors: [],
    }
  },
  methods: {
    async registerWithEnterKey(event) {
      if (event.keyCode === 13) {
        await this.register()
      }
    },
    async register() {
      this.password_errors = []
      this.password_confirm_errors = []
      alert(this.password.length)
      const passwordRegex = RegExp(/^[0-9a-zA-Z]*$/)
      if (
        !passwordRegex.test(this.password) ||
        !(this.password.length >= 8 && this.password.length <= 20)
      ) {
        this.password_errors.push(
          'パスワードは8文字以上20文字以下の半角英数字にしてください。'
        )
      }

      if (this.password !== this.password_confirm) {
        this.password_confirm_errors.push('パスワードと一致しません。')
      }

      if (
        this.password_errors.length === 0 &&
        this.password_confirm_errors.length === 0
      ) {
        try {
          const token = this.$route.query.token
          const requestData = {
            password_remember_token: token,
            password: this.password,
          }
          await this.$axios.$post('/api/v1/reset', requestData)
          this.$nuxt.$emit('showMessage', 'パスワードの再設定が完了しました。')
          this.$router.push('/login')
        } catch {
          this.$nuxt.$emit(
            'showMessage',
            'パスワード再設定に失敗しました。最初からやり直してください。'
          )
        }
      }
    },
  },
}
</script>
