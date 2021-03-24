<template>
  <div>
    <ul class="navbar-nav">
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown2"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="flag-icon" :class="flagIcon"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown2">
          <a v-if="locale !== 'en'" class="dropdown-item" href="?locale=en"
            ><i class="flag-icon flag-icon-us"></i> English</a
          >
          <a v-if="locale !== 'nl'" class="dropdown-item" href="?locale=nl"
            ><i class="flag-icon flag-icon-nl"></i> Nederlands</a
          >
          <a v-if="locale !== 'de'" class="dropdown-item" href="?locale=de"
            ><i class="flag-icon flag-icon-de"></i> Deutsch</a
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import getLocale from "../Plugins/locale.js";

export default {
  data() {
    return {
      locale: '',
    };
  },

  props: {
    buttonTextDefault: {
      type: String,
      required: false,
    },
  },

  computed: {
    flagIcon() {
      if (this.locale === 'en') {
        return 'flag-icon-us';
      }
      if (this.locale === 'nl') {
        return 'flag-icon-nl';
      }
      if (this.locale === 'de') {
        return 'flag-icon-de';
      }

      return 'flag-icon-us';
    },
  },

  mounted() {
    this.locale = getLocale();
  },

  methods: {},
};
</script>

<style scoped></style>
