<template>
  <div class="load">
    <div class="load-image">
      <img src="/logotype.svg" alt="logotype">
    </div>
    <div class="load-bg">
      <img src="/load/background.webp" alt="background">
    </div>
  </div>
</template>

<script lang="ts">
export default {
  components: {
  },

  setup() {
  },

  data() {
    return {
      loading: true,
    };
  },

  methods: {
  },
};
</script>

<style scoped lang="scss">
@use './Load.scss' as *;
</style>