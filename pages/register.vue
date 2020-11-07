<template>
  <div class="mt-3">
    <v-card class="mt-5 mx-auto" max-width="600">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-row justify="center">
            <p cols="12" class="mt-3 display-1 grey--text">本登録</p>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-text-field v-model="user_name" label="名前" />
              <p
                v-for="name_error in name_errors"
                :key="name_error"
                class="mb-0"
                style="font-size: 14px; color: red"
              >
                {{ name_error }}
              </p>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-text-field
                v-model="user_password"
                type="password"
                label="パスワード"
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
                v-model="user_password_confirm"
                type="password"
                label="パスワード(再度入力してください)"
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
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="user_birthday"
                    label="生年月日"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="user_birthday"
                  locale="ja-jp"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                  @change="save"
                ></v-date-picker>
              </v-menu>
              <p
                v-for="birthday_error in birthday_errors"
                :key="birthday_error"
                class="mb-0"
                style="font-size: 14px; color: red"
              >
                {{ birthday_error }}
              </p>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="10" sm="10">
              <v-btn block class="mr-4 blue white--text" @click="register">
                本登録
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
      user_birthday: '',
      menu: false,
      user_name: '',
      user_password: '',
      user_password_confirm: '',
      name_errors: [],
      password_errors: [],
      password_confirm_errors: [],
      birthday_errors: [],
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date)
    },
    async register() {
      this.name_errors = []
      this.password_errors = []
      this.password_confirm_errors = []
      this.birthday_errors = []
      if (!this.user_name) {
        this.name_errors.push('名前を正しく入力してください。')
      }

      const passwordRegex = RegExp(/^[0-9a-zA-Z]*$/)
      if (
        !passwordRegex.test(this.user_password) ||
        !(this.user_password.length >= 8 && this.user_password.length <= 20)
      ) {
        this.password_errors.push(
          'パスワードは8文字以上20文字以下の半角英数字にしてください。'
        )
      }

      if (this.user_password !== this.user_password_confirm) {
        this.password_confirm_errors.push('パスワードと一致しません。')
      }

      if (!this.user_birthday) {
        this.birthday_errors.push('生年月日を設定してください。')
      }

      if (
        this.name_errors.length === 0 &&
        this.password_errors.length === 0 &&
        this.password_confirm_errors.length === 0 &&
        this.birthday_errors.length === 0
      ) {
        try {
          const token = this.$route.query.token
          const requestData = {
            user_name: this.user_name,
            user_password: this.user_password,
            user_birthday: this.user_birthday,
          }
          await this.$axios.$post('/register?token=' + token, requestData)
          this.$nuxt.$emit('showMessage', '本登録が完了しました。')
          this.$router.push('/login')
        } catch {
          this.$nuxt.$emit(
            'showMessage',
            '本登録に失敗しました。再度新規登録をやり直してください。'
          )
        }
      }
    },
  },
}
</script>
