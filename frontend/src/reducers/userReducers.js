const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_PROFILE_REQUEST':
      return { ...state, loading: true };
    case 'USER_PROFILE_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'USER_PROFILE_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
