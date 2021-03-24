export default {
  state: {
    numbers: [1, 2, 3],
    selectedItem: null,
    selectedItemIndex: null,
    toLang: null,
    fromLang: null,
    allowCreate: null,

    items: null,
    suggestion: {
      field: null,
      value: null,
    },
  },

  hasItems() {
    return this.state.items != null && this.state.items.length > 0;
  },

  setSelectedIndex(index) {
    if (this.hasItems()) {
      this.state.selectedItem = this.deepcopy(this.state.items[index]);
      this.state.selectedItemIndex = index;
      this.clearSuggestion();
    }
  },

  setSelectedItem(item) {
    if (this.hasItems()) {
      const itemIndex = this.findIndex(item);
      this.setSelectedIndex(itemIndex);
    }
  },

  setSelectedFilteredIndexItem(index, item) {
    if (this.hasItems()) {
      if (item) {
        this.state.selectedItem = this.deepcopy(item);
        this.state.selectedItemIndex = index;
        this.clearSuggestion();
      }
    }
  },

  selectNextItem() {
    if (this.hasItems()) {
      const total = this.state.items.length;
      if (this.state.selectedItemIndex < total - 1) {
        this.state.selectedItemIndex += 1;
      }
      this.setSelectedIndex(this.state.selectedItemIndex);
    }
  },

  addItem(item) {
    this.state.items.push(item);
    this.setSelectedIndex(0);
  },

  deleteItem(item) {
    const itemIndexToDelete = this.findIndex(item);
    this.state.items.splice(itemIndexToDelete, 1);
    this.setSelectedIndex(0);
  },

  updateItem(item) {
    const itemIndexToUpdate = this.findIndex(item);
    this.state.items.splice(itemIndexToUpdate, 1, this.deepcopy(item));
  },

  deepcopy(object) {
    return JSON.parse(JSON.stringify(object));
  },

  findIndex(item) {
    let foundIndex = -1;
    this.state.items.forEach((value, index) => {
      if (value.meta.id === item.meta.id) {
        foundIndex = index;
      }
    });
    return foundIndex;
  },

  clearSuggestion() {
    this.state.suggestion.field = null;
    this.state.suggestion.value = null;
  },

  createUrl(urlBase) {
    let url = urlBase.replace('__ID__', this.state.selectedItem.meta.id);
    url = url.replace('__FIELD__', btoa(this.state.suggestion.field));
    return url.replace('__I18N__', this.state.toLang);
  },

  // suggestionAllowed() {
  //   if (this.state.selectedItem) {
  //     return (
  //       this.state.selectedItem.meta.langBase != this.state.selectedItem.meta.langTranslation
  //     );
  //   }
  //   return false;
  // }
  // isBaseLang() {

  //   return state.toLang === state.fromLang;
  // },
};
