<template>
  <div class="mt-3">
    <v-card class="mt-5 mx-auto" max-width="600">
      <v-container>
        <v-row justify="center">
          <p cols="12" class="mt-3 display-1 grey--text">ログイン</p>
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
            <v-text-field
              v-model="password"
              type="password"
              label="パスワード"
              @keydown.enter="loginWithAuthModule"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" sm="10">
            <p class="text-center" style="font-size: 14px">
              <nuxt-link to="/remember">パスワードをお忘れの方</nuxt-link>
            </p>
            <v-btn
              block
              class="mr-4 blue white--text"
              @click="loginWithAuthModule"
            >
              ログイン
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" sm="10">
            <v-btn
              block
              class="mr-4 mb-4 blue white--text"
              @click="loginAsTest1"
            >
              テストユーザー1としてログイン
            </v-btn>
            <v-btn
              block
              class="mr-4 mb-4 blue white--text"
              @click="loginAsTest2"
            >
              テストユーザー2としてログイン
            </v-btn>
            <v-btn
              block
              class="mr-4 mb-4 blue white--text"
              @click="loginAsTest3"
            >
              テストユーザー3としてログイン
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
      password: '',
      email: '',
    }
  },
  methods: {
    async loginWithEnterKey(event) {
      if (event.keyCode === 13) {
        await this.loginWithAuthModule()
      }
    },
    async loginAsTest1() {
      this.email = 'guest1@test.com'
      this.password = 'firstguest'
      await this.loginWithAuthModule()
    },
    async loginAsTest2() {
      this.email = 'guest2@test.com'
      this.password = 'secondguest'
      await this.loginWithAuthModule()
    },
    async loginAsTest3() {
      this.email = 'guest3@test.com'
      this.password = 'thirdguest'
      await this.loginWithAuthModule()
    },
    async loginWithAuthModule() {
      const self = this
      await this.$auth
        .loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        .then(
          (response) => {
            if (this.$store.state.lastAuthFailedPage.lastAuthFailedURL) {
              this.$store.commit(`lastAuthFailedPage/reset`)
              self.$router.back()
            }
            self.$nuxt.$emit('showMessage', 'ログインが完了しました。')
            return response
          },
          (error) => {
            self.$nuxt.$emit(
              'showMessage',
              'メールアドレスもしくはパスワードが異なります。'
            )
            return error
          }
        )
    },
  },
}
</script>
