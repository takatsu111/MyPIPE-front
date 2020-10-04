<template>
  <div class="text--primary">
    {{ movieName }}
  </div>
</template>
<script>
export default {
  props: {
    movieName: {
      type: String,
      default: null,
    },
  },
}
</script>
