<template>
  <div>start</div>
</template>
<script>
export default {
  async created() {
    await this.$axios
      .$post('http://localhost/login', {
        email: 'taka2fesafas@tata.jp',
        password: 'takakura',
      })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
</script>
