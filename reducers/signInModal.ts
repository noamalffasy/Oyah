import * as SignInModalActionTypes from "../actiontypes/signInModal";

const initialState = { state: "close" };

function SignInModal(state = initialState, action) {
  switch (action.type) {
    case SignInModalActionTypes.OPEN:
      console.log(action);
      return {
        ...state,
        state: "open",
        whatToOpen: action.whatToOpen
      };
    case SignInModalActionTypes.CLOSE:
      return {
        ...state,
        state: "close"
      };
    default:
      return state;
  }
}

export default SignInModal;
