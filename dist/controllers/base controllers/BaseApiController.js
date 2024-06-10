"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserMiddleware_1 = __importDefault(require("../../middlewares/UserMiddleware"));
const BaseResponseHandlerController_1 = __importDefault(require("./BaseResponseHandlerController"));
const RequestUtils_1 = __importDefault(require("../../common/utils/RequestUtils"));
/**
 * An abstract class that provides a base controller for all API controllers.
 * Controllers that extends this class get access to:
 * - an instance of the following classes: RequestUtils, UserMiddleware
 * - Other non private members of the BaseResponseHandler class
 * - The express router of the request
 * - an abstract method initServices that needs to be implemented when initializing services
 * - an abstract method initializeMiddleware that needs to be implemented when initializing middlewares
 * - an abstract method initializeRoutes that needs to be implemented when initializing routes
*/
class BaseApiController extends BaseResponseHandlerController_1.default {
    constructor() {
        super();
        this.router = express_1.default.Router();
        this.userMiddleWare = new UserMiddleware_1.default(this.router);
        this.requestUtils = new RequestUtils_1.default(this.router);
        this.initializeServices();
        this.initializeMiddleware();
        this.initializeRoutes();
    }
}
exports.default = BaseApiController;
//# sourceMappingURL=BaseApiController.js.map