import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const CREATE_TABLE = define('CREATE_TABLE');

export function createTable(formData) {
  return CREATE_TABLE.request(() => Api.createTable(formData)).takeLatest();
}

export const CREATE_TABLE_CHANGE = 'CREATE_TABLE_CHANGE';

export function createTableChange(path, value) {
  return {
    type: CREATE_TABLE_CHANGE,
    payload: { path, value },
  };
}

export const CLOSE_TABLE_CHANGE = 'CLOSE_TABLE_CHANGE';

export function closeTableChange() {
  return {
    type: CLOSE_TABLE_CHANGE,
  };
}

export const GET_TABLES = define('GET_TABLES');

export function getTables(id) {
  return GET_TABLES.request(() => Api.getTables(id)).takeLatest();
}

export const GET_SINGLE_TABLE = define('GET_SINGLE_TABLE');

export function getSingleTable(id) {
  return GET_SINGLE_TABLE.request(() => Api.getSingleTable(id)).takeLatest();
}

export const UPDATE_TABLE = define('UPDATE_TABLE');

export function updateTable(formData) {
  return UPDATE_TABLE.request(() => Api.updateTable(formData)).takeLatest();
}

export const DELETE_TABLE = define('DELETE_TABLE');

export function deleteTable(id) {
  return DELETE_TABLE.request(() => Api.deleteTable(id)).takeLatest();
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteStatus() {
  return {
    type: DELETE_STATUS,
  };
}
