import _ from 'lodash';
import {
  CREATE_CATEGORY,
  CREATE_CATEGORY_CHANGE,
  DELETE_CATEGORY,
  SINGLE_CATEGORY,
  CLOSE_CATEGORY_CHANGE,
  DELETE_CATEGORY_CHANGE_STATUS,
  UPDATE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY_AVAILABLE,
  DELETE_STATUS,
} from '../actions/category';

const initialState = {
  errors: {},
  categories: [],
  delete_status: '',
  create_status: '',
  update_status: '',
  categoryData: {},
  sourceId: '',
  image: '',
  menus: {},
  prices: [],
  single_category: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES.SUCCESS: {
      const { result } = action.payload.data;

      return {
        ...state,
        categories: result,
      };
    }

    case CREATE_CATEGORY.SUCCESS: {
      const { data } = action.payload;
      const { categoryData } = state;

      _.set(categoryData, 'sourceId', data.result.sourceId);

      return {
        ...state,
        create_status: 'Category has been created!',
      };
    }

    case CREATE_CATEGORY.FAIL: {
      const { data } = action.payload;

      return {
        ...state,
        errors: data.errors,
      };
    }

    case DELETE_CATEGORY.SUCCESS: {
      return {
        ...state,
        delete_status: 'Category has been deleted!',
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        create_status: '',
        update_status: '',
        delete_status: '',
      };
    }

    case SINGLE_CATEGORY.REQUEST: {
      return {
        ...state,
        single_category: [],
      };
    }

    case SINGLE_CATEGORY.SUCCESS: {
      const { data: { result } } = action.payload;

      return {
        ...state,
        single_category: result,
        sourceId: result[0].sourceId,
        image: result[0].image,
      };
    }

    case SINGLE_CATEGORY.FAIL: {
      const { data } = action.payload;

      return {
        ...state,
        errors: data.errors,
      };
    }

    case CREATE_CATEGORY_CHANGE: {
      const { path, value } = action.payload;
      const { categoryData, errors } = state;
      _.set(categoryData, path, value);

      delete errors.name;

      return {
        ...state,
        categoryData: { ...categoryData },
        errors: { ...errors },
      };
    }

    case CLOSE_CATEGORY_CHANGE: {
      return {
        ...state,
        categoryData: {},
        errors: {},
        sourceId: '',
        image: '',
        single_category: [],
      };
    }

    case DELETE_CATEGORY_CHANGE_STATUS: {
      return {
        ...state,
        errors: {},
        update_status: '',
        create_status: '',
      };
    }

    case UPDATE_CATEGORY.SUCCESS: {
      return {
        ...state,
        update_status: 'Category has been updated!',
      };
    }

    case UPDATE_CATEGORY.FAIL: {
      return {
        ...state,
        errors: action.payload.data.errors,
      };
    }

    case UPDATE_CATEGORY_AVAILABLE.SUCCESS: {
      return {
        ...state,
      };
    }

    default: {
      return state;
    }
  }
}
