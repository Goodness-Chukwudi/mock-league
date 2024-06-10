"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestUtils_1 = __importDefault(require("../common/utils/RequestUtils"));
const BaseResponseHandlerController_1 = __importDefault(require("../controllers/base controllers/BaseResponseHandlerController"));
/**
 * An abstract class that provides a base middleware for all routers.
 * Middleware classes that extend this class get access to:
 * - an instance of RequestUtils
 * - Other non private members of the BaseResponseHandler class
 * - The express router of the request
*/
class BaseRouterMiddleware extends BaseResponseHandlerController_1.default {
    constructor(appRouter) {
        super();
        this.router = appRouter;
        this.requestUtils = new RequestUtils_1.default(this.router);
    }
}
exports.default = BaseRouterMiddleware;
//# sourceMappingURL=BaseRouterMiddleware.js.map