import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const GET_USERS = define('GET_USERS');

export function getUsersList(data) {
  return GET_USERS.request(() => Api.getUsersList(data))
    .takeLatest();
}

export const UPDATE_USERS = define('UPDATE_USERS');

export function updateUsersList(formData) {
  return UPDATE_USERS.request(() => Api.updateUsersList(formData))
    .takeLatest();
}

export const UPDATE_USERS_STATUS = define('UPDATE_USERS_STATUS');

export function updateUsersStatus(id, status) {
  return UPDATE_USERS_STATUS.request(() => Api.updateUsersStatus(id, status))
    .takeLatest();
}

export const DELETE_USERS = define('DELETE_USERS');

export function deleteUsersList(id) {
  return DELETE_USERS.request(() => Api.deleteUsersList(id))
    .takeLatest();
}

export const USER_CHANGE = 'USER_CHANGE';

export function userChange(value, path) {
  return {
    type: USER_CHANGE,
    payload: {
      value,
      path,
    },
  };
}

export const ROLE_FILTER = 'ROLE_FILTER';

export function roleFilter(role) {
  return {
    type: ROLE_FILTER,
    payload: { role },
  };
}
