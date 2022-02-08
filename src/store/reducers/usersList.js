import _ from 'lodash';
import {
  GET_USERS,
  UPDATE_USERS,
  UPDATE_USERS_STATUS,
  DELETE_USERS,
  USER_CHANGE,
  ROLE_FILTER,
} from '../actions/usersList';

const initialState = {
  errors: {},
  usersData: [],
  roleData: [],
  updateUsers: {},
  updateStatus: {},
  deleteUsers: {},
  formData: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS.SUCCESS: {
      const { result } = action.payload.data;
      return {
        ...state,
        usersData: result,
        roleData: result,
      };
    }

    case ROLE_FILTER: {
      const { role } = action.payload;
      const { usersData } = state;
      let roleData = [];
      if (role === 'all') {
        roleData = usersData;
      } else {
        _.map(usersData, (i) => {
          if (i.role === role) {
            roleData.push(i);
          }
        });
      }
      return {
        ...state,
        roleData,
      };
    }

    case UPDATE_USERS.SUCCESS: {
      return {
        ...state,
        updateStatus: 'Users has been updated!',
      };
    }
    case UPDATE_USERS.FAIL: {
      return {
        ...state,
        errors: action.payload.data.errors,
      };
    }
    case UPDATE_USERS_STATUS.SUCCESS: {
      return {
        ...state,
        updateStatus: 'Users has been updated!',
      };
    }
    case UPDATE_USERS_STATUS.FAIL: {
      return {
        ...state,
        errors: action.payload.data.errors,
      };
    }

    case DELETE_USERS.SUCCESS: {
      return {
        ...state,
        deleteUsers: action.payload.data,
      };
    }

    case USER_CHANGE: {
      const {
        path,
        value,
      } = action.payload;
      const {
        formData,
        errors,
      } = state;

      _.set(formData, path, value);

      delete errors.name;

      return {
        ...state,
        formData: { ...formData },
        errors: { ...errors },
      };
    }

    default: {
      return state;
    }
  }
}
