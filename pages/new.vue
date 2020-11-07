<template>
  <div class="mt-3">
    <v-card class="mt-5 mx-auto" max-width="600">
      <v-container>
        <v-row justify="center">
          <p cols="12" class="mt-3 display-1 grey--text">新規登録</p>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" sm="10">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              @keydown.enter.stop="registerWithEnterKey"
            />
            <p class="caption mb-0" />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" sm="10">
            <v-btn block class="mr-4 blue white--text" @click="register">
              新規登録
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
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
    async registerWithEnterKey() {
      if (event.keyCode === 13) {
        await this.register()
      }
    },
    async register() {
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
        return
      }

      const requestData = {
        user_email: this.email,
      }
      try {
        await this.$axios.$post('/new', requestData)
        this.email = ''
        this.$nuxt.$emit('showMessage', '本登録用のメールを送信しました。')
      } catch {
        this.$nuxt.$emit(
          'showMessage',
          '登録に失敗しました。再度試してください。'
        )
      }
    },
  },
}
</script>
