import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
} from '../constants/actionConstants';

const initialState = {
  loading: false,
  user: null,
  token: localStorage.getItem('access_token'),
  error: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
    case USER_REGISTER_REQUEST:
    case USER_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload.access,
        isAuthenticated: true,
      };

    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: null,
      };

    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
    case USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case USER_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};
