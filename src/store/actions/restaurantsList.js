import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const GET_RESTAURANT_LIST = define('GET_RESTAURANT_LIST');

export function getAllRestaurants(s) {
  return GET_RESTAURANT_LIST.request(() => Api.getRestaurantListAll(s))
    .takeLatest();
}

export const GET_BRANCHES = define('GET_BRANCHES');

export function getAllBranches(id, s) {
  return GET_BRANCHES.request(() => Api.getAllBranches(id, s))
    .takeLatest();
}

export const GET_ONE_RESTAURANT = define('GET_ONE_RESTAURANT');

export function getOneRestaurant(id, lang) {
  return GET_ONE_RESTAURANT.request(() => Api.getOneRestaurant(id, lang))
    .takeLatest();
}
