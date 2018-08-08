import * as SignInModalActionTypes from '../actiontypes/signInModal';

export const open = whatToOpen => {
    return {
        type: SignInModalActionTypes.OPEN,
        whatToOpen: typeof whatToOpen === "string" ? whatToOpen : ""
    };
};

export const close = CLOSE => {
    return {
        type: SignInModalActionTypes.CLOSE,
        CLOSE
    };
};