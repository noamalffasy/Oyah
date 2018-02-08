import * as UserActionTypes from "../actiontypes/user";

const initialState = {};

function User(state = initialState, action: any) {
  switch (action.type) {
    case UserActionTypes.LOGIN:
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
