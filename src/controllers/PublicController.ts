import BaseApiController from "./base controllers/BaseApiController";
import { UNABLE_TO_COMPLETE_REQUEST, UNABLE_TO_LOGIN } from "../common/constant/error_response_message";
import { LOGIN_SUCCESSFUL, SIGNUP_SUCCESS } from "../common/constant/success_response_message";
import AppValidator from "../middlewares/validators/AppValidator";
import { userService, userRepository } from "../services/user_service";
import { passwordRepository } from "../services/password_service";
import { createMongooseTransaction } from "../common/utils/app_utils";
import { teamRepository } from "../services/team_service";
import { fixtureRepository } from "../services/fixture_service";
import { ITEM_STATUS } from "../data/enums/enum";
import { privilegeRepository } from "../services/user_privilege_service";
import { getEndOfDay, getStartOfDay } from "../common/utils/date_utils";

class PublicController extends BaseApiController {

    appValidator: AppValidator;

    constructor() {
        super();
    }

    protected initializeServices() {}
    
    protected initializeMiddleware() {
        this.appValidator = new AppValidator(this.router);
    }

    protected initializeRoutes() {
        this.login("/login"); //POST
        this.signup("/signup"); //POST
        this.searchTeams("/teams"); //GET
        this.searchFixtures("/fixtures"); //GET
    }

    signup(path:string) {
        this.router.post(path, this.appValidator.validateUserSignup, this.userMiddleWare.hashNewPassword);
        this.router.post(path, async (req, res) => {
            const session = await createMongooseTransaction();
            try {
                const body = req.body;
                const userData = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    middle_name: body.middle_name,
                    email: body.email,
                    phone: body.phone,
                    gender: body.gender
                }
                const user = await userRepository.save(userData, session);
                const passwordData = {
                    password: body.password,
                    email: user.email,
                    user: user.id
                }
                await passwordRepository.save(passwordData, session);

                const { token, loginSession} = await userService.loginUser(user.id, session);

                const roles:string[] = [];
                const userPrivileges = await privilegeRepository.find({user: user._id, status: ITEM_STATUS.ACTIVE});
                userPrivileges.forEach(privilege => {
                    roles.push(privilege.role);
                })
                req.session.data = { user, login_session: loginSession, user_roles: roles };

                const response = {
                    message: SIGNUP_SUCCESS,
                    token: token,
                    user: user
                }

                return this.sendSuccessResponse(res, response, 201, session);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500, session);
            }
        });
    }

    login(path:string) {
        this.router.post(path,
            this.appValidator.validateUserLogin,
            this.userMiddleWare.loadUserToRequestByEmail,
            this.userMiddleWare.validatePassword,
            this.userMiddleWare.logoutExistingSession
        );

        this.router.post(path, async (req, res) => {
            try {
                const user = this.requestUtils.getRequestUser();
                const { token, loginSession } = await userService.loginUser(user.id);

                const roles:string[] = [];
                const userPrivileges = await privilegeRepository.find({user: user._id, status: ITEM_STATUS.ACTIVE});
                userPrivileges.forEach(privilege => {
                    roles.push(privilege.role);
                })
                req.session.data = { user, login_session: loginSession, user_roles: roles };

                const response = {
                    message: LOGIN_SUCCESSFUL,
                    token: token,
                    user: user
                }

                return this.sendSuccessResponse(res, response);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_LOGIN, 500);
            }
        });
    }

    searchTeams(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const reqQuery: Record<string, any> = req.query;
                let query = {};

                if (reqQuery.status) query = {...query, status: reqQuery.status};
                if (reqQuery.search) query = {
                    ...query,
                    $or: [
                        {name: new RegExp(`${req.query.search}`, "i")},
                        {slogan: new RegExp(`${req.query.search}`, "i")},
                        {stadium: new RegExp(`${req.query.search}`, "i")}
                    ]
                };

                let limit;
                let page;
                if (reqQuery.limit) limit = Number(reqQuery.limit);
                if (reqQuery.page) page = Number(reqQuery.page);

                const teams = await teamRepository.paginate(query, limit, page);
        
                this.sendSuccessResponse(res, teams);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }

    searchFixtures(path:string) {
        this.router.get(path, async (req, res) => {
            try {
                const reqQuery: Record<string, any> = req.query;
                let query = {};

                if (reqQuery.status) query = {...query, status: reqQuery.status};
                if (reqQuery.search) query = {
                    ...query,
                    $or: [
                        {"home_team.name": new RegExp(`${req.query.search}`, "i")},
                        {"away_team.name": new RegExp(`${req.query.search}`, "i")},
                        {venue: new RegExp(`${req.query.search}`, "i")},
                        {referee: new RegExp(`${req.query.search}`, "i")}
                    ]
                };

                if (reqQuery.start_date && reqQuery.end_date) {
                    const startDate = getStartOfDay(reqQuery.start_date)
                    const endDate = getEndOfDay(reqQuery.end_date)
                    query = {...query, kick_off: { $gte: startDate, $lte: endDate }}
                }

                let limit;
                let page;
                if (reqQuery.limit) limit = Number(reqQuery.limit);
                if (reqQuery.page) page = Number(reqQuery.page);

                const fixtures = await fixtureRepository.paginate(query, limit, page);
        
                this.sendSuccessResponse(res, fixtures);
            } catch (error:any) {
                this.sendErrorResponse(res, error, UNABLE_TO_COMPLETE_REQUEST, 500) 
            }
        });
    }
}

export default new PublicController().router;
