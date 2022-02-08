import _ from 'lodash';
import {
  CLOSE_MODAL, FORGOT_PASSWORD, REGISTER, REGISTER_CHANGE,
} from '../actions/register';

const initialState = {
  errors: {},
  formData: {},
  loading_register: false,
  loading_forgot: false,
  successModal: false,
  forgotModalText: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER.REQUEST: {
      return {
        ...state,
        loading_register: true,
      };
    }

    case REGISTER.SUCCESS: {
      return {
        ...state,
        loading_register: false,
        successModal: true,
      };
    }

    case REGISTER.FAIL: {
      const { errors } = action.payload.data;

      return {
        ...state,
        errors,
        loading_register: false,
      };
    }

    case REGISTER_CHANGE: {
      const {
        path,
        value,
      } = action.payload;
      const {
        formData,
        errors,
      } = state;

      _.set(formData, path, value);

      delete errors[path];

      return {
        ...state,
        formData: { ...formData },
        errors: { ...errors },
      };
    }

    case CLOSE_MODAL: {
      return {
        ...state,
        formData: {},
        errors: {},
        successModal: false,
        forgotModalText: true,
      };
    }

    case FORGOT_PASSWORD.REQUEST: {
      return {
        ...state,
        loading_forgot: true,
      };
    }

    case FORGOT_PASSWORD.SUCCESS: {
      return {
        ...state,
        loading_forgot: false,
        forgotModalText: false,
        formData: {},
      };
    }

    case FORGOT_PASSWORD.FAIL: {
      return {
        ...state,
        loading_forgot: false,
        errors: action.payload.data.errors,
      };
    }

    default: {
      return state;
    }
  }
}
