<template>
  <div>
    <v-dialog v-model="addModal" width="auto ">
      <v-card>
        <slot name="modal">
          <v-card-title class="green headline" :class="headerClass">{{ headerText }}</v-card-title>

          <v-card-text>
            <h3>{{ title }} </h3>
            <p>{{ description }}</p>
            <slot name="form"></slot>
          </v-card-text>
        </slot>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="doCancelled">
            {{ $t('bedrock-core.general.cancel') }}
          </v-btn>

          <v-btn color="green darken-1" text @click="doAddItem">
            {{ confirmButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <button-submit :is-loading="isLoading" @clicked="showForm" :btn-class="btnClass">
      <slot name="button-content">
        <span class="fal fa-plus"></span>
        <span v-if="withText">
          {{ confirmButtonText }}
        </span>
      </slot>
    </button-submit>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      required: false,
    },




    iconAppend: {
      type: String,
    },

    disabled: {
      type: Boolean,
    },

    isLoading: {
      type: Boolean,
    },

    withText: {
      type: Boolean,
      default: false,
    },

    btnClass: {
      type: String,
    },

    headerClass: {
      type: String,
    },

    confirmButton: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      addModal: false,
      headerText : this.header ? this.header : this.$t('bedrock-core.action.add'),
      confirmButtonText : this.confirmButton ? this.confirmButton : this.$t('bedrock-core.action.add'),
    };
  },

  methods: {
    showForm() {
      this.addModal = true;
    },

    doCancelled() {
      this.addModal = false;
    },

    doAddItem() {
      this.addModal = false;
      this.$emit('addItem');
    },
  },
};
</script>
