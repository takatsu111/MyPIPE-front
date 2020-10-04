<template>
  <p :style="{ color: color }">
    {{ message }}
  </p>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: 'red',
    },
  },
}
</script>
