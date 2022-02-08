import { define } from '../../helpers/redux-request';
import Api from '../../Api';

export const GET_ORDERS_ALL = define('GET_ORDERS_ALL');

export function getOrdersAll(searchData) {
  return GET_ORDERS_ALL.request(() => Api.getOrdersAll(searchData)).takeLatest();
}

export const CHOOSE_STYLE = 'CHOOSE_STYLE';

export function chooseStyles(restaurantName, tableName, titleStyle, subTitleStyle) {
  return {
    type: CHOOSE_STYLE,
    payload: {
      data: {
        restaurantName,
        tableName,
        titleStyle,
        subTitleStyle,
      },
    },
  };
}

export const DELETE_STYLES = 'DELETE_STYLES';

export function deleteStyles() {
  return {
    type: DELETE_STYLES,
  };
}
