<template>
  <v-row justify="center">
    <v-progress-circular
      v-if="progress === 0"
      :size="70"
      indeterminate
      color="green"
      class="mt-5"
    ></v-progress-circular>
    <v-card
      v-if="progress !== 0"
      class="mx-auto mt-10"
      style="width: 100%; max-width: 850px"
    >
      <v-row>
        <v-col cols="12" class="text-center">
          <p v-if="progress === 1" class="text-center mb-0 py-5">
            メールアドレスの変更が完了しました。
          </p>
          <v-btn
            v-if="progress === 1"
            width="100%"
            max-width="400px"
            class="mr-4 blue white--text"
            nuxt
            link
            to="/login"
          >
            ログイン画面へ移動する
          </v-btn>
          <p v-if="progress === 2" class="text-center mb-0 py-5">
            メールアドレスの変更に失敗しました。<br />
            <nuxt-link to="/login">ログイン</nuxt-link
            >して、マイページからやり直してください。
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      progress: 0,
    }
  },
  async mounted() {
    try {
      const requestData = {
        email_change_token: this.$route.query.token,
      }
      await this.$axios.$put('/api/v1/email', requestData)
      this.progress = 1
    } catch {
      this.progress = 2
    }
  },
}
</script>
