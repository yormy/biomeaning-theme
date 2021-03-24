
<template>
  <div
    v-bind:class="{
      'vue-code-input-container': true,
      [className]: !!className,
    }"
    v-bind:style="{ width: `${fields * fieldWidth + fieldSpace}px` }"
  >
    <p class="title" v-if="title">{{ title }}</p>
    <div class="vue-code-input">
      <template v-for="(v, index) in values">
        <input
          :type="type === 'number' ? 'tel' : type"
          :pattern="pattern"
          :autoFocus="autoFocus && !loading && index === autoFocusIndex"
          :style="{
            width: `${fieldWidth}px`,
            height: `${fieldHeight}px`,
          }"
          :key="`${id}-${index}`"
          :data-id="index"
          :value="v"
          :ref="iRefs[index]"
          v-on:input="onValueChange"
          v-on:focus="onFocus"
          v-on:keydown="onKeyDown"
          v-on:paste="onPaste"
          :disabled="disabled"
          :required="required"
          maxlength="1"
          :class="invalidInput ? 'vue-code-input-error' : ''"
        />
      </template>
    </div>
    <div v-if="loading" class="loading" :style="{ lineHeight: `${fieldHeight}px` }">
      <div class="blur" />
      <svg
        class="spin"
        viewBox="0 0 1024 1024"
        data-icon="loading"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill="#006fff"
          d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45
          0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9
          0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874
          150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
const KEY_CODE = {
  backspace: 8,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46,
  space: 32,
  enter: 13,
};

