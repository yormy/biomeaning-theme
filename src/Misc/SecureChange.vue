<script>
import APICODES from '@consts/apiCodes';
import CodeInput from './CodeInput.vue';
import { mergeErrors } from "../Helpers/formhelper.js";

export default {
  components: {
    CodeInput,
  },

  props: {
    changeActionUrl: String,
    tokenErrorMessage: String,

    authenticatorEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      confirmCode: '',
      confirmCodeInvalid: false,

      formConfirmCode: {
        isSubmitting: false,
      },

      form: {
        isSubmitting: false,
      },

      expiredMessage: '',

      confirmableAction: {
        xid: '',
        method: '',
        title: '',
        description: '',
      },

      passwordExpose: false,

      apiErrors: {},
      successMessage: '',

      emailWarning: {},

      backendhint: '',

      skipWarnings: false,

      passwordConfirmExpose: false,
    };
  },

  mounted() {},

  methods: {
    onCodeChange() {
      this.confirmCode = null;
    },

    onCodeComplete(value) {
      this.confirmCodeInvalid = false;
      this.confirmCode = value;
    },

    onCodeEnter() {
      this.submitChangeRequest();
    },

    isFormValid() {
      if (this.authenticatorEnabled && (!this.confirmCode || this.confirmCodeInvalid)) {
        return false;
      }

      if (!this.isInputValid()) {
        return false;
      }

      this.$refs.form.validate();
      return !this.$refs.form.flags.invalid;
    },

    submitChangeRequest() {
      if (!this.isFormValid()) {
        return;
      }

      this.form.isSubmitting = true;

      const data = this.getData();

      this.clearResponses();
      this.$http
        .post(this.changeActionUrl, data)
        .then((response) => {
          if (response.data.success) {
            this.successMessage = response.data.message;
            this.confirmableAction.xid = response.data.data.xid;
            this.confirmableAction.method = response.data.data.method;
            this.confirmableAction.title = response.data.data.title;
            this.confirmableAction.description = response.data.data.description;
          }
        })
        .catch((error) => {
          this.clearInput();
          this.apiErrors = mergeErrors(error);

          if (error.response.data.data && error.response.data.data.warnings) {
            this.emailWarning = error.response.data.data.warnings;
            this.backendhint = this.emailWarning.email.message;
            this.$refs.emailInput.focus();
            this.skipWarnings = true;
          }

          if (error.response.data.data) {
            if (error.response.data.data.code === APICODES.AUTH_AUTHENTICATOR_MISSING) {
              this.resetLoadingState();
              return;
            }
            if (error.response.data.data.code === APICODES.AUTH_AUTHENTICATOR_INVALID) {
              this.resetLoadingState();
              return;
            }
          }
          this.resetLoadingState();
        })
        .finally(() => {
          this.resetLoadingState();
        });
    },

    clearResponses() {
      this.apiErrors = {};
      this.successMessage = '';
    },

    clearInput() {
      if (this.$refs.codeInputComponent !== undefined) {
        this.$refs.codeInputComponent.clear();
      }
    },

    resetLoadingState() {
      this.form.isSubmitting = false;
    },
  },
};
</script>
