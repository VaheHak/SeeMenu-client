import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const LOGIN = define('LOGIN');

export function loginUser(formData) {
  return LOGIN.request(() => Api.login(formData))
    .takeLatest();
}

export const USER_ACTIVATE = define('USER_ACTIVATE');

export function userActivateRequest(formData) {
  return USER_ACTIVATE.request(() => Api.verification(formData))
    .takeLatest();
}

export const REPEAT_PASSWORD = define('REPEAT_PASSWORD');

export function userRepeatPassword(formData) {
  return REPEAT_PASSWORD.request(() => Api.repeatPassword(formData))
    .takeLatest();
}

export const USER_TOKEN_DELETE = 'USER_TOKEN_DELETE';

export function deleteToken() {
  return {
    type: USER_TOKEN_DELETE,
    payload: {},
  };
}

export const LOGIN_CHANGE = 'LOGIN_CHANGE';

export function loginChange(path, value) {
  return {
    type: LOGIN_CHANGE,
    payload: {
      path,
      value,
    },
  };
}

export const DELETE_ERROR = 'DELETE_ERROR';

export function deleteError() {
  return {
    type: DELETE_ERROR,
  };
}

export const SEND_STATUS = 'SEND_STATUS';

export function sendStatus() {
  return {
    type: SEND_STATUS,
  };
}

export const SEND_MESSAGE = define('SEND_MESSAGE');

export function sendMessage(email) {
  return SEND_MESSAGE.request(() => Api.sendMessage(email))
    .takeLatest();
}

export const CLOSE_MODAL = 'CLOSE_MODAL';

export function closeModal() {
  return {
    type: CLOSE_MODAL,
  };
}

export const OAUTH = define('OAUTH');

export function oAuthRequest(service, accessToken) {
  return OAUTH.request(() => Api.getOauthLogin(service, accessToken))
    .takeLatest();
}

export const DELETE_UNIQ_KEY = 'DELETE_UNIQ_KEY';

export function deleteUniqKey() {
  return {
    type: DELETE_UNIQ_KEY,
  };
}

export const TWO_FACTOR_AUTHENTICATION = define('TWO_FACTOR_AUTHENTICATION');

export function twoFactorAuthentication(formData) {
  return TWO_FACTOR_AUTHENTICATION.request(() => Api.twoFactorAuthentication(formData))
    .takeLatest();
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteStatus() {
  return {
    type: DELETE_STATUS,
  };
}
