/**
 * Provides response messages and methods that generates customized error messages for http error responses.
 * - The messages returned are of type IResponseMessage
 * - IResponseMessage has a response_code field of type number
 * - In addition to the regular http error codes being returned, the response_code field provides a more specific way to track errors on the client side.
*/

const requiredField = (field: string) => {
    return {
        response_code: 2,
        message: field + " is required",
    };
}

const resourceNotFound = (resource: string) => {
    return {
        response_code: 3,
        message: resource + " not found",
    };
}

const DUPLICATE_EMAIL = Object.freeze({
    response_code: 4,
    message: "This email already exist, please try a different email",
});

const DUPLICATE_PHONE = Object.freeze({
    response_code: 5,
    message: "This phone number already exist, please try a different phone number",
});

const UNABLE_TO_COMPLETE_REQUEST = Object.freeze({
    response_code: 6,
    message: "Unable to complete request",
});

const INVALID_LOGIN = Object.freeze({
    response_code: 7,
    message: "Invalid email or password",
});

const INVALID_TOKEN = Object.freeze({
    response_code: 8,
    message: "Unable to authenticate request. Please login to continue",
});

const AUTHENTICATION_EXPIRED = Object.freeze({
    response_code: 9,
    message: "Authentication expired. Please login again",
});

const UNABLE_TO_LOGIN = Object.freeze({
    response_code: 10,
    message: "Unable to login",
});

const INVALID_SESSION_USER = Object.freeze({
    response_code: 11,
    message: "Unauthenticated user session. Please login again",
});

const PASSWORD_MISMATCH = Object.freeze({
    response_code: 12,
    message: "Passwords do not match",
});

const INVALID_PERMISSION = Object.freeze({
    response_code: 13,
    message: "Sorry you do not have permission to perform this action",
});

const badRequestError = (message: string) => {
    return {
        response_code: 14,
        message: message
    }
}

const DUPLICATE_USER_ROLE = Object.freeze({
    response_code: 15,
    message: "This user already has this privilege",
});

export {
    requiredField,
    resourceNotFound,
    DUPLICATE_EMAIL,
    DUPLICATE_PHONE,
    UNABLE_TO_COMPLETE_REQUEST,
    INVALID_LOGIN,
    INVALID_TOKEN,
    AUTHENTICATION_EXPIRED,
    badRequestError,
    INVALID_PERMISSION,
    PASSWORD_MISMATCH,
    INVALID_SESSION_USER,
    UNABLE_TO_LOGIN,
    DUPLICATE_USER_ROLE
};