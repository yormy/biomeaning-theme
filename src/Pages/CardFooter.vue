<template>
  <div class="d-flex justify-content-between my-3">
    <div>
      <div class="table_footer">{{ title }}</div>
    </div>

    <div class="table_search">
      <slot name="buttons">
      </slot>
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
