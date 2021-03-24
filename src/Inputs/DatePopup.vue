<template>
  <span>
    <v-dialog v-model="dateModal" max-width="300">
      <v-card>
        <v-date-picker
          v-model="dates"
          range
          full-width
        ></v-date-picker>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dateModal=false">
            {{ $t('bedrock-core.action.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <button @click="dateModal=true" :btnClass="btnClass">
      <slot name="button-content">
        <span class="fal fa-calendar"></span>
      </slot>
    </button>
  </span>
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

    confirmButton: {
      type: String,
      required: false,
    },

    btnClass: {
      type: String,
      default: 'btn btn-danger',
    },

    from: {
      type: String,
      required : true,
    },

    until: {
      type: String,
      required : true,
    },
  },

  data() {
    return {
      dateModal: false,
      dates: [this.from, this.until],
      headerText : this.header ? this.header : this.$t('bedrock-core.action.select'),
      confirmButtonText : this.confirmButton ? this.confirmButton : this.$t('bedrock-core.action.select'),
    };
  },

  watch: {
    dates() {
      let sorted = JSON.parse(JSON.stringify(this.dates));
      this.$emit('update:dates', sorted.sort());
    },
  },

};
</script>
