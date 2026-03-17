import axios from 'axios';

export const CHAT_MESSAGE_REQUEST = 'CHAT_MESSAGE_REQUEST';
export const CHAT_MESSAGE_SUCCESS = 'CHAT_MESSAGE_SUCCESS';
export const CHAT_MESSAGE_FAIL = 'CHAT_MESSAGE_FAIL';
export const CHAT_CLEAR_MESSAGES = 'CHAT_CLEAR_MESSAGES';

const API_URL = 'http://localhost:8000/api/v1/chat/ask/';

export const sendChatMessage = (message) => async (dispatch) => {
  dispatch({ type: CHAT_MESSAGE_REQUEST });
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.post(
      API_URL,
      { message },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    dispatch({
      type: CHAT_MESSAGE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message || 'Failed to get response';
    dispatch({
      type: CHAT_MESSAGE_FAIL,
      payload: errorMsg,
    });
  }
};

export const clearChatMessages = () => (dispatch) => {
  dispatch({ type: CHAT_CLEAR_MESSAGES });
};
