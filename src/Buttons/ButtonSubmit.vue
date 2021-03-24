<template>
  <span>
    <button :id="id" :class="btnClass" :disabled="isDisabled()" @click="clicked">
      <span v-if="iconPrepend" :class="iconPrepend"></span>

      <span v-if="isLoading">
        <span class="fa fa-spinner fa-spin"></span>
        <slot name="loading-title">Loading...</slot>
      </span>
      <span v-else>
        <slot></slot>
      </span>

      <span v-if="iconAppend" :class="iconAppend"></span>
    </button>
  </span>
  <!--            <div v-if="'' !== errorMessage" class="text-danger">-->
  <!--                &nbsp;{{ errorMessage }}-->
  <!--            </div>-->
  <!--            <div v-if="'' !== successMessage" class="text-success">-->
  <!--                &nbsp;{{ successMessage }}-->
  <!--            </div>-->
  <!--        </div>-->
  <!--    </div>-->
</template>

<script>
export default {
  props: {
    id: {
      type: String,
    },

    iconPrepend: {
      type: String,
    },

    iconAppend: {
      type: String,
    },

    btnClass: {
      type: String,
      default: 'btn btn-success',
    },

    disabled: {
      type: Boolean,
    },

    isLoading: {
      type: Boolean,
    },
  },

  methods: {
    isDisabled() {
      return this.disabled || this.isLoading;
    },

    clicked() {
      if (!this.isDisabled()) {
        this.$emit('clicked');
      }
    },
  },
};
</script>

<style scoped></style>
