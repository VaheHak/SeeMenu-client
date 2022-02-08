import Api from '../../Api';
import { define } from '../../helpers/redux-request';

export const GET_MANAGERS = define('GET_MANAGERS');

export function getManagers(data) {
  return GET_MANAGERS.request(() => Api.getManagers(data))
    .takeLatest();
}

export const MANAGER_CHANGE = 'MANAGER_CHANGE';

export function createManagerChange(path, value) {
  return {
    type: MANAGER_CHANGE,
    payload: {
      path,
      value,
    },
  };
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteStatus() {
  return {
    type: DELETE_STATUS,
  };
}

export const CREATE_MANAGER = define('CREATE_MANAGER');

export function createManager(managerData) {
  return CREATE_MANAGER.request(() => Api.createManager(managerData))
    .takeLatest();
}

export const DELETE_MANAGER = define('DELETE_MANAGER');

export function deleteManager(id) {
  return DELETE_MANAGER.request(() => Api.deleteManager(id))
    .takeLatest();
}

export const SINGLE_MANAGER = define('SINGLE_MANAGER');

export function getSingleManager(id) {
  return SINGLE_MANAGER.request(() => Api.getSingleManager(id))
    .takeLatest();
}

export const EDIT_MANAGER = define('EDIT_MANAGER');

export function updateManager(managerData) {
  return EDIT_MANAGER.request(() => Api.updateManager(managerData))
    .takeLatest();
}

export const CLOSE_CREATE_MANAGER = 'CLOSE_CREATE_MANAGER';

export function closeManagerModal() {
  return {
    type: CLOSE_CREATE_MANAGER,
  };
}
