<template>
  <div>
    <ValidationProvider v-slot="{ errors }" rules="required|email|min:5" name="email">
      <v-text-field
        ref="emailInput"
        :id="id"
        autocomplete="email"
        v-model="form.email"
        append-icon="fal fa-envelope"
        :label="label"
        :hint="emailField.hint"
        :persistent-hint="emailField.persistentHint"
        :type="'email'"
        :error-messages="apiErrors.email ? apiErrors.email : errors"
        :color="emailColor"
        :class="emailField.className"
        @keydown="apiErrors.email = ''"
        @keyup="$emit('update:email-address', form.email)"
        @blur="checkEmail"
        outlined
      >
      </v-text-field>
    </ValidationProvider>
  </div>
</template>

<script>
import emailcheck from './emailcheck.js';

export default {
  props: {
    id: {
      type: String,
      required: false,
    },

    label: {
      type: String,
      required: false,
    },

    emailAddress: {
      type: String,
      required: false,
    },

    hint: {
      type: String,
      required: false,
    },

    validateNow: {
      type: Boolean,
      required: false,
    },

    apiErrors: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: {
        email: this.emailAddress,
      },

      emailWarning: {},
      emailField: {
        persistentHint: false,
        className: '',
        hint: '',
        type: '',
      },
      skipWarnings: false,

      didYouMean: this.$t('bedrock-core.email.did_you_mean') + " ",
    };
  },

  watch: {
    hint() {
      this.setEmailWarning(this.hint);
    },

    validateNow() {
      this.checkEmail();
    },
  },

  computed: {
    emailColor() {
      if (this.emailField.type === 'WARNING') {
        return 'orange';
      }

      return !this.apiErrors.email && this.form.email ? 'success' : '';
    },
  },

  methods: {
    isFormValid() {
      this.$refs.form.validate();
      return !this.$refs.form.flags.invalid;
    },

    checkEmail() {
      const emailToCheck = this.form.email;
      const checker = new emailcheck();
      const that = this;
      checker.run({
        email: emailToCheck,
        // domains, // optional
        // topLevelDomains, // optional
        // secondLevelDomains, // optional
        // distanceFunction: superStringDistance, // optional
        suggested(suggestion) {
          if (emailToCheck.toUpperCase() === suggestion.full.toUpperCase()) {
            that.clearEmailWarning();
          } else {
            that.setEmailWarning(`${that.didYouMean} ${suggestion.full}`);
            that.$emit('email-has-warning');
          }
        },
        empty() {
          that.clearEmailWarning();
        },
      });
    },

    setEmailWarning(message) {
      this.emailField.persistentHint = true;
      this.emailField.className = 'warning-hint';
      this.emailField.hint = message;
      this.emailField.type = 'WARNING';
    },

    clearEmailWarning() {
      this.emailWarning = {};

      this.emailField.persistentHint = false;
      this.emailField.className = '';
      this.emailField.hint = '';
      this.emailField.type = '';
    },
  },
};
</script>

<style scoped>
::v-deep .warning-hint .v-messages__message {
  color: orangered !important;
  font-size: 12px;
}
</style>
