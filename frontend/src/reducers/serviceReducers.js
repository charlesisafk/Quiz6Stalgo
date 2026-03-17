import {
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_DETAIL_REQUEST,
  SERVICE_DETAIL_SUCCESS,
  SERVICE_DETAIL_FAIL,
} from '../constants/actionConstants';

const initialState = {
  loading: false,
  services: [],
  service: null,
  error: null,
};

export const serviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SERVICE_LIST_REQUEST:
    case SERVICE_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };

    case SERVICE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        services: action.payload,
      };

    case SERVICE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        service: action.payload,
      };

    case SERVICE_LIST_FAIL:
    case SERVICE_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
