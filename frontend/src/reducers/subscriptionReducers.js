import {
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
} from '../constants/actionConstants';

const initialState = {
  loading: false,
  tiers: [],
  error: null,
};

export const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIPTION_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case SUBSCRIPTION_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        tiers: action.payload,
      };

    case SUBSCRIPTION_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
