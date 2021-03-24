<template>
  <div>
    <div v-for="item in items" :key="item.text">
      <div v-if="item.loading || item.completed">
        <i v-if="item.loading && !item.completed" class="fa fa-spinner fa-spin">&nbsp;</i>
        <i v-if="item.completed" class="fa fa-check">&nbsp;</i>
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    startMs: {
      type: Number,
      default: 1000,
    },
    messages: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      items: [],
    };
  },

  watch: {
    reset() {
      this.resetBullets();
    },
  },

  mounted() {
    this.resetBullets();
    this.startAppearingBullets();
  },

  methods: {
    resetBullets() {
      this.items = JSON.parse(JSON.stringify(this.messages));
    },

    startAppearingBullets() {
      let completedTime = this.startMs;
      /*eslint-disable */
      this.items.forEach((item, index) => {
        window.setTimeout(() => {
          item.loading = true;
        }, completedTime);

        completedTime += item.processingMs;
        window.setTimeout(() => {
          item.completed = true;
          if (index === this.items.length - 1) {
            this.$emit('completed');
          }
        }, completedTime);
      });
      /* eslint-enable */
    },
  },
};
</script>
