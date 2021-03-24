<template>
  <v-text-field
    v-model="searchInput"
    append-icon="mdi-magnify"
    :label="$t('bedrock-core.action.search')"
    single-line
  ></v-text-field>
</template>

<script>
export default {
  data() {
    return {
      searchInput: '',
    };
  },

  watch: {
    searchInput() {
      this.$emit('update:searchInput', this.searchInput);
    },
  },
};
</script>
