"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthToken = exports.verifyJwtToken = exports.hashData = exports.validateHashedData = exports.getTokenFromRequest = void 0;
const environment_variables_1 = __importDefault(require("../config/environment_variables"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates an authentication token. Signs the provided data into the token
 * @param {ILoginSession} loginSession the login session of type ILoginSession, created for a user's login
 * @returns {string} an alphanumeric string of the specified length
*/
const createAuthToken = (userId, loginSessionId) => {
    try {
        const data = { user: userId, loginSession: loginSessionId };
        const token = jsonwebtoken_1.default.sign({ data: data }, environment_variables_1.default.JWT_PRIVATE_KEY, { expiresIn: environment_variables_1.default.JWT_EXPIRY });
        return token;
    }
    catch (error) {
        throw error;
    }
};
exports.createAuthToken = createAuthToken;
/**
 * Verifies a jwt token and decodes the payload
 * @callback jwtCallBack
 * @param {string} token the jwt token to be verified
 * @param {jwtCallBack} callback a callback function passed to jwt verify api on verification
 * @returns void
*/
const verifyJwtToken = (token, callback) => {
    jsonwebtoken_1.default.verify(token, environment_variables_1.default.JWT_PRIVATE_KEY, (err, decoded) => {
        callback(err, decoded);
    });
};
exports.verifyJwtToken = verifyJwtToken;
/**
 * Hashes the provided data
 * @param {string} data the data to be hashed
 * @param {number} rounds number of rounds to use to generate the hash salt. Defaults to 12
 * @returns {Promise<string>} A promise that resolves to string
*/
const hashData = (data, rounds = 12) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const salt = yield bcryptjs_1.default.genSalt(rounds);
            const hash = bcryptjs_1.default.hash(data, salt);
            resolve(hash);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.hashData = hashData;
/**
 * Compares and validates the equality of a value with a hashed data
 * @param {string} value the value to be compared with a hashed data
 * @param {string} hashedData the hashed data to compare with the provided value
 * @returns {boolean} A promise that resolves to boolean. Returns true if the two values are equal, other wise false
*/
const validateHashedData = (value, hashedData) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const valid = yield bcryptjs_1.default.compare(value, hashedData);
            resolve(valid);
        }
        catch (error) {
            reject(error);
        }
    }));
};
exports.validateHashedData = validateHashedData;
/**
 * Retrieves the bearer token from the authorization header of an express request
 * @param {Request} req an instance of the express request to get the token from
 * @returns {string}  a string
*/
const getTokenFromRequest = (req) => {
    const payload = req.headers.authorization || "";
    let jwt = "";
    if (payload) {
        if (payload.split(" ").length > 1) {
            jwt = payload.split(" ")[1];
            return jwt;
        }
    }
    return jwt;
};
exports.getTokenFromRequest = getTokenFromRequest;
//# sourceMappingURL=auth_utils.js.map