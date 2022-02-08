import _ from 'lodash';
import {
  CHANGE_IMAGE,
  DELETE_ORDERS_FORM,
  GET_ORDERS,
  CHANGE_COUNT,
  CREATE_ORDER,
  DELETE_ORDER,
  DELETE_ORDER_STATUS,
  SINGLE_ORDER,
} from '../actions/qr';

const initialState = {
  errors: {},
  order: {},
  single_order: {},
  image_number: '',
  delete_status: '',
  create_status: '',
  order_history: [],
  price: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_COUNT: {
      const {
        name,
        count,
        process,
        link,
      } = action.payload;
      const { order } = state;
      let { price } = state;
      if (process === '+') {
        price += 2000;
      } else if (process === '-') {
        price -= 2000;
      } else {
        const or = _.filter(order, (sum, o) => {
          if (o === name) {
            return sum;
          }
          return false;
        });

        if (or && or[0] > count) {
          price -= (or[0] - count) * 2000;
        } else if (or && or[0] < count) {
          price += (count - or[0]) * 2000;
        } else {
          price += count * 2000;
        }
      }
      _.set(order, name, {
        [name]: count,
        link,
      });
      return {
        ...state,
        order,
        price,
      };
    }

    case CHANGE_IMAGE: {
      return {
        ...state,
        image_number: action.payload.num,
      };
    }

    case DELETE_ORDERS_FORM: {
      return {
        ...state,
        order: {},
        image_number: '',
        price: 0,
      };
    }

    case GET_ORDERS.SUCCESS: {
      const { data: { result } } = action.payload;
      return {
        ...state,
        order_history: result,
      };
    }

    case CREATE_ORDER.SUCCESS: {
      return {
        ...state,
        create_status: 'Order has been created!',
      };
    }

    case DELETE_ORDER.SUCCESS: {
      return {
        ...state,
        delete_status: 'Order has been deleted!',
      };
    }

    case DELETE_ORDER_STATUS: {
      return {
        ...state,
        delete_status: '',
        create_status: '',
      };
    }

    case SINGLE_ORDER.SUCCESS: {
      const { data: { result } } = action.payload;
      return {
        ...state,
        single_order: result,
      };
    }

    case SINGLE_ORDER.FAIL: {
      return {
        ...state,
      };
    }

    default: {
      return state;
    }
  }
}
