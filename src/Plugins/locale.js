import LOCALIZATION from '@config/localization';

function getParameterByName(nameParam, urlParam) {
  let url = urlParam;
  if (!url) {
    url = window.location.href;
  }
  const name = nameParam.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function isValidLocale(locale) {
  return LOCALIZATION.SUPPORTED_LOCALES.includes(locale);
}

// check valid locales
// set default based on config
export default function getLocale() {
  const queryLocale = getParameterByName('locale');
  if (queryLocale && isValidLocale(queryLocale)) {
    localStorage.setItem('locale', queryLocale);
    return queryLocale;
  }

  const storageLocale = localStorage.getItem('locale');
  if (storageLocale && isValidLocale(storageLocale)) {
    return storageLocale;
  }

  return LOCALIZATION.DEFAULT_LOCALE;
}
