import {
  CHAT_MESSAGE_REQUEST,
  CHAT_MESSAGE_SUCCESS,
  CHAT_MESSAGE_FAIL,
  CHAT_CLEAR_MESSAGES,
} from '../actions/chatActions';

const initialState = {
  messages: [], // Array of {id, type: 'user'|'bot', text, timestamp}
  loading: false,
  error: null,
  usageLeft: 0,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null };
    
    case CHAT_MESSAGE_SUCCESS:
      const newMessages = [
        ...state.messages,
        {
          id: Date.now(),
          type: 'bot',
          text: action.payload.response,
          timestamp: new Date(),
        }
      ];
      return {
        ...state,
        messages: newMessages,
        loading: false,
        usageLeft: action.payload.usage_left,
        error: null,
      };
    
    case CHAT_MESSAGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    case CHAT_CLEAR_MESSAGES:
      return { ...state, messages: [], error: null };
    
    default:
      return state;
  }
};
