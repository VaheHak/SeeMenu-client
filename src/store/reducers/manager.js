import _ from 'lodash';
import {
  GET_MANAGERS,
  MANAGER_CHANGE,
  CREATE_MANAGER,
  DELETE_STATUS,
  DELETE_MANAGER,
  SINGLE_MANAGER,
  EDIT_MANAGER,
  CLOSE_CREATE_MANAGER,
} from '../actions/manager';

const initialState = {
  managers: [],
  allManagers: [],
  managerData: {},
  searchData: {},
  single_manager: {},
  errors: {},
  create_status: '',
  edit_status: '',
  delete_status: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_MANAGERS.SUCCESS: {
      let { data: { result } } = action.payload;

      result = _.uniqBy(result, 'id');

      return {
        ...state,
        managers: result,
        allManagers: result,
      };
    }

    case CLOSE_CREATE_MANAGER: {
      return {
        ...state,
        managerData: {},
        errors: {},
      };
    }

    case MANAGER_CHANGE: {
      const { path, value } = action.payload;
      const { managerData, errors } = state;

      _.set(managerData, path, value);

      delete errors[path];

      return {
        ...state,
        menuData: { ...managerData },
        errors: { ...errors },
      };
    }

    case CREATE_MANAGER.SUCCESS: {
      return {
        ...state,
        create_status: 'The manager has been created. Please verify your email.',
      };
    }

    case CREATE_MANAGER.FAIL: {
      const { errors } = action.payload.data;

      return {
        ...state,
        errors,
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        create_status: '',
        delete_status: '',
        edit_status: '',
        managerData: {},
        errors: {},
        single_manager: {},
      };
    }

    case DELETE_MANAGER.SUCCESS: {
      return {
        ...state,
        delete_status: 'Manager has been deleted!',
      };
    }

    case EDIT_MANAGER.SUCCESS: {
      return {
        ...state,
        edit_status: 'Manager has been updated!',
      };
    }

    case SINGLE_MANAGER.SUCCESS: {
      return {
        ...state,
        single_manager: action.payload.data.result[0],
      };
    }

    default: {
      return state;
    }
  }
}
