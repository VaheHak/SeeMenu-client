import _ from 'lodash';
import {
  CHANGE_TWO_FACTOR,
  CHANGE_USER,
  DELETE_STATUS,
  UPDATE_USER,
  USER,
} from '../actions/user';

const initialState = {
  result: {},
  userData: {},
  errors: {},
  userError: '',
  status: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        result: data.result,
        userData: data.result,
      };
    }

    case USER.FAIL: {
      const { data: { errors } } = action.payload;

      return {
        ...state,
        userError: errors.status,
      };
    }

    case CHANGE_USER: {
      const {
        path,
        value,
      } = action.payload;

      const {
        userData,
        errors,
      } = state;

      _.set(userData, path, value);

      delete errors[path];

      return {
        ...state,
        userData: { ...userData },
        errors: { ...errors },
      };
    }

    case CHANGE_TWO_FACTOR.SUCCESS: {
      return {
        ...state,
      };
    }

    case UPDATE_USER.SUCCESS: {
      return {
        ...state,
        status: 'Account information has been updated successfully!',
      };
    }

    case UPDATE_USER.FAIL: {
      const { data: { errors } } = action.payload;

      return {
        ...state,
        errors,
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        status: '',
      };
    }

    default: {
      return state;
    }
  }
}
