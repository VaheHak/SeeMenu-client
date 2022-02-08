import Api from '../../Api';
import { define } from '../../helpers/redux-request';

export const USER = define('USER');

export function chooseUser() {
  return USER.request(() => Api.userProfile())
    .takeLatest();
}

export const CHANGE_USER = 'CHANGE_USER';

export function changeUser(path, value) {
  return {
    type: CHANGE_USER,
    payload: {
      path,
      value,
    },
  };
}

export const CHANGE_TWO_FACTOR = define('CHANGE_TWO_FACTOR');

export function changeFactor(email, twoFactorAuth) {
  return CHANGE_TWO_FACTOR.request(() => Api.changeTwoFactor({
    email,
    twoFactorAuth,
  }))
    .takeLatest();
}

export const UPDATE_USER = define('UPDATE_USER');

export function updateUser(data) {
  return UPDATE_USER.request(() => Api.updateUser(data))
    .takeLatest();
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteStatus() {
  return {
    type: DELETE_STATUS,
  };
}

export const DELETE_USER = define('DELETE_USER');

export function deleteUser(id) {
  return DELETE_USER.request(() => Api.deleteUser(id))
    .takeLatest();
}
