import * as UserActionTypes from "../actiontypes/user";

import { add as addCookie } from "../utils/cookie";

const initialState = {};

function User(state = initialState, action: any) {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      if (action.user.token) {
        addCookie(document.cookie, "token", action.user.token);
      }
      return {
        ...state,
        ...action.user
      };
    case UserActionTypes.LOGOUT:
      return {};
    default:
      return state;
  }
}

export default User;
