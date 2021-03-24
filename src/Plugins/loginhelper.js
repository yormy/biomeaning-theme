import AUTH from '@config/auth';
import TunnelEncryption from './tunnel_encryption';

const ADMIN_POSTFIX = '_';
const USER_POSTFIX = '';
const TOKEN_KEY_ENCRYPTION_SECRET = 'gdujkdhgas8e532425jkhajghgh43q63q';

function makeId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getTokenReferenceEncryptionKey() {
  return btoa(`${TOKEN_KEY_ENCRYPTION_SECRET}utreuurty`);
}

function spamLocalStorage() {
  if (AUTH.TOKEN_SPAM_LOCALSTORAGE) {
    for (let i = 0; i < 10; i += 1) {
      const tokenId = makeId(10);
      const encryptionTokenStorage = new TunnelEncryption(true, '3450835fadlkjfdlkfa093042');
      const content = encryptionTokenStorage.encrypt(tokenId);
      localStorage.setItem(tokenId, content);
    }
  }
}

function storeToken(tokenKeyName, content) {
  const tokenId = makeId(10);

  let tokenReference = tokenId;
  if (AUTH.TOKEN_REFERENCE_ENCRYPTION) {
    const encryptionTokenStorage = new TunnelEncryption(true, getTokenReferenceEncryptionKey());
    tokenReference = encryptionTokenStorage.encrypt(tokenId);
  }
  localStorage.setItem(tokenKeyName, tokenReference);
  localStorage.setItem(tokenId, content);
}

function getRealToken(tokenNameId, postfix) {
  let accessId = localStorage.getItem(`${tokenNameId}${postfix}`);

  if (AUTH.TOKEN_REFERENCE_ENCRYPTION) {
    const encryptionTokenStorage = new TunnelEncryption(true, getTokenReferenceEncryptionKey());
    accessId = encryptionTokenStorage.decrypt(accessId);
  }

  return localStorage.getItem(accessId);
}

export function getAccessTokenUser() {
  try {
    const accessToken = getRealToken('accessToken', USER_POSTFIX);
    return accessToken;
  } catch (e) {
    // console.log('e', e);
    return null;
  }
}

export function getRefreshTokenUser() {
  try {
    return getRealToken('refreshToken', USER_POSTFIX);
  } catch (e) {
    // console.log('e', e);
    return null;
  }
}

export function getAccessTokenAdmin() {
  try {
    return getRealToken('accessToken', ADMIN_POSTFIX);
  } catch (e) {
    // console.log('e', e);
    return null;
  }
}

export function getRefreshTokenAdmin() {
  try {
    return getRealToken('refreshToken', ADMIN_POSTFIX);
  } catch (e) {
    return null;
  }
}

function removeToken(key) {
  let accessId = localStorage.getItem(key);

  if (AUTH.TOKEN_REFERENCE_ENCRYPTION && accessId) {
    const encryptionTokenStorage = new TunnelEncryption(true, getTokenReferenceEncryptionKey());
    accessId = encryptionTokenStorage.decrypt(accessId);
  }
  localStorage.removeItem(key);
  localStorage.removeItem(accessId);
}

function removeTokens(postfix) {
  removeToken(`accessToken${postfix}`);
  removeToken(`refreshToken${postfix}`);
  localStorage.removeItem(`expiresIn${postfix}`);
  localStorage.removeItem(`expiresAt${postfix}`);
}

export function removeTokensUser() {
  removeTokens(USER_POSTFIX);
  localStorage.removeItem('impersonated');
}

export function removeTokensAdmin() {
  removeTokens(ADMIN_POSTFIX);
}

export function doLogout(loggedInAs, axios, currentUrl = null) {
  let logoutUrl = '';
  let routePrefix = '';
  if (loggedInAs === 'ADMIN') {
    removeTokensAdmin();
    routePrefix = `/admin${AUTH.ADMIN_ROUTE_POSTFIX}`;
  } else {
    removeTokensUser();
  }

  const intendedUrl = btoa(currentUrl);
  const params = `?message=session-expired&intendedUrl=${intendedUrl}`;
  logoutUrl = `${routePrefix}/logout`;
  const redirectUrl = `${routePrefix}/login${params}`;

  const data = {
    logout: true,
  };
  axios.get(logoutUrl, data).then(() => {
    if (redirectUrl) {
      window.location.replace(redirectUrl);
    } else {
      window.location.reload();
    }
  });
  removeTokens();
}

export function isLoggedIn(loggedInAs) {
  if (loggedInAs === 'ADMIN') {
    if (getAccessTokenAdmin()) {
      return true;
    }
    return false;
  }

  if (getAccessTokenUser()) {
    return true;
  }
  return false;
}

export function storeTokens(responseData, loginas) {
  const encryption = new TunnelEncryption(AUTH.TUNNEL_ENCRYPTION, AUTH.TUNNEL_ENCRYPTION_SECRET);

  const accessToken = encryption.buildPostValue(responseData.access_token);
  const refreshToken = encryption.buildPostValue(responseData.refresh_token);

  const expiresIn = responseData.expires_in;
  const timestampInMs = Date.now();
  const expiresInMs = responseData.expires_in * 1000;
  const expiresAt = timestampInMs + expiresInMs;

  let postfix = USER_POSTFIX;
  if (loginas === 'ADMIN') {
    postfix = ADMIN_POSTFIX;
  }

  removeTokens(postfix);
  storeToken(`accessToken${postfix}`, accessToken);
  storeToken(`refreshToken${postfix}`, refreshToken);
  // localStorage.setItem('accessToken', accessToken);
  // localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem(`expiresIn${postfix}`, expiresIn);
  localStorage.setItem(`expiresAt${postfix}`, expiresAt);

  spamLocalStorage();
}
