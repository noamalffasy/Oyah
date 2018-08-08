import * as ErrorActionTypes from "../actiontypes/error";

const initialState = false;

function error(state = initialState, action: any) {
  switch (action.type) {
    case ErrorActionTypes.SETERROR:
      return action.error;
    default:
      return state;
  }
}

export default error;
