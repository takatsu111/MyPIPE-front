<template>
  <div></div>
</template>
<script>
export default {
  mounted() {
    this.$auth.logout()
    this.$router.push('/login')
  },
}
</script>
