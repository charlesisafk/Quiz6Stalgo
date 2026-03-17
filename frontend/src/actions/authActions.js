import axios from 'axios';
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
  API_BASE_URL,
} from '../constants/actionConstants';

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/users/login/`, {
      email,
      password,
    });
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response?.data?.detail || 'Login failed',
    });
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/users/register/`, userData);
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorData = error.response?.data || 'Registration failed';
    let errorMessage = errorData;
    if (typeof errorData === 'object') {
      const errors = Object.keys(errorData).map((key) => {
        const value = errorData[key];
        if (Array.isArray(value)) {
          return `${key}: ${value.join(', ')}`;
        }
        return `${key}: ${value}`;
      });
      errorMessage = errors.join('; ');
    }
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: errorMessage,
    });
  }
};

export const getUserProfile = () => async (dispatch) => {
  dispatch({ type: USER_PROFILE_REQUEST });
  try {
    const token = localStorage.getItem('access_token');
    const { data } = await axios.get(`${API_BASE_URL}/users/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload: error.response?.data || 'Failed to fetch profile',
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  dispatch({ type: USER_LOGOUT });
};
