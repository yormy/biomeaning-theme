<template>
  <div class="d-flex justify-content-between">
    <div>
      <div class="table_title">
        <h1>{{title}}</h1>
      </div>
      <div v-if="subtitle" class="table_subtitle">{{subtitle}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },

    subtitle: {
      type: String,
      required: false,
    },

    messages: {
      type: Object,
      required: false,
    },
  },
}
</script>
