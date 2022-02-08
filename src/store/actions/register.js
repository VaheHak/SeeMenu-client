import Api from '../../Api';
import { define } from '../../helpers/redux-request';

export const REGISTER = define('REGISTER');

export function registerUser(formData) {
  return REGISTER.request(() => Api.register(formData)).takeLatest();
}

export const REGISTER_CHANGE = 'REGISTER_CHANGE';

export function registerChange(path, value) {
  return {
    type: REGISTER_CHANGE,
    payload: {
      path,
      value,
    },
  };
}

export const CLOSE_MODAL = 'CLOSE_MODAL';

export function closeModal() {
  return {
    type: CLOSE_MODAL,
  };
}

export const FORGOT_PASSWORD = define('FORGOT_PASSWORD');

export function userForgotPassword(formData) {
  return FORGOT_PASSWORD.request(() => Api.forgotPassword(formData)).takeLatest();
}
