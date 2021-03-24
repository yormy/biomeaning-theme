<template>
  <div>
    <v-dialog v-model="confirmModal" max-width="290">
      <v-card>
        <slot name="modal">
          <v-card-title class="red headline"><slot name="title">Confirm</slot></v-card-title>

          <v-card-text>
            <slot name="delete-preview"></slot>

            <v-textarea solo v-model="note" name="note" label="Note"></v-textarea>
          </v-card-text>
        </slot>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="doCancelled"> Cancel </v-btn>

          <v-btn color="red darken-1" text @click="doAgreed">
            <slot name="button-confirm">Confirm</slot>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <button @click.prevent="askConfirmation" class="btn btn-sm btn-danger float-left">
      <slot name="button-open">
        <span class="fal fa-fw fa-trash"></span> {{ $t('misc.delete') | capitalizeFirst }}
      </slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
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
  },

  data() {
    return {
      confirmModal: false,
      note: '',
    };
  },

  methods: {
    askConfirmation() {
      this.note = '';
      this.confirmModal = true;
    },

    doCancelled() {
      this.confirmModal = false;
    },

    doAgreed() {
      this.confirmModal = false;
      this.$emit('confirmedItem', this.item, this.note);
    },
  },
};
</script>

<style scoped></style>
