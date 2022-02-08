import _ from 'lodash';
import {
  CREATE_TABLE,
  CREATE_TABLE_CHANGE,
  CLOSE_TABLE_CHANGE,
  GET_TABLES,
  GET_SINGLE_TABLE,
  UPDATE_TABLE,
  DELETE_TABLE,
  DELETE_STATUS,
} from '../actions/table';

const initialState = {
  errors: {},
  tableData: {},
  delete_status: '',
  tables: [],
  single_table: {},
  create_status: '',
  update_status: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_TABLE.SUCCESS: {
      return {
        ...state,
        create_status: 'Table has been created!',
      };
    }

    case CREATE_TABLE.FAIL: {
      const { data } = action.payload;

      return {
        ...state,
        errors: data.errors,
      };
    }

    case CREATE_TABLE_CHANGE: {
      const { path, value } = action.payload;
      const { tableData, errors } = state;

      _.set(tableData, path, value);

      delete errors[path];

      return {
        ...state,
        tableData: { ...tableData },
        errors: { ...errors },
      };
    }

    case CLOSE_TABLE_CHANGE: {
      return {
        ...state,
        tableData: {},
        errors: {},
        single_table: {},
      };
    }

    case GET_TABLES.SUCCESS: {
      const { result } = action.payload.data;

      return {
        ...state,
        tables: result,
      };
    }

    case GET_SINGLE_TABLE.SUCCESS: {
      const { result } = action.payload.data;

      return {
        ...state,
        single_table: result,
      };
    }

    case UPDATE_TABLE.SUCCESS: {
      const { data: { message } } = action.payload;

      return {
        ...state,
        update_status: message ? 'Table has been updated!' : '',
      };
    }

    case UPDATE_TABLE.FAIL: {
      return {
        ...state,
        errors: action.payload.data.errors,
      };
    }

    case DELETE_TABLE.SUCCESS: {
      return {
        ...state,
        delete_status: 'Table has been deleted!',
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        delete_status: '',
        create_status: '',
        update_status: '',
      };
    }

    default: {
      return state;
    }
  }
}
