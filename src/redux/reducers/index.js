import { SET_USER, SET_PROFILE_IMG } from "../constants/action-types";

const initialState = {
  rooms: [],
  messageSubs: [],
  selectedRoom: null,
  user: null,
  notifications: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, {
        user: action.payload,
      });
    case SET_PROFILE_IMG:
      return Object.assign({}, state, {
        user: { ...state.user, profileImg: action.payload },
      });
    default:
      return state;
  }
}

export default rootReducer;
