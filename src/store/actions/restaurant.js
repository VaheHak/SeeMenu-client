import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const CREATE_RESTAURANT = define('CREATE_RESTAURANT');

export function createRestaurant(formData) {
  return CREATE_RESTAURANT.request(() => Api.createRestaurant(formData)).takeLatest();
}

export const DELETE_RESTAURANT = define('DELETE_RESTAURANT');

export function deleteRestaurant(id) {
  return DELETE_RESTAURANT.request(() => Api.deleteRestaurant(id)).takeLatest();
}

export const UPDATE_RESTAURANT = define('UPDATE_RESTAURANT');

export function updateRestaurant(formData) {
  return UPDATE_RESTAURANT.request(() => Api.updateRestaurant(formData)).takeLatest();
}

export const GET_SINGLE_RESTAURANT = define('GET_SINGLE_RESTAURANT');

export function getSingleRestaurant(id, lang) {
  return GET_SINGLE_RESTAURANT.request(() => Api.getSingleRestaurant(id, lang)).takeLatest();
}

export const USER_RESTAURANT_LIST = define('USER_RESTAURANT_LIST');

export function getRestaurantList() {
  return USER_RESTAURANT_LIST.request(() => Api.getRestaurants()).takeLatest();
}

export const GET_RESTAURANT_BRANCHES = define('GET_RESTAURANT_BRANCHES');

export function getBranches(id) {
  return GET_RESTAURANT_BRANCHES.request(() => Api.getBranches(id)).takeLatest();
}

export const CREATE_RESTAURANT_CHANGE = 'CREATE_RESTAURANT_CHANGE';

export function createRestaurantChange(path, value) {
  return {
    type: CREATE_RESTAURANT_CHANGE,
    payload: { path, value },
  };
}

export const CLOSE_RESTAURANT_CHANGE = 'CLOSE_RESTAURANT_CHANGE';

export function closeRestaurantChange() {
  return {
    type: CLOSE_RESTAURANT_CHANGE,
  };
}

export const DELETE_STATUS = 'DELETE_STATUS';

export function deleteStatus() {
  return {
    type: DELETE_STATUS,
  };
}

export const MANAGER_BRANCHES = define('MANAGER_BRANCHES');

export function getBranchesWithoutManager(id) {
  return MANAGER_BRANCHES.request(() => Api.getBranchesWithoutManager(id)).takeLatest();
}

export const UPDATE_STATUS = define('UPDATE_STATUS');

export function updateStatus(id, status) {
  return UPDATE_STATUS.request(() => Api.updateStatus(id, status)).takeLatest();
}
