import Api from '../../Api';
import { define } from '../../helpers/redux-request';

export const CREATE_ORDER = define('CREATE_ORDER');

export function ordering(tables, template, restaurantId, styles) {
  return CREATE_ORDER.request(() => (
    Api.orderTemplate(tables, template, restaurantId, styles))).takeLatest();
}

export const UPDATE_ORDER = define('UPDATE_ORDER');

export function updateOrder(id, styles, status) {
  return UPDATE_ORDER.request(() => (
    Api.updateOrderTemplate(id, styles, status))).takeLatest();
}

export const CHANGE_IMAGE = 'CHANGE_IMAGE';

export function changeImage(num) {
  return {
    type: CHANGE_IMAGE,
    payload: {
      num,
    },
  };
}

export const CHANGE_COUNT = 'CHANGE_COUNT';

export function changeCount(name, count, process, link) {
  return {
    type: CHANGE_COUNT,
    payload: {
      name,
      count,
      process,
      link,
    },
  };
}

export const DELETE_ORDERS_FORM = 'DELETE_ORDERS_FORM';

export function deleteOrdersForm() {
  return {
    type: DELETE_ORDERS_FORM,
  };
}

export const GET_ORDERS = define('GET_ORDERS');

export function getOrders(restaurantId, searchData) {
  return GET_ORDERS.request(() => Api.getOrders(restaurantId, searchData)).takeLatest();
}

export const DELETE_ORDER = define('DELETE_ORDER');

export function deleteOrder(id) {
  return DELETE_ORDER.request(() => Api.deleteOrder(id)).takeLatest();
}

export const DELETE_ORDER_STATUS = 'DELETE_ORDER_STATUS';

export function deleteOrderStatus() {
  return {
    type: DELETE_ORDER_STATUS,
  };
}

export const SINGLE_ORDER = define('SINGLE_ORDER');

export function singleOrder(id) {
  return SINGLE_ORDER.request(() => Api.getSingleOrder(id)).takeLatest();
}
