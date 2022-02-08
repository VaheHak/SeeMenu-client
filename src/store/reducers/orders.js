import _ from 'lodash';
import { CHOOSE_STYLE, DELETE_STYLES, GET_ORDERS_ALL } from '../actions/orders';

const initialState = {
  orders: [],
  styles: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ORDERS_ALL.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        orders: data.result,
      };
    }
    case CHOOSE_STYLE: {
      const { data } = action.payload;
      return {
        ...state,
        styles: { ...data },
      };
    }
    case DELETE_STYLES: {
      return {
        ...state,
        styles: {},
      };
    }
    default: {
      return state;
    }
  }
}
