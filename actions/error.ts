import * as ErrorActionTypes from '../actiontypes/error';

export const setError = (error: any) => {
    return {
        type: ErrorActionTypes.SETERROR,
        error
    };
};