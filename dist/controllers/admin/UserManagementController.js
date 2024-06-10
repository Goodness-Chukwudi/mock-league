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
const error_response_message_1 = require("../../common/constant/error_response_message");
const AppValidator_1 = __importDefault(require("../../middlewares/validators/AppValidator"));
const user_privilege_service_1 = require("../../services/user_privilege_service");
const user_service_1 = require("../../services/user_service");
const BaseApiController_1 = __importDefault(require("../base controllers/BaseApiController"));
class UserManagementController extends BaseApiController_1.default {
    constructor() {
        super();
    }
    initializeServices() { }
    initializeMiddleware() {
        this.appValidator = new AppValidator_1.default(this.router);
    }
    initializeRoutes() {
        this.listUsers("/"); //GET
        this.getUser("/:id"); //GET
        this.assignUserPrivilege("/privileges"); //POST
    }
    listUsers(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let query = {};
                if (req.query.status)
                    query = Object.assign(Object.assign({}, query), { status: req.query.status });
                if (req.query.email)
                    query = Object.assign(Object.assign({}, query), { email: req.query.email });
                if (req.query.gender)
                    query = Object.assign(Object.assign({}, query), { gender: req.query.gender });
                if (req.query.search)
                    query = Object.assign(Object.assign({}, query), { $or: [
                            { first_name: new RegExp(`${req.query.search}`, "i") },
                            { last_name: new RegExp(`${req.query.search}`, "i") },
                            { middle_name: new RegExp(`${req.query.search}`, "i") }
                        ] });
                let limit;
                let page;
                if (req.query.limit)
                    limit = Number(req.query.limit);
                if (req.query.page)
                    page = Number(req.query.page);
                const users = yield user_service_1.userRepository.paginate(query, { limit, page });
                this.sendSuccessResponse(res, users);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    getUser(path) {
        this.router.get(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.userRepository.findById(req.params.id);
                if (!user) {
                    const error = new Error("User with the provided id not found");
                    return this.sendErrorResponse(res, error, (0, error_response_message_1.resourceNotFound)("user"), 404);
                }
                this.sendSuccessResponse(res, user);
            }
            catch (error) {
                this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    assignUserPrivilege(path) {
        this.router.post(path, this.appValidator.validatePrivilegeAssignment);
        this.router.post(path, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;
                const privilege = {
                    user: body.user,
                    role: body.role,
                    assigned_by: user.id
                };
                yield user_privilege_service_1.privilegeRepository.save(privilege);
                return this.sendSuccessResponse(res);
            }
            catch (error) {
                return this.sendErrorResponse(res, error, error_response_message_1.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
}
exports.default = new UserManagementController().router;
//# sourceMappingURL=UserManagementController.js.map