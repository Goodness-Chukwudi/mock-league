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
const Logger_1 = __importDefault(require("../../common/utils/Logger"));
class BaseResponseHandler {
    constructor() {
        this.logger = new Logger_1.default();
    }
    /**
     * Terminates the http request with the provided express res object.
     * An error response is created with the provided error details and returned to the client.
     * @param {Request} res The express response object to be used to send the error response
     * @param {Error} error The error object. This is only for log purposes and it's not returned to client
     * @param {IResponseMessage} responseMessage A response message of type IResponseMessage
     * @param {number} statusCode HTTP status code of the error response
     * @param {ClientSession} session An optional mongoose client session, required to abort a running database transaction if any
     * @returns {void} void
    */
    sendErrorResponse(res, err, responseMessage, statusCode, session, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (session)
                yield session.abortTransaction();
            const response = {
                message: responseMessage.message,
                success: false,
                error_code: responseMessage.response_code,
                data: data
            };
            if (statusCode == 500)
                this.logger.captureError(err, res);
            res.status(statusCode).json(response);
        });
    }
    /**
     * Terminates the http request with the provided express res object.
     * A success response is created and an optional data object data returned to the client.
     * @param {Response} res The express response object to be used to send the success response
     * @param {*} data An optional data to be returned to the user
     * @param {ClientSession} session An optional mongoose client session, required to commit a running database transaction if any
     * @param {number} statusCode HTTP status code of the success response
     * @returns  void
    */
    sendSuccessResponse(res_1) {
        return __awaiter(this, arguments, void 0, function* (res, data = null, statusCode = 200, session) {
            if (session)
                yield session.commitTransaction();
            const response = {
                success: true,
                data: data
            };
            res.status(statusCode).json(response);
        });
    }
}
exports.default = BaseResponseHandler;
//# sourceMappingURL=BaseResponseHandlerController.js.map