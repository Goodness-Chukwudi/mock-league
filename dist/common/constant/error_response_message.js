"use strict";
/**
 * Provides response messages and methods that generates customized error messages for http error responses.
 * - The messages returned are of type IResponseMessage
 * - IResponseMessage has a response_code field of type number
 * - In addition to the regular http error codes being returned, the response_code field provides a more specific way to track errors on the client side.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DUPLICATE_USER_ROLE = exports.UNABLE_TO_LOGIN = exports.INVALID_SESSION_USER = exports.PASSWORD_MISMATCH = exports.INVALID_PERMISSION = exports.badRequestError = exports.AUTHENTICATION_EXPIRED = exports.INVALID_TOKEN = exports.INVALID_LOGIN = exports.UNABLE_TO_COMPLETE_REQUEST = exports.DUPLICATE_PHONE = exports.DUPLICATE_EMAIL = exports.resourceNotFound = exports.requiredField = void 0;
const requiredField = (field) => {
    return {
        response_code: 2,
        message: field + " is required",
    };
};
exports.requiredField = requiredField;
const resourceNotFound = (resource) => {
    return {
        response_code: 3,
        message: resource + " not found",
    };
};
exports.resourceNotFound = resourceNotFound;
const DUPLICATE_EMAIL = Object.freeze({
    response_code: 4,
    message: "This email already exist, please try a different email",
});
exports.DUPLICATE_EMAIL = DUPLICATE_EMAIL;
const DUPLICATE_PHONE = Object.freeze({
    response_code: 5,
    message: "This phone number already exist, please try a different phone number",
});
exports.DUPLICATE_PHONE = DUPLICATE_PHONE;
const UNABLE_TO_COMPLETE_REQUEST = Object.freeze({
    response_code: 6,
    message: "Unable to complete request",
});
exports.UNABLE_TO_COMPLETE_REQUEST = UNABLE_TO_COMPLETE_REQUEST;
const INVALID_LOGIN = Object.freeze({
    response_code: 7,
    message: "Invalid email or password",
});
exports.INVALID_LOGIN = INVALID_LOGIN;
const INVALID_TOKEN = Object.freeze({
    response_code: 8,
    message: "Unable to authenticate request. Please login to continue",
});
exports.INVALID_TOKEN = INVALID_TOKEN;
const AUTHENTICATION_EXPIRED = Object.freeze({
    response_code: 9,
    message: "Authentication expired. Please login again",
});
exports.AUTHENTICATION_EXPIRED = AUTHENTICATION_EXPIRED;
const UNABLE_TO_LOGIN = Object.freeze({
    response_code: 10,
    message: "Unable to login",
});
exports.UNABLE_TO_LOGIN = UNABLE_TO_LOGIN;
const INVALID_SESSION_USER = Object.freeze({
    response_code: 11,
    message: "Unauthenticated user session. Please login again",
});
exports.INVALID_SESSION_USER = INVALID_SESSION_USER;
const PASSWORD_MISMATCH = Object.freeze({
    response_code: 12,
    message: "Passwords do not match",
});
exports.PASSWORD_MISMATCH = PASSWORD_MISMATCH;
const INVALID_PERMISSION = Object.freeze({
    response_code: 13,
    message: "Sorry you do not have permission to perform this action",
});
exports.INVALID_PERMISSION = INVALID_PERMISSION;
const badRequestError = (message) => {
    return {
        response_code: 14,
        message: message
    };
};
exports.badRequestError = badRequestError;
const DUPLICATE_USER_ROLE = Object.freeze({
    response_code: 15,
    message: "This user already has this privilege",
});
exports.DUPLICATE_USER_ROLE = DUPLICATE_USER_ROLE;
//# sourceMappingURL=error_response_message.js.map