import axios from 'axios';
import {
  SUBSCRIPTION_LIST_REQUEST,
  SUBSCRIPTION_LIST_SUCCESS,
  SUBSCRIPTION_LIST_FAIL,
  API_BASE_URL,
} from '../constants/actionConstants';

export const listSubscriptions = () => async (dispatch) => {
  dispatch({ type: SUBSCRIPTION_LIST_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/subscriptions/tiers/`);
    dispatch({
      type: SUBSCRIPTION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIPTION_LIST_FAIL,
      payload: error.response?.data || 'Failed to load subscriptions',
    });
  }
};
