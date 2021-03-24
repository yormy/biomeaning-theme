<script>
import EventBus from './event-bus';
import store from './store';

export default {
  props: {
    caseSensitive: {
      type: Boolean,
      default: false,
    },

    selectedItemId: {
      type: String,
    },
  },

  data() {
    return {
      dialog: false,
      searchInput: null,
      reviewStatusSelected: '',
      textStatusSelected: '',
      editedIndex: -1,
      editedItem: {},
      submitErrors: [],

      selectedItems: [],
      filteredList: [],
      headers: null,
      state: store.state,
    };
  },

  created() {
    if (this.state.fromLang) {
      if (this.state.fromLang === this.state.toLang) {
        this.setHeadersBaseLanguage();
      } else {
        this.setHeadersNonBase();
      }
    } else {
      this.setHeaders();
    }
  },

  mounted() {
    this.selectedItems = [this.filteredList[this.state.selectedItemIndex]];
    // const item = this.filteredList[this.state.selectedItemIndex];
    // store.setSelectedIndex(0);
    //
    // // preselect the item in the queryparam
    // const foundIndex = this.searchInList(this.state.items, 'meta.id', this.selectedItemId);
    // if (foundIndex > -1) {
    //   store.setSelectedIndex(foundIndex);
    //   this.selectedItems = [this.filteredList[this.state.selectedItemIndex]];
    // }
  },

  computed: {
    searchData() {
      if (this.searchInput === '' || !this.searchInput) {
        return '@';
      }
      return this.searchInput;
    },
  },

  watch: {
    dialog(val) {
      return val || this.close();
    },

    'state.selectedItemIndex': function () { /* eslint-disable-line */
      this.selectedItems = [this.filteredList[this.state.selectedItemIndex]];
      if (this.selectedItemIndex > -1) {
        // const item = this.filteredList[this.state.selectedItemIndex];
        store.setSelectedIndex(this.state.selectedItemIndex);
      }
    },
  },

  methods: {
    addItem() {
      EventBus.$emit('multilingual-item-new');
    },

    canAdd() {
      return this.state.allowCreate && this.state.fromLang === this.state.toLang;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      }, 300);
    },

    searchCase(value, search) {
      if (this.caseSensitive) {
        return this.searchCaseSensitive(value, search);
      }
      return this.searchCaseInsensitive(value, search);
    },

    searchCaseInsensitive(value, search) {
      return value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1;
    },

    searchCaseSensitive(value, search) {
      return value.indexOf(search) !== -1;
    },

    filter(value, search, item) {
      if (!this.reviewStatusSelected.key && !this.textStatusSelected.key) {
        return (
          value !== null &&
          search !== null &&
          typeof value === 'string' &&
          this.searchCase(value, search)
        );
      }

      if (search === null || search === '') {
        return (
          value !== null &&
          typeof value === 'string' &&
          this.filterReviewState(item) &&
          this.filterTextState(item)
        );
      }

      return (
        value !== null &&
        search !== null &&
        typeof value === 'string' &&
        this.filterReviewState(item) &&
        this.filterTextState(item) &&
        this.searchCase(value, search)
      );
    },

    filterReviewState(item) {
      if (!this.reviewStatusSelected.key) {
        return true;
      }
      return item.meta.review_status === this.reviewStatusSelected.key;
    },

    filterTextState(item) {
      if (!this.textStatusSelected.key) {
        return true;
      }
      return item.meta.text_status === this.textStatusSelected.key;
    },

    getFiltered(filteredItems) {
      this.filteredList = filteredItems;

      if (filteredItems.length > -1) {
        let goSelectIndex = 0;
        if (this.state.selectedItemIndex < filteredItems.length) {
          goSelectIndex = this.state.selectedItemIndex;
        }

        const item = this.filteredList[goSelectIndex];
        // this.$emit('rowClicked', item, goSelectIndex);
        store.setSelectedFilteredIndexItem(goSelectIndex, item);
      }
    },

    rowClick(item) {
      const filteredIndex = this.findIndex(item);
      store.setSelectedFilteredIndexItem(filteredIndex, item);
    },

    findIndex(item) {
      let foundIndex = -1;
      this.filteredList.forEach((value, index) => {
        if (value.meta.id === item.meta.id) {
          foundIndex = index;
        }
      });
      return foundIndex;
    },

    findIndexBeta(itemKeyValue, itemKeyName) {
      let foundIndex = -1;
      this.filteredList.forEach((value, index) => {
        if (value[itemKeyName] === itemKeyValue) {
          foundIndex = index;
        }
      });
      return foundIndex;
    },

    searchInList(items, keyName, searchValue) {
      let foundIndex = -1;
      items.forEach((value, index) => {
        const nestedValue = this.getNestedValue(value, keyName);
        if (nestedValue === searchValue) {
          foundIndex = index;
        }
      });
      return foundIndex;
    },

    getNestedValue(obj, prop) {
      const props = prop.split('.'); // split property names

      let values = JSON.parse(JSON.stringify(obj)); // deep copy

      for (let i = 0; i < props.length; i += 1) {
        if (typeof values !== 'undefined') {
          values = values[props[i]]; // go next level
        }
      }
      return values;
    },
  },
};
</script>

<style>
/*!* Hard hide the column of the DUMMY data *!*/
/*::v-deep .v-data-table__wrapper thead tr th:nth-of-type(7) {*/
/*    display:none;*/
/*}*/
/*::v-deep .v-data-table__wrapper tr td:nth-of-type(7) {*/
/*    display:none;*/
/*}*/

::v-deep .v-data-table__wrapper thead tr th:nth-of-type(3) {
    color:red;
}

::v-deep .v-data-table__wrapper thead tr th.hidden {
  display: none;
}

::v-deep .v-card__title.danger {
  background-color: red;
}

::v-deep tr.v-data-table__selected {
  background: #7d92f5 !important;
}

::v-deep tr.v-data-table__expanded.v-data-table__expanded__content {
  background: #ff0000 !important;
  box-shadow: none !important;
}

</style>