export default {
  name: 'CodeInput',

  props: {
    type: {
      type: String,
      default: 'number',
    },
    className: String,
    fields: {
      type: Number,
      default: 6,
    },
    fieldWidth: {
      type: Number,
      default: 58,
    },
    fieldSpace: {
      type: Number,
      default: 10,
    },
    fieldHeight: {
      type: Number,
      default: 54,
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    title: String,
    change: Function,
    complete: Function,
    loading: {
      type: Boolean,
      default: false,
    },

    invalidInput: null,
  },

  data() {
    const { fields, values } = this;
    let vals = [];
    let autoFocusIndex = 0;
    if (values && values.length) {
      vals = [];
      for (let i = 0; i < fields; i += 1) {
        vals.push(values[i] || '');
      }
      autoFocusIndex = values.length >= fields ? 0 : values.length;
    } else {
      vals = Array(fields).fill('');
    }

    this.iRefs = [];
    for (let i = 0; i < fields; i += 1) {
      this.iRefs.push(`input_${i}`);
    }

    this.id = +new Date();
    return { values: vals, autoFocusIndex };
  },

  computed: {
    pattern() {
      let pattern = '[0-9a-zA-Z]';
      if (this.type === 'number') {
        pattern = '[0-9]';
      }

      return pattern;
    },
  },

  methods: {
    onPaste(event) {
      event.preventDefault();
      const pastedValue = event.clipboardData.getData('Text');
      this.setCode(pastedValue);
    },

    setCode(input) {
      for (let i = 0; i < this.fields; i += 1) {
        const item = this.iRefs[i];
        const element = this.$refs[item][0];
        this.values[i] = input[i];
        element.value = input[i];

        this.$refs[this.iRefs[0]][0].focus();
        this.triggerChange();
      }
    },

    clear() {
      for (let i = 0; i < this.fields; i += 1) {
        const item = this.iRefs[i];
        const element = this.$refs[item][0];
        this.values[i] = '';
        element.value = '';

        this.$refs[this.iRefs[0]][0].focus();
      }
    },

    onFocus(e) {
      e.target.select(e);
    },

    onValueChange(e) {
      const index = parseInt(e.target.dataset.id, 10);
      const { type, fields } = this;

      if (type === 'number') {
        e.target.value = e.target.value.replace(/[^\d]/gi, '');
      }
      if (type === 'string') {
        e.target.value = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
      }

      // this.handleKeys[index] = false
      if (e.target.value === '' || (type === 'number' && !e.target.validity.valid)) {
        return;
      }

      let next = 0;
      const { value } = e.target;
      let { values } = this;
      values = Object.assign([], values);
      if (value.length > 1) {
        let nextIndex = value.length + index - 1;
        if (nextIndex >= fields) {
          nextIndex = fields - 1;
        }
        next = this.iRefs[nextIndex];
        const split = value.split('');
        split.forEach((item, i) => {
          const cursor = index + i;
          if (cursor < fields) {
            values[cursor] = item;
          }
        });
        this.values = values;
      } else {
        next = this.iRefs[index + 1];
        values[index] = value;
        this.values = values;
      }

      if (next) {
        const element = this.$refs[next][0];
        element.focus();
        element.select();
      }

      this.triggerChange(values);
    },

    onKeyDown(e) {
      const index = parseInt(e.target.dataset.id, 10);
      const prevIndex = index - 1;
      const nextIndex = index + 1;
      const prev = this.iRefs[prevIndex];
      const next = this.iRefs[nextIndex];
      switch (e.keyCode) {
        case KEY_CODE.enter: {
          e.preventDefault();
          const val = this.values.join('');
          if (val.length >= this.fields) {
            this.$emit('enter', val);
          }
          break;
        }

        case KEY_CODE.space: {
          e.preventDefault();
          break;
        }

        case KEY_CODE.delete: {
          e.preventDefault();
          const vals = [...this.values];
          vals[index] = '';
          this.values = vals;
          this.triggerChange(vals);
          break;
        }

        case KEY_CODE.backspace: {
          e.preventDefault();
          const vals = [...this.values];
          if (this.values[index]) {
            vals[index] = '';
            this.values = vals;
            this.triggerChange(vals);
          } else if (prev) {
            vals[prevIndex] = '';
            this.$refs[prev][0].focus();
            this.values = vals;
            this.triggerChange(vals);
          }
          break;
        }
        case KEY_CODE.left:
          e.preventDefault();
          if (prev) {
            this.$refs[prev][0].focus();
          }
          break;
        case KEY_CODE.right:
          e.preventDefault();
          if (next) {
            this.$refs[next][0].focus();
          }
          break;
        case KEY_CODE.up:
        case KEY_CODE.down:
          e.preventDefault();
          break;
        default:
          // this.handleKeys[index] = true
          break;
      }
    },

    triggerChange(values = this.values) {
      const { fields } = this;
      const val = values.join('');
      this.$emit('change', val);
      if (val.length >= fields) {
        this.$emit('complete', val);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vue-code-input-container {
  position: relative;
}

.vue-code-input > input {
  border: solid 1px #a8adb7;
  border-right: none;
  font-family: 'Lato';
  font-size: 20px;
  color: #525461;
  text-align: center;
  box-sizing: border-box;
  border-radius: 0;
  -webkit-appearance: initial;
}

.vue-code-input > input:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.vue-code-input > input:last-child {
  border-right: solid 1px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.vue-code-input > input:nth-of-type(3) {
  border-right: solid 1px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  margin-right: 10px;
}

.vue-code-input > input:nth-of-type(4) {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.vue-code-input > input:focus {
  outline: none;
  border: 2px solid #006fff;
  caret-color: #006fff;
}

.vue-code-input > input:focus + input {
  border-left: none;
}

.vue-code-input > input.vue-code-input-error {
  border-color: #ff0000;
}

.loading {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
}

.blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  opacity: 0.5;
  filter: blur(0.5px);
  transition: opacity 0.3s;
}

.title {
  margin: 0;
  height: 20px;
  padding-bottom: 10px;
}

.spin {
  display: inline-block;
  animation: loadingCircle 1s infinite linear;
}

@keyframes loadingCircle {
  100% {
    transform: rotate(360deg);
  }
}
</style>
