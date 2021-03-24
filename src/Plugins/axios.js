import axios from 'axios';
import AUTH from '@config/auth';

import {
  storeTokens,
  getAccessTokenUser,
  getRefreshTokenUser,
  getAccessTokenAdmin,
  getRefreshTokenAdmin,
} from './loginhelper';

import TunnelEncryption from './tunnel_encryption';

const axiosApi = axios.create({
  baseURL: '',
});

function getRefreshTokenUrl(error) {
  const PROVIDER_ADMINS = 101;
  // const PROVIDER_USERS = 102;

  const responseData = error.response.data;
  if (PROVIDER_ADMINS === responseData.code) {
    const defaultUrl = AUTH.TOKEN_REFRESH_ENDPOINT_ADMINS;
    const newUrl = defaultUrl.replace('/admin/', `/admin${AUTH.ADMIN_ROUTE_POSTFIX}/`);
    return newUrl;
  }
  return AUTH.TOKEN_REFRESH_ENDPOINT_USERS;
}

function isAdminRoute(config) {
  const { url } = config;

  let find = '/api/v[0-9]/admin';
  find += AUTH.ADMIN_ROUTE_POSTFIX;
  let regex = new RegExp(find, 'g');

  //  const regex = /\/api\/v[0-9]\/admin\//g;
  if (url.match(regex)) {
    return true;
  }

  find = '/admin';
  find += AUTH.ADMIN_ROUTE_POSTFIX;
  regex = new RegExp(find, 'g');

  //  const regex = /\/api\/v[0-9]\/admin\//g;
  if (url.match(regex)) {
    return true;
  }

  return false;
}

function getAccessToken(config) {
  if (isAdminRoute(config)) {
    return getAccessTokenAdmin();
  }
  return getAccessTokenUser();
}

function getRefreshToken(error) {
  const { config } = error.response;
  if (isAdminRoute(config)) {
    return getRefreshTokenAdmin();
  }
  return getRefreshTokenUser();
}

function doStoreTokens(config, responseData) {
  let loginas = 'USER';
  if (isAdminRoute(config)) {
    loginas = 'ADMIN';
  }
  storeTokens(responseData, loginas);
}

function redirectIfNeeded(error) {
  // redirect to resolve page : ie in case the terms were not accepted and this is a post call
  if (
    error.response &&
    error.response.data &&
    error.response.data.data &&
    error.response.data.data.resolve_url
  ) {
    let redirectUrl = error.response.data.data.resolve_url;

    if (error.response.data.data.intended_url) {
      redirectUrl += `?intendedUrl=${error.response.data.data.intended_url}`;
    }

    window.location.href = redirectUrl;
  }
}

axiosApi.interceptors.request.use((config) => {
  const accessToken = getAccessToken(config);
  axiosApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  const authorizedConfig = { ...config };

  const encryption = new TunnelEncryption(AUTH.tunnelEncryption, AUTH.TUNNEL_ENCRYPTION_SECRET);

  if (authorizedConfig.data) {
    if (authorizedConfig.data.loginname) {
      authorizedConfig.data.loginname = encryption.buildPostValueHashed(
        authorizedConfig.data.loginname,
      );
    }

    if (authorizedConfig.data.password) {
      authorizedConfig.data.password = encryption.buildPostValueHashed(
        authorizedConfig.data.password,
      );
    }

    if (authorizedConfig.data.currentPassword) {
      authorizedConfig.data.currentPassword = encryption.buildPostValueHashed(
        authorizedConfig.data.currentPassword,
      );
    }

    if (authorizedConfig.data.newPassword) {
      authorizedConfig.data.newPassword = encryption.buildPostValue(
        authorizedConfig.data.newPassword,
      );
    }

    authorizedConfig.data.locale= localStorage.getItem('locale');
  }

  // if (authorizedConfig.data && authorizedConfig.data.xid) {
  //   authorizedConfig.data.xid = encryption.buildPostValue(authorizedConfig.data.xid);
  //   // delete authorizedConfig.data.xid;
  // }

  authorizedConfig.headers.Authorization = `Bearer ${accessToken}`;
  return authorizedConfig;
});

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    redirectIfNeeded(error);

    console.log(error);
    /*eslint-disable */
        if (error.response.status === 401 && !originalRequest._retry) {
            const request = JSON.parse(originalRequest.data);
            if (request.skipRetry) {
                return Promise.reject(error);
            }
            originalRequest._retry = true;
          /* eslint-enable */
      const refreshTokenUrl = getRefreshTokenUrl(error);
      const refreshToken = `${getRefreshToken(error)}`;

      return axiosApi
        .post(refreshTokenUrl, {
          refresh_token: refreshToken,
        })
        .then((response) => {
          if (response.status === 200) {
            // const encryption = new TunnelEncryption(
            //   AUTH.TUNNEL_ENCRYPTION,
            //   AUTH.TUNNEL_ENCRYPTION_SECRET,
            // );

            doStoreTokens(originalRequest, response.data.data);
            const newAccessToken = getAccessToken(originalRequest);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosApi(originalRequest);
          }
          return Promise.reject(error);
        });
    }
    // return Error object with Promise
    return Promise.reject(error);
  },
);
// @ts-ignore
export default axiosApi;
