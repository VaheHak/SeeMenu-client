import _ from 'lodash';
import {
  DELETE_ERROR,
  LOGIN,
  LOGIN_CHANGE,
  SEND_MESSAGE,
  SEND_STATUS,
  USER_TOKEN_DELETE,
  OAUTH,
  DELETE_UNIQ_KEY,
  TWO_FACTOR_AUTHENTICATION, DELETE_STATUS,
} from '../actions/login';
import {
  CLOSE_MODAL,
  FORGOT_PASSWORD,
} from '../actions/register';
import storage from '../../helpers/storage';

const initialState = {
  errors: {},
  formData: {},
  error_status: '',
  send_status: '',
  loading_login: false,
  loading_forgot: false,
  forgotModalText: true,
  token: storage.getToken(),
  role: storage.roleGet(),
  uniq_key: '',
  limited: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN.REQUEST: {
      return {
        ...state,
        loading_login: true,
      };
    }

    case LOGIN.SUCCESS: {
      const { data } = action.payload;

      if (data.uniq_key) {
        return {
          ...state,
          uniq_key: data.uniq_key,
        };
      }
      storage.setToken(data.token);
      storage.roleSet(data.result.role);

      return {
        ...state,
        token: data.token,
        loading_login: false,
        role: data.result.role,
        formData: {},
      };
    }

    case LOGIN.FAIL: {
      const { data } = action.payload;
      if (typeof data === 'string') {
        return {
          ...state,
          limited: data,
        };
      }
      if (data.errors.status) {
        return {
          ...state,
          error_status: data.errors.status,
          loading_login: false,
        };
      }
      return {
        ...state,
        errors: data.errors,
        loading_login: false,
      };
    }

    case USER_TOKEN_DELETE: {
      storage.delete();

      return {
        ...state,
        token: '',
        result: {},
      };
    }

    case LOGIN_CHANGE: {
      const {
        path,
        value,
      } = action.payload;
      const { formData } = state;

      _.set(formData, path, value);

      return {
        ...state,
        formData: { ...formData },
        errors: {},
      };
    }

    case DELETE_ERROR: {
      return {
        ...state,
        errors: {},
        error_status: '',
        limited: '',
        loading_login: false,
      };
    }

    case SEND_MESSAGE.SUCCESS: {
      return {
        ...state,
        send_status: 'The message has been sent to your email.',
      };
    }

    case SEND_STATUS: {
      return {
        ...state,
        send_status: '',
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
        errors: {},
      };
    }

    case FORGOT_PASSWORD.FAIL: {
      return {
        ...state,
        loading_forgot: false,
        errors: action.payload.data.errors,
      };
    }

    case CLOSE_MODAL: {
      return {
        ...state,
        formData: {},
        errors: {},
        forgotModalText: true,
      };
    }

    case OAUTH.REQUEST: {
      return {
        ...state,
        loading_login: true,
      };
    }

    case OAUTH.SUCCESS: {
      const { data } = action.payload;
      storage.setToken(data.token);
      storage.roleSet(data.result.role);
      return {
        ...state,
        result: data.result,
        token: data.token,
        loading_login: false,
        role: data.result.role,
      };
    }

    case OAUTH.FAIL: {
      const { data: { errors } } = action.payload;
      return {
        ...state,
        errors,
        loading_login: false,
      };
    }

    case DELETE_UNIQ_KEY: {
      return {
        ...state,
        uniq_key: '',
        loading_login: false,
        formData: {},
      };
    }

    case TWO_FACTOR_AUTHENTICATION.SUCCESS: {
      const { data } = action.payload;

      storage.setToken(data.token);
      storage.roleSet(data.role);

      return {
        ...state,
        loading_login: false,
        token: data.token,
        role: data.role,
        uniq_key: '',
      };
    }

    case TWO_FACTOR_AUTHENTICATION.FAIL: {
      const { data: { errors } } = action.payload;

      return {
        ...state,
        errors,
      };
    }

    case DELETE_STATUS: {
      return {
        ...state,
        errors: {},
      };
    }

    default: {
      return state;
    }
  }
}
