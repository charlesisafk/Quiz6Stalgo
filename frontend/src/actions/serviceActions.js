import axios from 'axios';
import {
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_DETAIL_REQUEST,
  SERVICE_DETAIL_SUCCESS,
  SERVICE_DETAIL_FAIL,
  API_BASE_URL,
} from '../constants/actionConstants';

export const listServices = () => async (dispatch) => {
  dispatch({ type: SERVICE_LIST_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/services/list/`);
    dispatch({
      type: SERVICE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SERVICE_LIST_FAIL,
      payload: error.response?.data || 'Failed to load services',
    });
  }
};

export const getServiceDetail = (id) => async (dispatch) => {
  dispatch({ type: SERVICE_DETAIL_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/services/${id}/`);
    dispatch({
      type: SERVICE_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SERVICE_DETAIL_FAIL,
      payload: error.response?.data || 'Failed to load service',
    });
  }
};
