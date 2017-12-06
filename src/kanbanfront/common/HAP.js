/**
 * Created by jaywoods on 2017/6/23.
 */
import React from 'react';
import { message } from 'antd';
import { FormattedMessage } from 'react-intl';
import AppState from '../stores/globalStores/AppState';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// (!function () {
const ACCESS_TOKEN = 'access_token';
const AUTH_URL = `${process.env.AUTH_HOST}/oauth/authorize?response_type=token&client_id=${process.env.CLIENT_ID}&state=&redirect_uri=${process.env.REDIRECT_URL}`;

const setCookie = (name, option) => cookies.set(name, option);
const getCookie = (name, option) => cookies.getALL(name, option);
const removeCookie = (name, option) => cookies.remove(name, option);

function getAccessToken(hash) {
  if (hash) {
    const ai = hash.indexOf(ACCESS_TOKEN);
    if (ai !== -1) {
      const accessToken = hash.split('&')[0].split('=')[1];
      return accessToken;
    }
  }
  return null;
}

function setAccessToken(token, expiresion) {
  const expires = expiresion * 1000;
  const expirationDate = new Date(Date.now() + expires);
  setCookie(ACCESS_TOKEN, token, {
    path: '/',
    expires: expirationDate,
  });
}

function removeAccessToken() {
  removeCookie(ACCESS_TOKEN, {
    path: '/',
  });
}


function languageChange(id) {
  return <FormattedMessage id={`${id}`} />;
}

function logout() {
  removeAccessToken();
  window.location = `${process.env.AUTH_HOST}/logout`;
}

function getMessage(zh, en) {
  const language = AppState.currentLanguage;
  if (language === 'zh') {
    return zh;
  } else if (language === 'en') {
    return en;
  }
  return false;
}

function prompt(type, content) {
  switch (type) {
    case 'success':
      message.success(content);
      break;
    case 'error':
      message.error(content);
      break;
    default:
      break;
  }
}

window.HAP = {
  ACCESS_TOKEN,
  AUTH_URL,
  getAccessToken,
  setCookie,
  getCookie,
  removeCookie,
  setAccessToken,
  removeAccessToken,
  languageChange,
  getMessage,
  logout,
  prompt,
};
// })();
