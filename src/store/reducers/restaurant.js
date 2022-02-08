import _ from 'lodash';
import {
  USER_RESTAURANT_LIST,
  CREATE_RESTAURANT,
  GET_SINGLE_RESTAURANT,
  UPDATE_RESTAURANT,
  CREATE_RESTAURANT_CHANGE,
  CLOSE_RESTAURANT_CHANGE,
  GET_RESTAURANT_BRANCHES,
  DELETE_STATUS,
  DELETE_RESTAURANT,
  UPDATE_STATUS, MANAGER_BRANCHES,
} from '../actions/restaurant';

const initialState = {
  errors: {},
  restaurantData: {},
  restaurants: [],
  restaurantId: '',
  create_status: '',
  update_status: '',
  delete_status: '',
  branches: [],
  restStatus: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_RESTAURANT_CHANGE: {
      const { path, value } = action.payload;
      const { restaurantData, errors } = state;
      _.set(restaurantData, path, value);

      delete errors[path];

      return {
        ...state,
        restaurantData: { ...restaurantData },
        errors: { ...errors },
      };
    }

    case CREATE_RESTAURANT.SUCCESS: {
      return {
        ...state,
        create_status: 'Restaurant has been created!',
      };
    }

    case CREATE_RESTAURANT.FAIL: {
      const { data } = action.payload;
      return {
        ...state,
        errors: data.errors,
      };
    }

    case USER_RESTAURANT_LIST.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        restaurants: data.result,
      };
    }

    case CLOSE_RESTAURANT_CHANGE: {
      return {
        ...state,
        restaurantData: {},
        errors: {},
        restaurantId: '',
      };
    }

    case UPDATE_RESTAURANT.SUCCESS: {
      return {
        ...state,
        update_status: 'Restaurant has been updated!',
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        update_status: '',
        create_status: '',
        delete_status: '',
      };
    }

    case DELETE_RESTAURANT.SUCCESS: {
      return {
        ...state,
        delete_status: 'Restaurant has been deleted!',
      };
    }

    case UPDATE_RESTAURANT.FAIL: {
      const { data: { errors } } = action.payload;
      return {
        ...state,
        errors,
      };
    }

    case GET_SINGLE_RESTAURANT.SUCCESS: {
      const { data: { result } } = action.payload;
      const { restaurantData } = state;

      _.map(result, (value, path) => {
        _.set(restaurantData, path, value);
      });
      return {
        ...state,
        restaurantData,
        restaurantId: result?.id,
      };
    }

    case GET_RESTAURANT_BRANCHES.SUCCESS: {
      const { data: { result } } = action.payload;

      return {
        ...state,
        branches: result?.restBranches,
      };
    }

    case UPDATE_STATUS.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        restStatus: data.result,
      };
    }

    case UPDATE_STATUS.FAIL: {
      return {
        ...state,
      };
    }

    case MANAGER_BRANCHES.SUCCESS: {
      return {
        ...state,
      };
    }

    default: {
      return state;
    }
  }
}
