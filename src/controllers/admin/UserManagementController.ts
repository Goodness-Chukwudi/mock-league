import { UNABLE_TO_COMPLETE_REQUEST, resourceNotFound } from "../../common/constant/error_response_message";
import { ITEM_STATUS } from "../../data/enums/enum";
import { DbSortQuery } from "../../data/interfaces/types";
import AppValidator from "../../middlewares/validators/AppValidator";
import { privilegeRepository } from "../../services/user_privilege_service";
import { userRepository } from "../../services/user_service";
import BaseApiController from "../base controllers/BaseApiController";

class UserManagementController extends BaseApiController {
    private appValidator: AppValidator;
    constructor() {
        super();
    }

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.appValidator = new AppValidator(this.router);
    }

    protected initializeRoutes() {
        this.listUsers("/"); //GET
        this.getUser("/:id"); //GET
        this.assignUserPrivilege("/privileges"); //POST
        this.removeUserPrivilege("/privileges/:id/remove"); //PATCH
    }

    listUsers(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                let query = {};
                if (req.query.status) query = {...query, status: req.query.status};
                if (req.query.email) query = {...query, email: req.query.email};
                if (req.query.gender) query = {...query, gender: req.query.gender};
                if (req.query.search) query = {
                    ...query,
                    $or: [
                        {first_name: new RegExp(`${req.query.search}`, "i")},
                        {last_name: new RegExp(`${req.query.search}`, "i")},
                        {middle_name: new RegExp(`${req.query.search}`, "i")}
                    ]
                };

                let limit;
                let page;
                let sort;
                if (req.query.limit) limit = Number(req.query.limit);
                if (req.query.page) page = Number(req.query.page);
                if (req.query.sort) sort = req.query.sort as unknown as DbSortQuery;
                
                const selectedFields = ["first_name", "last_name", "middle_name", "gender", "status"]

                const users = await userRepository.paginate(query, limit, page, sort, selectedFields);

                this.sendSuccessResponse(res, users);
            } catch (error: any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    getUser(path:string) {
        this.router.get(path, this.appValidator.validateDefaultParams, async (req, res) => {
            try {
                const user = await userRepository.findById(req.params.id);
                if (!user) {
                    const error = new Error("User with the provided id not found");
                    return this.sendErrorResponse(res, error, resourceNotFound("user"), 404);
                }

                this.sendSuccessResponse(res, user);
            } catch (error: any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        });
    }

    assignUserPrivilege(path:string) {
        this.router.post(path, this.appValidator.validatePrivilegeAssignment);
        this.router.post(path, async (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                const body = req.body;

                const privilege = {
                    user: body.user,
                    role: body.role,
                    assigned_by: user.id
                }
                await privilegeRepository.save(privilege);

                return this.sendSuccessResponse(res);
            } catch (error:any) {
                return this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500)
            }
        });
    }

    removeUserPrivilege(path:string) {
        this.router.patch(path, async (req, res) => {
            try {

                await privilegeRepository.updateById(req.params.id, {status: ITEM_STATUS.DEACTIVATED});

                return this.sendSuccessResponse(res);
            } catch (error:any) {
                return this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500)
            }
        });
    }
}

export default new UserManagementController().router;
