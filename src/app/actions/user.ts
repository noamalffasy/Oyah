import * as userActionTypes from '../actiontypes/user';

export const login = (user: any) => {
    return {
        type: userActionTypes.LOGIN,
        user
    };
};

export const logout = () => {
    return {
        type: userActionTypes.LOGOUT
    }
}