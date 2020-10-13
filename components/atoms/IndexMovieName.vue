<template>
  <div
    class="text--primary"
    style="height: 5em; overflow: hidden; line-height: 1em"
  >
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
